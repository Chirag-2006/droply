<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


You are a senior full-stack engineer. Refactor an existing Next.js (App Router) project using Clerk, Drizzle ORM, NeonDB, ImageKit, Tailwind, and shadcn/ui.

## 🎯 Goal

Refactor the file upload system to be modular, reusable, type-safe, and production-ready.

---

## 🧱 Tech Stack

* Next.js (App Router)
* TypeScript (strict mode, no `any`)
* Clerk (authentication)
* Drizzle ORM (PostgreSQL - Neon)
* ImageKit (file storage)
* Tailwind + shadcn/ui (UI)

---

## 📂 Required Folder Structure

lib/
imagekit.ts

services/
imagekit-auth.ts
upload-service.ts
file-service.ts

utils/
file-validation.ts
file-path.ts
file-name.ts

components/
file-upload.tsx

app/api/
imagekit/auth/route.ts
upload/route.ts

---

## ⚙️ Requirements

### 1. Separation of Concerns

* UI logic must stay in components
* Upload logic must be in services
* Database logic must stay in API routes or service layer
* No business logic inside components

---

### 2. Image Upload Flow

Implement this flow:

1. Client requests auth params from `/api/imagekit/auth`
2. Server generates signature using ImageKit private key
3. Client uploads file directly to ImageKit using `@imagekit/next`
4. Client sends upload response to `/api/upload`
5. Server saves file metadata in database

---

### 3. File Validation (STRICT)

* Allow only:

  * application/pdf
  * image/png
  * image/jpeg
  * image/webp
* Max size: 5MB
* Validate on BOTH client and server

---

### 4. Folder Structure (ImageKit)

Use dynamic folder structure:

/droply/{userId}/images
/droply/{userId}/docs

* Images → images folder
* PDFs → docs folder

---

### 5. File Naming

* Use unique naming:
  timestamp + original filename
* Prevent duplicates

---

### 6. Security Rules

* Never trust client `userId`
* Always get userId from Clerk `auth()` on server
* Protect all API routes
* Do not expose private keys

---

### 7. Type Safety

* No `any`
* Define interfaces for:

  * upload response
  * DB schema input/output
  * API responses

---

### 8. Error Handling

* Use try-catch in all async functions
* Return meaningful error messages
* Handle:

  * auth failure
  * upload failure
  * DB failure

---

### 9. Reusability

* Create reusable services:

  * getImageKitAuth()
  * uploadToImageKit()
  * saveFileToDB()
* Avoid duplicate logic

---

### 10. UI Component

Create a reusable `FileUpload` component:

* File input (accept .pdf, image/*)
* Upload button
* Progress indicator
* Status display (idle, uploading, saving, success, error)

---

### 11. Optimization

* Keep API routes thin
* Move logic to services
* Avoid unnecessary state updates
* Use clean naming conventions

---

## 🚫 Restrictions

* Do NOT use `any`
* Do NOT mix UI and business logic
* Do NOT duplicate code
* Do NOT hardcode userId

---

## ✅ Expected Output

* Fully working upload system
* Clean modular code
* Proper TypeScript types
* Production-ready architecture
* Easy to extend (future features like delete, folders, sharing)

---

## 🧠 Bonus (if possible)

* Add file size + type validation utility
* Add folder path generator utility
* Add reusable upload service

---

Follow best practices strictly. Code should be clean, modular, and scalable.
