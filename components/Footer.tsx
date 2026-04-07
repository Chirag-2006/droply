import { CloudUpload } from "lucide-react"
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t py-6">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <CloudUpload className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold">Droply</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Droply
        </p>
      </div>
    </footer>
  );
};

export default Footer;
