import { DatabaseSync } from "node:sqlite"
import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const articlesDirectory = path.join(root, "articles")
const dataDirectory = path.join(root, ".data")

fs.mkdirSync(dataDirectory, { recursive: true })

const database = new DatabaseSync(path.join(dataDirectory, "articles.db"))
database.exec("PRAGMA busy_timeout = 5000")
database.exec("CREATE TABLE IF NOT EXISTS articles (path TEXT PRIMARY KEY)")

const insertPath = database.prepare("INSERT OR IGNORE INTO articles (path) VALUES (?)")
for (const filename of fs.readdirSync(articlesDirectory)) {
  if (filename.endsWith(".md")) {
    insertPath.run(path.relative(root, path.join(articlesDirectory, filename)))
  }
}

export const getArticlePaths = (): string[] =>
  database
    .prepare("SELECT path FROM articles")
    .all()
    .map((row) => row.path as string)

export const addArticlePath = (filePath: string) =>
  insertPath.run(path.relative(root, filePath))

export const removeArticlePath = (filePath: string) =>
  database
    .prepare("DELETE FROM articles WHERE path = ?")
    .run(path.relative(root, filePath))
