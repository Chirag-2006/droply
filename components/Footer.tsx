import { CloudUpload } from "lucide-react"
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
        <div className="flex items-center gap-2">
          <CloudUpload className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold">Droply</h2>
        </div>
        
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-medium text-muted-foreground">
          <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
          <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
          <Link href="#" className="hover:text-primary transition-colors">GitHub</Link>
        </nav>

        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Droply. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
