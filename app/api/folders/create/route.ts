import { db } from "@/lib/db";
import { files, NewFile } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    // 🔐 Auth check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 📥 Parse body
    const body = await request.json();
    const { name, parentId = null } = body;

    // 🧪 Validate name
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid folder name" },
        { status: 400 },
      );
    }

    const trimmedName = name.trim();

    // 📁 Validate parent folder (if exists)
    if (parentId) {
      const [parentFolder] = await db
        .select()
        .from(files)
        .where(
          and(
            eq(files.id, parentId),
            eq(files.userId, userId),
            eq(files.isFolder, true),
          ),
        );

      if (!parentFolder) {
        return NextResponse.json(
          { error: "Parent folder not found" },
          { status: 404 },
        );
      }
    }

    // 🆔 Generate folder ID
    const folderId = uuidv4();

    // 📦 Create folder data
    const folderData: NewFile = {
      id: folderId,
      name: trimmedName,
      path: `/droply/${userId}/folders/${folderId}`, // ✅ improved path
      size: 0,
      type: "folder",
      fileUrl: "",
      thumbnailUrl: null,
      userId,
      parentId,
      isFolder: true,
      isStarred: false,
      isTrash: false,
    };

    // 💾 Insert into DB
    const [newFolder] = await db.insert(files).values(folderData).returning();

    return NextResponse.json({
      success: true,
      folder: newFolder,
      message: "Folder created successfully",
    });
  } catch (error) {
    console.error("Create folder error:", error);

    return NextResponse.json(
      { error: "Failed to create folder" },
      { status: 500 },
    );
  }
}
