import { NextRequest, NextResponse } from "next/server"
import { getUserFromToken, sessionCookie } from "@/lib/auth"
import { getArticlePath } from "@/lib/articlePaths"
import { deleteArticle, isArticleInput, updateArticle } from "@/lib/articleCrud"

export const runtime = "nodejs"

type RouteContext = { params: { slug: string } }

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const user = getUserFromToken(request.cookies.get(sessionCookie)?.value)
  if (!user) {
    return NextResponse.json({ message: "Sign in to edit articles." }, { status: 401 })
  }

  const article = getArticlePath(params.slug)
  if (!article) {
    return NextResponse.json({ message: "Article not found." }, { status: 404 })
  }
  if (user.role !== "admin" && article.userId !== user.id) {
    return NextResponse.json({ message: "You cannot edit this article." }, { status: 403 })
  }

  const input = await request.json().catch(() => null)
  if (!isArticleInput(input)) {
    return NextResponse.json(
      { message: "Enter a title, category, valid date, and article text." },
      { status: 400 },
    )
  }

  if (!(await updateArticle(params.slug, input))) {
    return NextResponse.json({ message: "Article not found." }, { status: 404 })
  }
  return NextResponse.json({ message: "Article updated." })
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const user = getUserFromToken(request.cookies.get(sessionCookie)?.value)
  if (!user) {
    return NextResponse.json({ message: "Sign in to delete articles." }, { status: 401 })
  }

  const article = getArticlePath(params.slug)
  if (!article) {
    return NextResponse.json({ message: "Article not found." }, { status: 404 })
  }
  if (user.role !== "admin" && article.userId !== user.id) {
    return NextResponse.json({ message: "You cannot delete this article." }, { status: 403 })
  }

  if (!(await deleteArticle(params.slug))) {
    return NextResponse.json({ message: "Article not found." }, { status: 404 })
  }
  return NextResponse.json({ message: "Article deleted." })
}
