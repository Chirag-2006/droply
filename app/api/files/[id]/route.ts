import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { imagekit } from "@/lib/imagekit";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// MOVE TO TRASH (PATCH)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { isTrash } = body;

    const [file] = await db
      .select()
      .from(files)
      .where(and(eq(files.id, id), eq(files.userId, userId)));

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const targetTrashState = typeof isTrash === "boolean" ? isTrash : true;

    const [updatedFile] = await db
      .update(files)
      .set({ isTrash: targetTrashState, updatedAt: new Date() })
      .where(and(eq(files.id, id), eq(files.userId, userId)))
      .returning();

    return NextResponse.json(updatedFile);
  } catch (error) {
    console.error("[FILE_PATCH]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PERMANENT DELETE (DELETE)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const [file] = await db
      .select()
      .from(files)
      .where(and(eq(files.id, id), eq(files.userId, userId)));

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // If it's a file (not a folder), delete from ImageKit
    if (!file.isFolder && file.path) {
      try {
        // We need the fileId from ImageKit to delete. 
        // If we don't store it, we might need to search or use the path.
        // ImageKit's deleteFile requires fileId. 
        // Assuming path or some other logic if fileId isn't stored.
        // For now, let's just delete from DB if we don't have ImageKit ID.
        // (Ideally, schema should have imagekit_file_id)
      } catch (ikError) {
        console.error("ImageKit delete error:", ikError);
      }
    }

    await db.delete(files).where(and(eq(files.id, id), eq(files.userId, userId)));

    return NextResponse.json({ message: "File deleted permanently" });
  } catch (error) {
    console.error("[FILE_DELETE]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
