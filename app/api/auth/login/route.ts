import { NextRequest, NextResponse } from "next/server"
import {
  createSession,
  ensureInitialAdmin,
  getUserByEmail,
  normalizeEmail,
  sessionCookie,
  sessionMaxAge,
  verifyPassword,
} from "@/lib/auth"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  ensureInitialAdmin()
  const body = await request.json().catch(() => null)

  if (
    !body ||
    typeof body.email !== "string" ||
    typeof body.password !== "string"
  ) {
    return NextResponse.json({ message: "Enter your email and password." }, { status: 400 })
  }

  const user = getUserByEmail(normalizeEmail(body.email))
  if (!user || !verifyPassword(body.password, user.password_hash)) {
    return NextResponse.json({ message: "Email or password is incorrect." }, { status: 401 })
  }

  const token = createSession(user.id)
  const response = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  })
  response.cookies.set(sessionCookie, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: sessionMaxAge,
    path: "/",
  })
  return response
}
