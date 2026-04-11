import { CloudUpload } from "lucide-react"
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t py-6">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <CloudUpload className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold">Droply</h2>
        </div>
         <nav className="flex gap-8 text-sm font-medium text-muted-foreground">
                      <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
                      <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
                      <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
                      <Link href="#" className="hover:text-primary transition-colors">GitHub</Link>
                    </nav>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Droply
        </p>
      </div>
    </footer>
  );
};

export default Footer;
