import { NextRequest, NextResponse } from "next/server"
import fs from "node:fs/promises"
import path from "node:path"
import matter from "gray-matter"
import { getUserFromToken, sessionCookie } from "@/lib/auth"
import { addArticlePath, removeArticlePath } from "@/lib/articlePaths"

export const runtime = "nodejs"

const articlesDirectory = path.join(process.cwd(), "articles")
const maxFileSize = 5 * 1024 * 1024

type PendingArticle = {
  filePath: string
  contents: string
}

export async function POST(request: NextRequest) {
  const user = getUserFromToken(request.cookies.get(sessionCookie)?.value)
  if (!user) {
    return NextResponse.json({ message: "Sign in to upload articles." }, { status: 401 })
  }

  const formData = await request.formData()
  const uploads = formData.getAll("files")

  if (uploads.length === 0) {
    return NextResponse.json(
      { message: "Choose at least one Markdown file to upload." },
      { status: 400 },
    )
  }

  const pendingArticles: PendingArticle[] = []
  const slugs = new Set<string>()

  for (const upload of uploads) {
    if (typeof upload === "string") {
      return NextResponse.json(
        { message: "Choose Markdown files to upload." },
        { status: 400 },
      )
    }

    if (!upload.name.toLowerCase().endsWith(".md")) {
      return NextResponse.json(
        { message: `${upload.name} is not a Markdown (.md) file.` },
        { status: 400 },
      )
    }
    if (upload.size > maxFileSize) {
      return NextResponse.json(
        { message: `${upload.name} is larger than the 5 MB limit.` },
        { status: 413 },
      )
    }

    const slug = path
      .basename(upload.name, path.extname(upload.name))
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")

    if (!slug || slugs.has(slug)) {
      return NextResponse.json(
        { message: `The filename "${upload.name}" is invalid or duplicated.` },
        { status: 400 },
      )
    }
    slugs.add(slug)

    const contents = await upload.text()
    const { data } = matter(contents)
    if (
      typeof data.title !== "string" ||
      !data.title.trim() ||
      typeof data.category !== "string" ||
      !data.category.trim() ||
      typeof data.date !== "string" ||
      !/^\d{2}-\d{2}-\d{4}$/.test(data.date)
    ) {
      return NextResponse.json(
        {
          message: `${upload.name} must include title, category, and a date in DD-MM-YYYY format in its front matter.`,
        },
        { status: 400 },
      )
    }

    pendingArticles.push({
      filePath: path.join(articlesDirectory, `${slug}.md`),
      contents,
    })
  }

  const createdPaths: string[] = []
  for (const article of pendingArticles) {
    try {
      await fs.writeFile(article.filePath, article.contents, { flag: "wx" })
      createdPaths.push(article.filePath)
      addArticlePath(article.filePath, user.id)
    } catch (error) {
      await Promise.all(
        createdPaths.map(async (filePath) => {
          await fs.unlink(filePath)
          removeArticlePath(filePath)
        }),
      )
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "EEXIST"
      ) {
        return NextResponse.json(
          { message: "An article with that filename already exists." },
          { status: 409 },
        )
      }
      throw error
    }
  }

  return NextResponse.json({
    message: `${pendingArticles.length} article${pendingArticles.length === 1 ? "" : "s"} uploaded successfully.`,
  })
}
