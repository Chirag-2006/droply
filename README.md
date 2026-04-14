# 🚀 Droply – File Storage & Management System

Droply is a modern file storage and management web application inspired by Dropbox.
It allows users to upload, organize, and manage files efficiently with a clean UI and secure authentication.

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

---

## 🛠️ Tech Stack

* **Frontend:** Next.js (App Router), React, Tailwind CSS, shadcn/ui
* **Backend:** Next.js API Routes
* **Authentication:** Clerk (OTP + session handling)
* **Database:** PostgreSQL (NeonDB)
* **ORM:** Drizzle ORM
* **Validation:** Zod
* **File Storage:** ImageKit

---

## 📚 What I Learned

This project helped me deeply understand:

* Database design for file/folder hierarchy (like Dropbox)
* Drizzle ORM with PostgreSQL (Neon)
* Form validation using Zod
* Authentication flow using Clerk (Signup, Signin, Middleware)
* File upload handling with ImageKit
* Building custom API endpoints in Next.js
* Managing nested folders and file structures
* Implementing features like:

  * Star / Unstar
  * Delete / Restore (Trash system)

---

## 📂 Project Structure

```
/app
  /api
    /files
    /upload
    /star
  /dashboard

/components
/lib
  /db
  /imagekit
  /utils
```

---

## ⚙️ Installation & Setup

1. Clone the repository

```bash
git clone https://github.com/your-username/droply.git
cd droply
```

2. Install dependencies

```bash
npm install
```

3. Setup environment variables

Create a `.env.local` file:

```env
DATABASE_URL=your_neon_db_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_secret_key

IMAGEKIT_PUBLIC_KEY=your_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=your_url
```

4. Run the development server

```bash
npm run dev
```

---

## 🧠 Core Concepts Implemented

* Folder hierarchy using parent-child relationship
* Soft delete system (trash instead of permanent delete)
* Optimized queries using Drizzle ORM
* API-based file upload system
* Authentication middleware protection

---

## 📸 Screenshots (Optional)

*Add screenshots of your UI here*

---

## 🚧 Future Improvements

* 🔎 Search functionality
* 📥 File download support
* 👥 File sharing system
* 📊 Storage usage analytics
* 🌙 Dark mode

---

## 🙌 Acknowledgements

* Clerk for authentication
* ImageKit for file storage
* Drizzle ORM for database handling

---

## 📬 Contact

If you liked this project or want to collaborate:

* GitHub: https://github.com/your-username
* LinkedIn: Your Profile Link

---

⭐ Don’t forget to star this repo if you found it helpful!
