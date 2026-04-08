import { imagekit } from "@/lib/imagekit";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authResponse = imagekit.getAuthenticationParameters();
    return NextResponse.json(authResponse);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to generate auth parameters for ImageKit" }, { status: 500 });
  }
}
