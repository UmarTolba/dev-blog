import { NextRequest, NextResponse } from "next/server"
import { revokeSession, sessionCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  revokeSession(request.cookies.get(sessionCookie)?.value)
  const response = NextResponse.json({ message: "Signed out." })
  response.cookies.set(sessionCookie, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  })
  return response
}
