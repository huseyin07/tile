import { NextResponse } from "next/server";
import { createAssemblyToken } from "@/lib/assembly-token";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || body.completed !== true) {
    return NextResponse.json({ error: "Assembly is not complete." }, { status: 400 });
  }

  // This signed, short-lived token proves that the server received the completion
  // event. The assembly is an engagement mechanism, not an anti-bot challenge.
  return NextResponse.json({ token: createAssemblyToken() });
}
