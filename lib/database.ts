import "server-only"

import fs from "node:fs"
import path from "node:path"
import { DatabaseSync } from "node:sqlite"

const root = process.cwd()
const articlesDirectory = path.join(root, "articles")
const dataDirectory = path.join(root, ".data")

fs.mkdirSync(articlesDirectory, { recursive: true })
fs.mkdirSync(dataDirectory, { recursive: true })

export const database = new DatabaseSync(path.join(dataDirectory, "articles.db"))
database.exec(`
  PRAGMA busy_timeout = 5000;
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS articles (
    path TEXT PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
  );
`)

const articleColumns = database
  .prepare("PRAGMA table_info(articles)")
  .all() as { name: string }[]

if (!articleColumns.some(({ name }) => name === "user_id")) {
  try {
    database.exec(
      "ALTER TABLE articles ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE SET NULL",
    )
  } catch (error) {
    if (
      !(error instanceof Error) ||
      !error.message.includes("duplicate column name")
    ) {
      throw error
    }
  }
}

const existingPaths = fs
  .readdirSync(articlesDirectory)
  .filter((filename) => filename.endsWith(".md"))
  .map((filename) => path.relative(root, path.join(articlesDirectory, filename)))
const existingPathSet = new Set(existingPaths)
const deleteArticle = database.prepare("DELETE FROM articles WHERE path = ?")

for (const { path: articlePath } of database
  .prepare("SELECT path FROM articles")
  .all() as { path: string }[]) {
  if (!existingPathSet.has(articlePath)) {
    deleteArticle.run(articlePath)
  }
}

const insertArticle = database.prepare(
  "INSERT OR IGNORE INTO articles (path) VALUES (?)",
)
for (const articlePath of existingPaths) {
  insertArticle.run(articlePath)
}
