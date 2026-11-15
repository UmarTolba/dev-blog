import "server-only"

import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"
import { database } from "@/lib/database"

export const sessionCookie = "minimal_blog_session"
export const sessionMaxAge = 60 * 60 * 24 * 7

export type UserRole = "admin" | "user"

export type User = {
  id: number
  name: string
  email: string
  role: UserRole
}

const hashPassword = (password: string): string => {
  const salt = randomBytes(16).toString("hex")
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`
}

export const verifyPassword = (password: string, storedHash: string): boolean => {
  const [salt, hash] = storedHash.split(":")
  if (!salt || !hash || !/^[a-f0-9]{128}$/.test(hash)) return false

  const stored = Buffer.from(hash, "hex")
  const supplied = scryptSync(password, salt, 64)
  return timingSafeEqual(stored, supplied)
}

export const normalizeEmail = (email: string): string => email.trim().toLowerCase()

export const ensureInitialAdmin = () => {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (!email && !password) return
  if (!email || !password || password.length < 12) {
    throw new Error("Set both ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters.")
  }

  const normalizedEmail = normalizeEmail(email)
  const existing = database
    .prepare("SELECT id, role, password_hash FROM users WHERE email = ?")
    .get(normalizedEmail) as
    | { id: number; role: UserRole; password_hash: string }
    | undefined

  if (!existing) {
    database
      .prepare(
        "INSERT OR IGNORE INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')",
      )
      .run("Administrator", normalizedEmail, hashPassword(password))

    const created = database
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(normalizedEmail)
    if (created) return
  }

  if (
    existing &&
    (existing.role !== "admin" || !verifyPassword(password, existing.password_hash))
  ) {
    database
      .prepare("UPDATE users SET role = 'admin', password_hash = ? WHERE id = ?")
      .run(hashPassword(password), existing.id)
  }
}

export const registerUser = (name: string, email: string, password: string): User => {
  const result = database
    .prepare(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
    )
    .run(name.trim(), normalizeEmail(email), hashPassword(password))

  return {
    id: Number(result.lastInsertRowid),
    name: name.trim(),
    email: normalizeEmail(email),
    role: "user",
  }
}

export const getUserByEmail = (email: string) =>
  database
    .prepare("SELECT id, name, email, role, password_hash FROM users WHERE email = ?")
    .get(normalizeEmail(email)) as
    | (User & { password_hash: string })
    | undefined

const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex")

export const createSession = (userId: number): string => {
  const token = randomBytes(32).toString("base64url")
  const expiresAt = Date.now() + sessionMaxAge * 1000

  database.prepare("DELETE FROM sessions WHERE expires_at <= ?").run(Date.now())
  database
    .prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)")
    .run(hashToken(token), userId, expiresAt)

  return token
}

export const revokeSession = (token?: string) => {
  if (token) {
    database.prepare("DELETE FROM sessions WHERE token_hash = ?").run(hashToken(token))
  }
}

export const getUserFromToken = (token?: string): User | null => {
  if (!token) return null

  const row = database
    .prepare(
      `SELECT users.id, users.name, users.email, users.role, sessions.expires_at
       FROM sessions JOIN users ON users.id = sessions.user_id
       WHERE sessions.token_hash = ?`,
    )
    .get(hashToken(token)) as
    | (User & { expires_at: number })
    | undefined

  if (!row) return null
  if (row.expires_at <= Date.now()) {
    revokeSession(token)
    return null
  }
  if (row.role !== "admin" && row.role !== "user") return null

  return { id: row.id, name: row.name, email: row.email, role: row.role }
}

export const getCurrentUser = async (): Promise<User | null> => {
  const cookieStore = await cookies()
  return getUserFromToken(cookieStore.get(sessionCookie)?.value)
}
