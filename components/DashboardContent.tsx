"use client";

import { useState, useCallback, useEffect, Fragment } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FileUp, FileText, LayoutGrid, List, Search, Home, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";

import FileUploadForm from "@/components/FileUploadForm";
import FileList from "@/components/FileList";
import NewFolderDialog from "@/components/NewFolderDialog";

interface BreadcrumbItemType {
  id: string;
  name: string;
}

interface DashboardContentProps {
  userId: string;
  userName: string;
}

export default function DashboardContent({
  userId,
  userName,
}: DashboardContentProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItemType[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [filter, setFilter] = useState<"all" | "starred">("all");

  const handleRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handleFolderChange = useCallback((folderId: string | null) => {
    setCurrentFolder(folderId);
    if (folderId !== null) {
      setFilter("all"); // Switch to all if entering a folder
    }
  }, []);

  // 🍞 Fetch folder path for breadcrumbs
  useEffect(() => {
    const fetchPath = async () => {
      if (!currentFolder) {
        setBreadcrumbs([]);
        return;
      }
      try {
        const response = await fetch(`/api/folders/path?folderId=${currentFolder}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setBreadcrumbs(data);
        }
      } catch (error) {
        console.error("Breadcrumb fetch error:", error);
      }
    };
    fetchPath();
  }, [currentFolder]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight">
            Welcome back,{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-purple-600">
              {userName?.split(" ")[0] || "there"}
            </span>
            !
          </h2>
          <p className="text-muted-foreground mt-1 text-lg">
            Manage your media and creative assets.
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <NewFolderDialog
            parentId={currentFolder}
            onSuccess={handleRefresh}
          />
        </div>
      </div>

      {/* Stats/Quick Actions (Optional Modern Touch) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Files", value: "128", color: "bg-blue-500" },
          { label: "Storage Used", value: "1.2 GB", color: "bg-purple-500" },
          { label: "Folders", value: "12", color: "bg-orange-500" },
          { label: "Shared", value: "5", color: "bg-green-500" },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border-none bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-all group overflow-hidden"
          >
            <div
              className={`absolute top-0 left-0 w-1 h-full ${stat.color} opacity-50 group-hover:opacity-100 transition-opacity`}
            />
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Section - Modern Floating Sidebar style */}
        <div className="lg:col-span-4 space-y-1">
          <Card className="border-none bg-card/40 backdrop-blur-md shadow-lg rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-3 border-b border-border/50 pb-4 ">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <FileUp className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Quick Upload</h2>
            </CardHeader>

            <CardContent className="p-6">
              <FileUploadForm
                userId={userId}
                onUploadSuccess={handleRefresh}
                currentFolder={currentFolder}
              />
            </CardContent>
          </Card>
        </div>

        {/* File Explorer Section */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center gap-4 bg-card/40 backdrop-blur-md p-2 rounded-2xl border border-border/50">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9 bg-transparent border-none focus-visible:ring-0"
                  placeholder="Search files..."
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex gap-1 p-1 bg-muted/50 rounded-xl mr-2">
                <Button
                  variant={filter === "all" ? "secondary" : "ghost"}
                  size="sm"
                  className="px-3 h-8 rounded-lg text-xs"
                  onClick={() => {
                    setFilter("all");
                    setCurrentFolder(null);
                  }}
                >
                  All
                </Button>
                <Button
                  variant={filter === "starred" ? "secondary" : "ghost"}
                  size="sm"
                  className="px-3 h-8 rounded-lg text-xs flex items-center gap-1.5"
                  onClick={() => {
                    setFilter("starred");
                    setCurrentFolder(null);
                  }}
                >
                  <Star className={`h-3 w-3 ${filter === "starred" ? "fill-yellow-400 text-yellow-400" : ""}`} />
                  Starred
                </Button>
              </div>

              <div className="flex gap-1 p-1 bg-muted/50 rounded-xl">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Card className="border-none bg-card/40 backdrop-blur-md shadow-lg rounded-3xl min-h-100 overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-3 border-b border-border/50">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                {filter === "starred" ? (
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500/20" />
                ) : (
                  <FileText className="h-5 w-5 text-purple-500" />
                )}
              </div>
              <h2 className="text-xl font-bold">
                {filter === "starred" ? "Starred Items" : "Recent Files"}
              </h2>
            </CardHeader>
            
            {/* Breadcrumbs Navigation inside the Card */}
            {filter === "all" && (
              <div className="px-6 py-3 bg-muted/20 border-b border-border/30">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink 
                        className="cursor-pointer flex items-center gap-2 hover:text-primary transition-colors text-xs"
                        onClick={() => handleFolderChange(null)}
                      >
                        <Home className="h-3.5 w-3.5" />
                        Root
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    
                    {breadcrumbs.map((crumb, index) => (
                      <Fragment key={crumb.id}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          {index === breadcrumbs.length - 1 ? (
                            <BreadcrumbPage className="font-bold text-primary max-w-[120px] truncate text-xs">
                              {crumb.name}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink 
                              className="cursor-pointer hover:text-primary transition-colors max-w-[120px] truncate text-xs"
                              onClick={() => handleFolderChange(crumb.id)}
                            >
                              {crumb.name}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      </Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            )}

            <CardContent className="px-6">
              <FileList
                userId={userId}
                parentId={currentFolder}
                refreshTrigger={refreshTrigger}
                onFolderChange={handleFolderChange}
                viewMode={viewMode}
                showOnlyStarred={filter === "starred"}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
