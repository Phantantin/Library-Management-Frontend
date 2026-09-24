import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { cookieName } from "@/lib/auth";
export async function DELETE(req: NextRequest) {
  if (req.headers.get("origin") !== req.nextUrl.origin)
    return new NextResponse(null, { status: 403 });
  (await cookies()).delete(cookieName);
  return NextResponse.json({ status: true });
}
