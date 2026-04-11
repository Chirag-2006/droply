import { db } from "@/lib/db";
import { files, NewFile } from "@/lib/db/schema";
import { imagekit } from "@/lib/imagekit";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 📥 Parse body
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const formUserId = formData.get("userId") as string;
    const parentId = (formData.get("parentId") as string) || null;

    if (userId !== formUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // ✅ IMPROVEMENT 1: File size limit (5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size should be less than 5MB" },
        { status: 400 },
      );
    }

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

    if (
      !file.type.startsWith("image/") &&
      !file.type.startsWith("application/pdf")
    ) {
      return NextResponse.json(
        { error: "Only image and pdf files are allowed" },
        { status: 400 },
      );
    }

    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);

    const folderPath = parentId
      ? `/droply/${userId}/folder/${parentId}/`
      : `/droply/${userId}/root/`;

    //   file extenstion is match with image and pdf both case
    const originalFileName = file.name;
    const fileExtension = originalFileName.split(".").pop() || "";
    // check for empty extension

    if (!fileExtension) {
      return NextResponse.json(
        { error: "Invalid file extension" },
        { status: 400 },
      );
    }

    // ✅ IMPROVEMENT: Check for duplicate file
    const duplicateQuery = and(
      eq(files.name, originalFileName),
      parentId ? eq(files.parentId, parentId) : isNull(files.parentId),
      eq(files.userId, userId),
      eq(files.isTrash, false)
    );

    const existingFile = await db
      .select()
      .from(files)
      .where(duplicateQuery);

    if (existingFile.length > 0) {
      return NextResponse.json(
        { error: "A file with same name already exists in this folder" },
        { status: 409 }, // Conflict
      );
    }

    const uniqueFileName = `${uuid()}.${fileExtension}`;

    const imagekitUploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: uniqueFileName,
      folder: folderPath,
      useUniqueFileName: false,
    });

    const fileData: NewFile = {
      name: originalFileName,
      path: imagekitUploadResponse.filePath,
      size: file.size,
      type: file.type,
      fileUrl: imagekitUploadResponse.url,
      thumbnailUrl: imagekitUploadResponse.url || null,
      userId,
      parentId,
      isFolder: false,
      isStarred: false,
      isTrash: false,
    };

    const [newFile] = await db.insert(files).values(fileData).returning();

    return NextResponse.json(newFile, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}
