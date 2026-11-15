import { NextRequest, NextResponse } from "next/server"
import { getUserFromToken, sessionCookie } from "@/lib/auth"
import { createArticle, isArticleInput } from "@/lib/articleCrud"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  const user = getUserFromToken(request.cookies.get(sessionCookie)?.value)
  if (!user) {
    return NextResponse.json({ message: "Sign in to create articles." }, { status: 401 })
  }

  const article = await request.json().catch(() => null)
  if (!isArticleInput(article)) {
    return NextResponse.json(
      { message: "Enter a title, category, valid date, and article text." },
      { status: 400 },
    )
  }

  try {
    const slug = await createArticle(article, user.id)
    return NextResponse.json({ slug, message: "Article created." }, { status: 201 })
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "EEXIST"
    ) {
      return NextResponse.json(
        { message: "An article with that title already exists." },
        { status: 409 },
      )
    }
    throw error
  }
}
