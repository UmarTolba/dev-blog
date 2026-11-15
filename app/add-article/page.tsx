import Link from "next/link"
import type { Metadata } from "next"
import ArticleForm from "@/components/ArticleForm"
import { getCurrentUser } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Add an article",
}

export default async function AddArticlePage() {
  const user = await getCurrentUser()

  return (
    <main className="mx-auto max-w-shell px-6 py-12 md:px-10 md:py-16">
      <p className="label">Write</p>
      <h1 className="mt-4 font-display text-display">Add an article</h1>
      <p className="mt-4 max-w-measure text-muted">
        Write in Markdown. Your article will be saved as an .md file and linked to
        your account.
      </p>
      {user ? (
        <div className="mt-8">
          <ArticleForm />
        </div>
      ) : (
        <p className="mt-8">
          <Link href="/login" className="link">Sign in</Link> to create an article.
        </p>
      )}
    </main>
  )
}
