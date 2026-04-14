import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const interHeading = Inter({ subsets: ["latin"], variable: "--font-heading" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://droply-app.vercel.app"), // Replace with your production URL
  title: {
    default: "Droply | Secure Cloud Storage & File Management",
    template: "%s | Droply",
  },
  description:
    "Droply is a high-performance, modern cloud storage platform inspired by Dropbox. Upload, organize, and manage your digital assets securely with our intuitive interface and lightning-fast CDN.",
  keywords: [
    "Cloud Storage",
    "File Management",
    "Secure File Upload",
    "Droply",
    "Next.js File Manager",
    "Digital Asset Management",
    "Dropbox Clone",
    "Online Drive",
  ],
  authors: [{ name: "Droply Team" }],
  creator: "Droply",
  publisher: "Droply",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Droply | Secure Cloud Storage & File Management",
    description:
      "Modern file management for creators. Secure, fast, and beautifully designed.",
    siteName: "Droply",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "Droply Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Droply | Secure Cloud Storage",
    description: "Modern file management for creators. Secure and fast.",
    images: ["/logo.svg"],
  },
  icons: {
    icon: [
      {
        url: "/logo.svg",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        captcha: {
          theme: "dark",
          size: "flexible",
        },
      }}
    >
      <html
        lang="en"
        suppressHydrationWarning={true}
        className={cn(
          "h-full",
          "antialiased",
          geistSans.variable,
          geistMono.variable,
          interHeading.variable,
        )}
      >
        <body className="min-h-full flex flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
