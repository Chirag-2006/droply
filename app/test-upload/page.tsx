"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TestUploadPage = () => {
  const { userId, isLoaded } = useAuth();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>("Ready");
  const [dbResult, setDbResult] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const authenticator = async () => {
    try {
      const response = await fetch("/api/imagekit/auth");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed: ${errorText}`);
      }
      const data = await response.json();
      // Manual upload requires publicKey, token, signature, and expire
      return {
        signature: data.signature,
        expire: data.expire,
        token: data.token,
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
      };
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };

  const handleUpload = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert("Please select a file to upload");
      return;
    }

    const file = fileInput.files[0];
    setStatus("Authenticating...");
    setDbResult(null);

    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      setStatus("Auth Failed");
      return;
    }

    abortControllerRef.current = new AbortController();

    try {
      setStatus("Uploading to ImageKit...");
      const uploadResponse = await upload({
        ...authParams,
        file,
        fileName: file.name,
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        abortSignal: abortControllerRef.current.signal,
        folder: "/droply",
      });

      console.log("ImageKit Response:", uploadResponse);
      setStatus("ImageKit Success! Saving to Database...");

      // Save to Database
      const dbResponse = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imagekit: uploadResponse,
          userId: userId,
        }),
      });

      if (!dbResponse.ok) throw new Error("Failed to save to database");

      const dbData = await dbResponse.json();
      setDbResult(dbData);
      setStatus("Done! File uploaded and saved.");
    } catch (error) {
      if (error instanceof ImageKitAbortError) {
        setStatus("Upload Aborted");
      } else {
        console.error("Upload Error:", error);
        setStatus("Upload Failed");
      }
    }
  };

  const handleAbort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  if (!isLoaded) return <div className="p-10">Loading Auth...</div>;
  if (!userId) return <div className="p-10 text-destructive">Please sign in to test the upload.</div>;

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Manual ImageKit Upload Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* muje data file aur image accept karan hai */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select File</label>
            <Input type="file" ref={fileInputRef} accept=".pdf,image/*"  onChange={() => setProgress(0)} />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleUpload} disabled={status.includes("ing")}>
              Upload to ImageKit
            </Button>
            {status.includes("ing") && (
              <Button variant="outline" onClick={handleAbort}>
                Cancel
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Status: <span className="font-semibold">{status}</span></span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {dbResult && (
            <div className="p-4 bg-muted rounded-lg border">
              <p className="text-sm font-bold text-green-600 mb-2">✓ Successfully Saved to DB</p>
              <pre className="text-[10px] overflow-auto max-h-40">
                {JSON.stringify(dbResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestUploadPage;
