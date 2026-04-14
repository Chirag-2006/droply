"use client";

import { useState, useEffect, useRef } from "react";
import { File as FileType } from "@/lib/db/schema";
import { 
  FileText,  
  MoreVertical, 
  Download, 
  Trash2, 
  Star,
  ExternalLink,
  Loader2,
  Folder,
  AlertTriangle,
  RefreshCcw,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Image from "next/image";
import { FileGridSkeleton, FileSkeleton } from "./skeletons/FileSkeleton";

interface FileListProps {
  userId: string;
  parentId: string | null;
  refreshTrigger: number;
  onFolderChange: (folderId: string | null) => void;
  onAction?: () => void;
  viewMode: "grid" | "list";
  showOnlyStarred?: boolean;
  showOnlyTrash?: boolean;
}

export default function FileList({
  userId,
  parentId,
  refreshTrigger,
  onFolderChange,
  onAction,
  viewMode,
  showOnlyStarred = false,
  showOnlyTrash = false,
}: FileListProps) {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileToDelete, setFileToDelete] = useState<FileType | null>(null);
  const [fileToPermanentDelete, setFileToPermanentDelete] = useState<FileType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // To keep track of debounced API calls per file
  const starDebounceRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    // Cleanup timeouts on unmount
    return () => {
      starDebounceRefs.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `/api/files?userId=${userId}`;
        if (showOnlyTrash) {
          url += `&isTrash=true`;
        } else if (showOnlyStarred) {
          url += `&isStarred=true`;
        } else if (parentId) {
          url += `&parentId=${parentId}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch files");
        }
        const data = await response.json();
        setFiles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [userId, parentId, refreshTrigger, showOnlyStarred, showOnlyTrash]);

  const toggleStar = async (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    if (showOnlyTrash) return;
    
    const targetFile = files.find(f => f.id === fileId);
    if (!targetFile) return;

    const nextIsStarred = !targetFile.isStarred;
    
    setFiles((prev) => {
      if (showOnlyStarred && !nextIsStarred) {
         return prev.filter(f => f.id !== fileId);
      }
      return prev.map((f) => (f.id === fileId ? { ...f, isStarred: nextIsStarred } : f));
    });

    if (starDebounceRefs.current.has(fileId)) {
      clearTimeout(starDebounceRefs.current.get(fileId));
    }

    const timeoutId = setTimeout(async () => {
      starDebounceRefs.current.delete(fileId);
      
      try {
        const response = await fetch(`/api/files/${fileId}/star`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isStarred: nextIsStarred }),
        });
        
        if (!response.ok) {
          throw new Error("Failed to update star status");
        }
        
        const updatedFile = await response.json();
        
        setFiles((prev) => {
           const exists = prev.some(f => f.id === fileId);
           if (!exists && showOnlyStarred && updatedFile.isStarred) {
             return [...prev, updatedFile];
           }
           return prev.map((f) => (f.id === fileId ? updatedFile : f));
        });

        // Trigger refresh for stats
        if (onAction) onAction();
      } catch (error) {
        console.error("Error toggling star:", error);
        setFiles((prev) => {
           const exists = prev.some(f => f.id === fileId);
           if (!exists && showOnlyStarred && !nextIsStarred) {
             return prev; 
           }
           return prev.map((f) => (f.id === fileId ? targetFile : f));
        });
      }
    }, 1500);

    starDebounceRefs.current.set(fileId, timeoutId);
  };

  const deleteFile = async () => {
    if (!fileToDelete) return;
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/files/${fileToDelete.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isTrash: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to move file to trash");
      }

      setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
      toast.success(`${fileToDelete.isFolder ? "Folder" : "File"} moved to trash`, {
        description: `"${fileToDelete.name}" is now in your trash bin.`,
      });
      
      // Trigger refresh for stats
      if (onAction) onAction();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error deleting file");
    } finally {
      setIsDeleting(false);
      setFileToDelete(null);
    }
  };

  const restoreFile = async (file: FileType) => {
    try {
      const response = await fetch(`/api/files/${file.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isTrash: false }),
      });

      if (!response.ok) {
        throw new Error("Failed to restore file");
      }

      setFiles((prev) => prev.filter((f) => f.id !== file.id));
      toast.success(`${file.isFolder ? "Folder" : "File"} restored`, {
        description: `"${file.name}" has been restored to its original location.`,
      });

      // Trigger refresh for stats
      if (onAction) onAction();
    } catch (error) {
      console.error("Restore error:", error);
      toast.error("Error restoring file");
    }
  };

  const permanentDelete = async () => {
    if (!fileToPermanentDelete) return;
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/files/${fileToPermanentDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete file permanently");
      }

      setFiles((prev) => prev.filter((f) => f.id !== fileToPermanentDelete.id));
      toast.success(`${fileToPermanentDelete.isFolder ? "Folder" : "File"} deleted permanently`, {
        description: `"${fileToPermanentDelete.name}" has been removed forever.`,
      });

      // Trigger refresh for stats
      if (onAction) onAction();
    } catch (error) {
      console.error("Permanent delete error:", error);
      toast.error("Error deleting file permanently");
    } finally {
      setIsDeleting(false);
      setFileToPermanentDelete(null);
    }
  };


  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return viewMode === "grid" ? <FileGridSkeleton /> : (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map(i => <FileSkeleton key={i} />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <Trash2 className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold">Error loading files</h3>
        <p className="text-muted-foreground max-w-62.5">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4 rounded-xl"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileText className="w-10 h-10 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-semibold">No files found</h3>
        <p className="text-muted-foreground max-w-50">
          {showOnlyTrash 
            ? "Your trash bin is empty." 
            : showOnlyStarred 
              ? "You haven't starred any files yet." 
              : parentId ? "This folder is empty." : "Start uploading your images to see them here."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Dialog open={!!fileToDelete} onOpenChange={(open) => !open && setFileToDelete(null)}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Move to Trash?
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Are you sure you want to move <span className="font-bold text-foreground">&quot;{fileToDelete?.name}&quot;</span> to trash? 
              {fileToDelete?.isFolder && " This will move all its contents too."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setFileToDelete(null)} className="rounded-xl">Cancel</Button>
            <Button variant="destructive" onClick={deleteFile} disabled={isDeleting} className="rounded-xl">
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Move to Trash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!fileToPermanentDelete} onOpenChange={(open) => !open && setFileToPermanentDelete(null)}>
        <DialogContent className="rounded-3xl border-destructive/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Delete Permanently?
            </DialogTitle>
            <DialogDescription className="text-base pt-2 text-destructive/80 font-medium">
              This action CANNOT be undone. <span className="font-bold underline">&quot;{fileToPermanentDelete?.name}&quot;</span> will be gone forever.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setFileToPermanentDelete(null)} className="rounded-xl">Keep it</Button>
            <Button variant="destructive" onClick={permanentDelete} disabled={isDeleting} className="rounded-xl">
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Delete Forever
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {files.map((file) => (
            <Card 
              key={file.id} 
              className={`group border-none bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all rounded-2xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer`}
              onClick={() => {
                if (showOnlyTrash) return;
                if (file.isFolder) {
                  onFolderChange(file.id);
                } else {
                  window.open(file.fileUrl, "_blank");
                }
              }}
            >
              <CardContent className="p-0">
                <div className="aspect-video relative bg-muted/30 overflow-hidden flex items-center justify-center">
                  {file.isFolder ? (
                    <Folder className="w-16 h-16 text-primary/40 fill-primary/10" />
                  ) : file.type.startsWith("image/") ? (
                    <Image src={file.fileUrl} alt={file.name} fill className="object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <FileText className="w-12 h-12 text-muted-foreground/30" />
                  )}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    <FileActions 
                      file={file} 
                      onDelete={() => setFileToDelete(file)} 
                      onRestore={() => restoreFile(file)}
                      onPermanentDelete={() => setFileToPermanentDelete(file)}
                      isTrashView={showOnlyTrash}
                    />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1 overflow-hidden">
                    {!showOnlyTrash && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 rounded-full hover:bg-yellow-400/10"
                        onClick={(e) => toggleStar(e, file.id)}
                      >
                        <Star className={`h-3.5 w-3.5 ${file.isStarred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                      </Button>
                    )}
                    <p className="font-medium truncate text-sm">{file.name}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                        {file.isFolder ? 'Folder' : formatSize(file.size)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{formatDate(file.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-12 px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border/50">
            <div className="col-span-6">Name</div>
            <div className="col-span-2">Size</div>
            <div className="col-span-3">Date</div>
            <div className="col-span-1"></div>
          </div>
          {files.map((file) => (
            <div 
              key={file.id} 
              className={`grid grid-cols-12 items-center px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors group cursor-pointer`}
              onClick={() => {
                if (showOnlyTrash) return;
                if (file.isFolder) {
                  onFolderChange(file.id);
                } else {
                  window.open(file.fileUrl, "_blank");
                }
              }}
            >
              <div className="col-span-6 flex items-center gap-2">
                {!showOnlyTrash && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-full hover:bg-yellow-400/10"
                    onClick={(e) => toggleStar(e, file.id)}
                  >
                    <Star className={`h-4 w-4 ${file.isStarred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                  </Button>
                )}
                {file.isFolder ? (
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Folder className="w-5 h-5 text-primary fill-primary/10" />
                  </div>
                ) : file.type.startsWith("image/") ? (
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                    <Image src={file.fileUrl} alt={file.name} width={40} height={40} className="object-cover" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                )}
                <span className="font-medium truncate text-sm">{file.name}</span>
              </div>
              <div className="col-span-2 text-xs text-muted-foreground">{file.isFolder ? "—" : formatSize(file.size)}</div>
              <div className="col-span-3 text-xs text-muted-foreground">{formatDate(file.createdAt)}</div>
              <div className="col-span-1 flex justify-end" onClick={(e) => e.stopPropagation()}>
                <FileActions 
                  file={file} 
                  onDelete={() => setFileToDelete(file)} 
                  onRestore={() => restoreFile(file)}
                  onPermanentDelete={() => setFileToPermanentDelete(file)}
                  isTrashView={showOnlyTrash}
                />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function FileActions({ file, onDelete, onRestore, onPermanentDelete, isTrashView }: { 
  file: FileType, 
  onDelete: () => void,
  onRestore: () => void,
  onPermanentDelete: () => void,
  isTrashView: boolean
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-xl">
        {isTrashView ? (
          <>
            <DropdownMenuItem onClick={onRestore} className="rounded-lg">
              <RefreshCcw className="mr-2 h-4 w-4" />
              <span>Restore</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onPermanentDelete} className="text-destructive focus:text-destructive rounded-lg font-bold">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete Permanently</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            {!file.isFolder && (
              <DropdownMenuItem onClick={() => window.open(file.fileUrl, "_blank")} className="rounded-lg">
                <ExternalLink className="mr-2 h-4 w-4" />
                <span>Open Original</span>
              </DropdownMenuItem>
            )}
            {!file.isFolder && (
              <DropdownMenuItem onClick={() => {
                  const link = document.createElement('a');
                  link.href = file.fileUrl;
                  link.download = file.name;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
              }} className="rounded-lg">
                <Download className="mr-2 h-4 w-4" />
                <span>Download</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-destructive focus:text-destructive rounded-lg" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Move to Trash</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
