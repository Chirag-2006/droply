"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, FolderPlus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface NewFolderDialogProps {
  parentId: string | null;
  onSuccess: () => void;
}

export default function NewFolderDialog({
  parentId,
  onSuccess,
}: NewFolderDialogProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/folders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          parentId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create folder");
      }

      console.log('response', response);

      setName("");
      setOpen(false);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full shadow-lg shadow-primary/20 gap-2 px-6 py-6">
          <Plus className="w-4 h-4" />
          New Folder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <FolderPlus className="w-4 h-4 text-primary" />
            </div>
            Create New Folder
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="px-1 text-xs font-semibold uppercase text-muted-foreground tracking-wider">Folder Name</Label>
            <Input
              id="name"
              placeholder="e.g. Vacation Photos"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border-muted focus-visible:ring-primary"
              disabled={loading}
              autoFocus
            />
          </div>
          {error && (
            <Alert variant="destructive" className="bg-destructive/10 text-destructive border-none rounded-xl">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button 
            variant="ghost" 
            onClick={() => setOpen(false)} 
            className="rounded-xl"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreate} 
            className="rounded-xl min-w-25"
            disabled={loading || !name.trim()}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
