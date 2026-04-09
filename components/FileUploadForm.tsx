"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileUp, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface FileUploadFormProps {
  userId: string;
  onUploadSuccess: () => void;
  currentFolder: string | null;
}

export default function FileUploadForm({
  userId,
  onUploadSuccess,
  currentFolder,
}: FileUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Only image and PDF files are allowed");
        setFile(null);
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB");
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError(null);
      setSuccess(false);
    }
  };

  const uploadFile = () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    if (currentFolder) {
      formData.append("parentId", currentFolder);
    }

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setProgress(percentComplete);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setSuccess(true);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        onUploadSuccess();
      } else {
        try {
          const response = JSON.parse(xhr.responseText);
          setError(response.error || "Upload failed");
        } catch (e) {
          console.error(e);
          setError("An error occurred during upload");
        }
      }
      setUploading(false);
    });

    xhr.addEventListener("error", () => {
      setError("Network error occurred");
      setUploading(false);
    });

    xhr.open("POST", "/api/files/upload");
    xhr.send(formData);
    setFile(null); // Clear the selected file
  };

  const cancelSelection = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer group 
          ${file ? "border-primary bg-primary/5" : "border-primary/20 hover:border-primary/40 bg-primary/5"}`}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,application/pdf"
          disabled={uploading}
        />

        {file ? (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <p className="font-medium truncate max-w-50">{file.name}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <FileUp className="w-6 h-6 text-primary" />
            </div>
            <p className="font-medium">Click to select a file</p>
            <p className="text-xs text-muted-foreground mt-1">
              Images or PDF up to 5MB
            </p>
          </>
        )}
      </div>

      {error && (
        <Alert
          variant="destructive"
          className="bg-destructive/10 text-destructive border-none rounded-xl"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {success && !file && (
        <Alert className="bg-green-500/10 text-green-600 border-none rounded-xl">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription>File uploaded successfully!</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        {file && !uploading && (
          <>
            <Button
              className="flex-1 rounded-xl"
              onClick={(e) => {
                e.stopPropagation();
                uploadFile();
              }}
            >
              Upload File
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl"
              onClick={(e) => {
                e.stopPropagation();
                cancelSelection();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        )}

        {uploading && (
          <Button disabled className="flex-1 rounded-xl">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading
          </Button>
        )}
      </div>
    </div>
  );
}
