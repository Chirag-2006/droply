"use client";

import { useState, useEffect } from "react";
import { File as FileType } from "@/lib/db/schema";
import { 
  FileText, 
  Image as ImageIcon, 
  MoreVertical, 
  Download, 
  Trash2, 
  Star,
  ExternalLink,
  Loader2,
  Folder,
  ArrowLeft
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
}: FileListProps) {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `/api/files?userId=${userId}`;
        if (parentId) {
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
  }, [userId, parentId, refreshTrigger]);

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
          {parentId ? "This folder is empty." : "Start uploading your images to see them here."}
        </p>
        {parentId && (
          <Button 
            variant="link" 
            onClick={() => onFolderChange(null)}
            className="mt-2 text-primary"
          >
            Go back to root
          </Button>
        )}
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="space-y-4">
        {parentId && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onFolderChange(null)}
            className="rounded-xl gap-2 hover:bg-primary/5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Root
          </Button>
        )}
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
                  <p className="font-medium truncate text-sm mb-1">{file.name}</p>
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
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {parentId && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onFolderChange(null)}
          className="rounded-xl gap-2 mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Root
        </Button>
      )}
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
          <div className="col-span-6 flex items-center gap-3">
            {file.isFolder ? (
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Folder className="w-5 h-5 text-primary fill-primary/10" />
              </div>
            ) : file.type.startsWith("image/") ? (
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                <Image src={file.fileUrl} alt={file.name} width={40} height={40} className="object-cover" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
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
        <DropdownMenuItem className="rounded-lg">
          <Star className="mr-2 h-4 w-4" />
          <span>Add to Starred</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive focus:text-destructive rounded-lg">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Move to Trash</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
