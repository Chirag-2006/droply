import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

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

    // Fetch the file to check ownership and current status
    const [file] = await db
      .select()
      .from(files)
      .where(and(eq(files.id, id), eq(files.userId, userId)));

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Toggle the isStarred field
    const [updatedFile] = await db
      .update(files)
      .set({
        isStarred: !file.isStarred,
        updatedAt: new Date(),
      })
      .where(and(eq(files.id, id), eq(files.userId, userId)))
      .returning();

    return NextResponse.json(updatedFile);
  } catch (error) {
    console.error("[STAR_FILE]", error);
    return NextResponse.json(
      { error: "Failed to update star status" },
      { status: 500 }
    );
  }
}
