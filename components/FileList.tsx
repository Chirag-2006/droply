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
  Folder
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface FileListProps {
  userId: string;
  parentId: string | null;
  refreshTrigger: number;
  onFolderChange: (folderId: string | null) => void;
  viewMode: "grid" | "list";
}

export default function FileList({
  userId,
  parentId,
  refreshTrigger,
  onFolderChange,
  viewMode,
  showOnlyStarred = false,
}: FileListProps & { showOnlyStarred?: boolean }) {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        if (showOnlyStarred) {
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
  }, [userId, parentId, refreshTrigger, showOnlyStarred]);

  const toggleStar = async (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    
    // 1. Capture the target file's current state (for UI update)
    const targetFile = files.find(f => f.id === fileId);
    if (!targetFile) return;

    // 2. Optimistically update the UI immediately
    const nextIsStarred = !targetFile.isStarred;
    
    setFiles((prev) => {
      if (showOnlyStarred && !nextIsStarred) {
         return prev.filter(f => f.id !== fileId);
      }
      return prev.map((f) => (f.id === fileId ? { ...f, isStarred: nextIsStarred } : f));
    });

    // 3. Clear existing timeout for this specific file
    if (starDebounceRefs.current.has(fileId)) {
      clearTimeout(starDebounceRefs.current.get(fileId));
    }

    // 4. Set a new 2-second timeout to perform the backend update
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
        
        // Sync the state with server response
        setFiles((prev) => {
           const exists = prev.some(f => f.id === fileId);
           if (!exists && showOnlyStarred && updatedFile.isStarred) {
             return [...prev, updatedFile];
           }
           return prev.map((f) => (f.id === fileId ? updatedFile : f));
        });
      } catch (error) {
        console.error("Error toggling star:", error);
        // Rollback UI on error
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
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading your files...</p>
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
        <p className="text-muted-foreground max-w-[250px]">{error}</p>
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
        <p className="text-muted-foreground max-w-[200px]">
          {showOnlyStarred 
            ? "You haven't starred any files yet." 
            : parentId ? "This folder is empty." : "Start uploading your images to see them here."}
        </p>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {files.map((file) => (
          <Card 
            key={file.id} 
            className={`group border-none bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all rounded-2xl overflow-hidden shadow-sm hover:shadow-md ${file.isFolder ? 'cursor-pointer' : ''}`}
            onClick={() => file.isFolder ? onFolderChange(file.id) : null}
          >
            <CardContent className="p-0">
              <div className="aspect-video relative bg-muted/30 overflow-hidden flex items-center justify-center">
                {file.isFolder ? (
                  <Folder className="w-16 h-16 text-primary/40 fill-primary/10" />
                ) : file.type.startsWith("image/") ? (
                  <Image
                    src={file.fileUrl}
                    alt={file.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <FileText className="w-12 h-12 text-muted-foreground/30" />
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                   <FileActions file={file} />
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1 overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 rounded-full hover:bg-yellow-400/10"
                    onClick={(e) => toggleStar(e, file.id)}
                  >
                    <Star 
                      className={`h-3.5 w-3.5 ${file.isStarred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} 
                    />
                  </Button>
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
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-12 px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border/50">
        <div className="col-span-6">Name</div>
        <div className="col-span-2">Size</div>
        <div className="col-span-3">Date</div>
        <div className="col-span-1"></div>
      </div>
      {files.map((file) => (
        <div 
          key={file.id} 
          className={`grid grid-cols-12 items-center px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors group ${file.isFolder ? 'cursor-pointer' : ''}`}
          onClick={() => file.isFolder ? onFolderChange(file.id) : null}
        >
          <div className="col-span-6 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full hover:bg-yellow-400/10"
              onClick={(e) => toggleStar(e, file.id)}
            >
              <Star 
                className={`h-4 w-4 ${file.isStarred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} 
              />
            </Button>
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
          <div className="col-span-2 text-xs text-muted-foreground">
            {file.isFolder ? "—" : formatSize(file.size)}
          </div>
          <div className="col-span-3 text-xs text-muted-foreground">{formatDate(file.createdAt)}</div>
          <div className="col-span-1 flex justify-end" onClick={(e) => e.stopPropagation()}>
            <FileActions file={file} />
          </div>
        </div>
      ))}
    </div>
  );
}

function FileActions({ file }: { file: FileType }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-xl">
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
        <DropdownMenuItem className="text-destructive focus:text-destructive rounded-lg">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Move to Trash</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
