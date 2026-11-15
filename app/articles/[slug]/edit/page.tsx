import Link from "next/link"
import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import ArticleForm from "@/components/ArticleForm"
import { getCurrentUser } from "@/lib/auth"
import { getArticleData } from "@/lib/articles"

export const metadata: Metadata = {
  title: "Edit article",
}

export default async function EditArticlePage({
  params,
}: {
  params: { slug: string }
}) {
  const [user, article] = await Promise.all([
    getCurrentUser(),
    getArticleData(params.slug),
  ])
  if (!article) notFound()
  if (!user) redirect("/login")
  if (user.role !== "admin" && article.userId !== user.id) {
    redirect(`/${article.id}`)
  }

  return (
    <main className="mx-auto max-w-shell px-6 py-12 md:px-10 md:py-16">
      <Link href={`/${article.id}`} className="link text-meta">← Back to article</Link>
      <h1 className="mt-4 font-display text-display">Edit article</h1>
      <div className="mt-8">
        <ArticleForm article={article} />
      </div>
    </main>
  )
}
