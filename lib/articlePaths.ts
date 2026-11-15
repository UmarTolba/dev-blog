import path from "node:path"
import { database } from "@/lib/database"

export type ArticlePath = {
  path: string
  userId: number | null
}

export const getArticlePaths = (): string[] =>
  database
    .prepare("SELECT path FROM articles ORDER BY path")
    .all()
    .map((row) => (row as { path: string }).path)

export const getArticlePath = (slug: string): ArticlePath | null => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null

  const articlePath = path.join("articles", `${slug}.md`)
  const row = database
    .prepare("SELECT path, user_id FROM articles WHERE path = ?")
    .get(articlePath) as { path: string; user_id: number | null } | undefined

  return row ? { path: row.path, userId: row.user_id } : null
}

export const addArticlePath = (filePath: string, userId: number | null) => {
  const relativePath = path.relative(process.cwd(), filePath)
  if (!relativePath.startsWith(`articles${path.sep}`)) {
    throw new Error("Article files must be stored in the articles directory.")
  }

  return database
    .prepare("INSERT INTO articles (path, user_id) VALUES (?, ?)")
    .run(relativePath, userId)
}

export const removeArticlePath = (filePath: string) =>
  database
    .prepare("DELETE FROM articles WHERE path = ?")
    .run(path.relative(process.cwd(), filePath))
