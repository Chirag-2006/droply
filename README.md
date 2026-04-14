# 📁 Droply – File Storage & Management System

### **A Scalable, Enterprise-Grade Cloud Asset Management Platform**

**Droply** is a high-performance file management system engineered for modern workflows. Inspired by Dropbox, it empowers users to securely upload, organize, and manage digital assets within a sophisticated, recursive folder architecture. Built with **Next.js 15**, **Drizzle ORM**, and **ImageKit**, Droply focuses on providing a "zero-latency" feel through advanced loading states and optimized database queries.

---

## 📌 Features

* 📂 Create folders and subfolders
* 📤 Upload files (Images, PDFs, Documents, etc.)
* ⭐ Mark files as starred (favorites)
* 🗑️ Soft delete (move to trash)
* 🔄 Restore deleted files
* 🔍 View files inside nested folders
* 🔐 Secure authentication with Clerk (OTP-based login)
* 📊 Organized database structure using Drizzle ORM
* ⚡ Fast file uploads using ImageKit CDN


## ✨ Why Droply?

Most file management clones stop at basic uploads. **Droply** goes further by implementing:
*   **True Recursive Folders:** Infinite nesting depth with a self-referential DB model.
*   **Zero-CLS UX:** Custom-built skeleton loaders for every view to prevent layout shifts.
*   **Data Safety:** A robust soft-delete system that treats your files with the care they deserve.
*   **CDN-First Architecture:** Every asset is optimized and served via a global CDN.

---

## 💎 Features (Implemented)

### **📂 Advanced Management**
- **Infinite Hierarchy:** Create folders and subfolders with unlimited nesting depth.
- **Recursive Navigation:** Seamlessly move through deep folder structures with dynamic breadcrumbs.
- **Smart Trash Bin:** Soft-delete system allows you to recover files or purge them permanently.
- **Favorites (Starting):** Bookmark your most important assets for instant access.

### **📤 Optimized Asset Pipeline**
- **Multi-Format Support:** High-speed uploads for Images, PDFs, and Documents.
- **CDN-Backed Delivery:** Integrated with **ImageKit.io** for optimized delivery and real-time transformations.
- **Real-Time Stats:** Live tracking of storage usage, file counts, and folder distributions.

### **🔐 Security & UX**
- **Enterprise Auth:** Secure, OTP-based authentication powered by **Clerk**.
- **Modern Skeletons:** Polished loading states for the Dashboard, File Lists, and Navbar.
- **Responsive & Glassmorphic:** A stunning, modern UI that works perfectly on mobile, tablet, and desktop.

---

## 🗺️ Roadmap (Upcoming Features)

- [ ] **Global Search:** Full-text search across all nested folders using database indexing.
- [ ] **Collaborative Sharing:** Generate public/private sharing links with expiration and passwords.
- [ ] **Drag & Drop:** Intuitively move files between folders and upload by dropping anywhere.
- [ ] **Advanced Analytics:** Visual breakdowns of storage usage by file type and date.
- [ ] **File Versioning:** Keep track of changes and restore previous versions of documents.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strictly Typed) |
| **Database** | [PostgreSQL (Neon Serverless)](https://neon.tech/) |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) |
| **Authentication** | [Clerk](https://clerk.com/) |
| **Storage/CDN** | [ImageKit.io](https://imagekit.io/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/) |
| **Validation** | [Zod](https://zod.dev/) |

---

## 🏗️ Technical Architecture

### **1. Recursive Data Modeling**
Droply solves the hierarchical file-system problem by using a `parentId` field on the `files` table. This allows the system to represent complex trees with a single table, enabling efficient recursive traversals and lightning-fast breadcrumb generation.

### **2. Soft-Delete Lifecycle**
The "Trash" system is implemented as a state machine. Files are never immediately deleted from disk; instead, their `isTrash` state is toggled. This enables a two-stage deletion process (Trash -> Permanent Delete) identical to macOS or Windows.

### **3. Optimistic UI & Skeletons**
To make the app feel "instant," Droply uses a combination of optimistic state updates for actions (like starring) and custom-designed skeleton loaders that match the final UI perfectly, eliminating jarring layout jumps.

---

## ⚙️ Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/droply.git
    cd droply
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Create a `.env.local` file in the root directory:
    ```env
    DATABASE_URL=your_neon_db_url
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
    CLERK_SECRET_KEY=your_secret_key
    NEXT_PUBLIC_PUBLIC_KEY=your_imagekit_public_key
    PRIVATE_KEY=your_imagekit_private_key
    NEXT_PUBLIC_URL_ENDPOINT=your_imagekit_url_endpoint
    ```

4.  **Sync Database Schema**
    ```bash
    npx drizzle-kit push
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```

---

## 📂 Folder Structure

```text
├── app/                # Server components, layouts, and API routes
├── components/         # React components
│   ├── ui/             # Radix-based atomic components (shadcn)
│   ├── skeletons/      # Polished loading states for every view
│   └── ...             # Feature-specific logic (FileList, Dashboard)
├── lib/
│   ├── db/             # Drizzle schema, relations, and Neon client
│   ├── imagekit.ts     # CDN/Upload configuration
│   └── utils.ts        # Type-safe utility functions
└── zod/                # Runtime schema validation and TypeScript types
```

---

## 📸 Screenshots
![Dashboard](https://via.placeholder.com/800x450?text=Modern+Dashboard+UI)
*Add your project screenshots here to showcase the beautiful UI!*

---

## 📬 Contact & Support

If you liked this project or want to collaborate:

*   **GitHub:** [https://github.com/Chirag-2006](https://github.com/Chirag-2006)
*   **LinkedIn:** [https://www.linkedin.com/in/chirag-arya-53350b23b/](https://www.linkedin.com/in/chirag-arya-53350b23b/)
*   **Email:** [aryachirag@gmail.com](mailto:aryachirag@gmail.com)

---

⭐ **Star this repository if you found it useful!**
