import fs from "node:fs/promises"
import path from "node:path"
import moment from "moment"
import { addArticlePath, getArticlePath, removeArticlePath } from "@/lib/articlePaths"

export type ArticleInput = {
  title: string
  category: string
  date: string
  content: string
}

const slugify = (title: string) =>
  title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

export const isArticleInput = (value: unknown): value is ArticleInput => {
  if (!value || typeof value !== "object") return false
  const article = value as Record<string, unknown>

  return (
    typeof article.title === "string" &&
    article.title.trim().length > 0 &&
    article.title.length <= 160 &&
    slugify(article.title).length > 0 &&
    typeof article.category === "string" &&
    article.category.trim().length > 0 &&
    article.category.length <= 60 &&
    typeof article.date === "string" &&
    moment(article.date, "DD-MM-YYYY", true).isValid() &&
    typeof article.content === "string" &&
    article.content.trim().length > 0 &&
    article.content.length <= 1_000_000
  )
}

export const generateMd = ({ title, category, date, content }: ArticleInput) =>
  `---\ntitle: ${JSON.stringify(title.trim())}\ncategory: ${JSON.stringify(category.trim())}\ndate: ${JSON.stringify(date)}\n---\n\n${content.trim()}\n`

export const createArticle = async (
  article: ArticleInput,
  userId: number,
): Promise<string> => {
  const slug = slugify(article.title)
  if (!slug) throw new Error("The title must contain letters or numbers.")

  const filePath = path.join(process.cwd(), "articles", `${slug}.md`)
  await fs.writeFile(filePath, generateMd(article), { flag: "wx" })
  try {
    addArticlePath(filePath, userId)
  } catch (error) {
    await fs.unlink(filePath)
    throw error
  }
  return slug
}

export const updateArticle = async (slug: string, article: ArticleInput) => {
  const record = getArticlePath(slug)
  if (!record) return false

  const filePath = path.join(process.cwd(), record.path)
  try {
    await fs.writeFile(filePath, generateMd(article), "utf-8")
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      removeArticlePath(filePath)
      return false
    }
    throw error
  }
  return true
}

export const deleteArticle = async (slug: string) => {
  const record = getArticlePath(slug)
  if (!record) return false

  const filePath = path.join(process.cwd(), record.path)
  try {
    await fs.unlink(filePath)
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      removeArticlePath(filePath)
      return false
    }
    throw error
  }

  removeArticlePath(filePath)
  return true
}
