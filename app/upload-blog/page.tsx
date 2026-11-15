import Link from "next/link"
import type { Metadata } from "next"
import UploadBlogForm from "./UploadBlogForm"
import { getCurrentUser } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Upload",
  description: "Upload Markdown articles to the blog.",
}

export default async function UploadBlogPage() {
  const user = await getCurrentUser()

  return (
    <div className="mx-auto max-w-shell px-6 md:px-10">
      <header className="grid gap-8 border-b border-ink pb-7 pt-10 md:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] md:items-end md:pt-14">
        <div>
          <Link href="/" className="link text-meta">
            ← Index
          </Link>
          <h1 className="mt-6 font-display text-display tracking-display">
            Upload an <span className="italic text-accent">entry</span>
          </h1>
        </div>
        <p className="max-w-[34ch] text-meta text-muted md:border-l md:border-rule md:pb-2 md:pl-8">
          Upload Markdown files with title, category, and date front matter.
        </p>
      </header>

      <main className="grid gap-8 py-12 md:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] md:gap-10 md:py-16">
        <h2 className="label md:sticky md:top-10 md:self-start">
          <span className="mr-2 text-accent">01</span> Source files
        </h2>
        {user ? (
          <UploadBlogForm />
        ) : (
          <p>
            <Link href="/login" className="link">Sign in</Link> to upload an article.
          </p>
        )}
      </main>
    </div>
  )
}
