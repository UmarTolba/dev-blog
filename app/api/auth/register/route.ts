import { NextRequest, NextResponse } from "next/server"
import {
  createSession,
  ensureInitialAdmin,
  normalizeEmail,
  registerUser,
  sessionCookie,
  sessionMaxAge,
} from "@/lib/auth"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  ensureInitialAdmin()
  const body = await request.json().catch(() => null)

  if (
    !body ||
    typeof body.name !== "string" ||
    typeof body.email !== "string" ||
    typeof body.password !== "string"
  ) {
    return NextResponse.json({ message: "Enter your name, email, and password." }, { status: 400 })
  }

  const name = body.name.trim()
  const email = normalizeEmail(body.email)
  const password = body.password
  if (
    !name ||
    name.length > 80 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    password.length < 8 ||
    password.length > 128
  ) {
    return NextResponse.json(
      { message: "Use a name, valid email, and password of 8 to 128 characters." },
      { status: 400 },
    )
  }

  try {
    const user = registerUser(name, email, password)
    const token = createSession(user.id)
    const response = NextResponse.json({ user }, { status: 201 })
    response.cookies.set(sessionCookie, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionMaxAge,
      path: "/",
    })
    return response
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("UNIQUE constraint failed: users.email")
    ) {
      return NextResponse.json(
        { message: "An account with that email already exists." },
        { status: 409 },
      )
    }
    throw error
  }
}
