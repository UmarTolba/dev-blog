"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import type { ArticleData } from "@/types"

type Props = {
  article?: ArticleData
}

export default function ArticleForm({ article }: Props) {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setMessage("")

    const formData = new FormData(event.currentTarget)
    const endpoint = article
      ? `/api/articles/${encodeURIComponent(article.id)}`
      : "/api/articles/create"
    try {
      const response = await fetch(endpoint, {
        method: article ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      })
      const result = (await response.json()) as { message?: string; slug?: string }
      if (!response.ok) {
        setMessage(result.message ?? "The article could not be saved.")
        return
      }

      router.push(article ? `/${article.id}` : `/${result.slug}`)
      router.refresh()
    } catch {
      setMessage("Could not connect. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const field =
    "mt-2 w-full border border-rule bg-surface px-4 py-3 text-body focus:border-accent"

  return (
    <form onSubmit={submit} className="flex max-w-measure flex-col gap-6">
      <label className="label">
        Title
        <input
          name="title"
          defaultValue={article?.title}
          maxLength={160}
          required
          className={field}
        />
      </label>
      <label className="label">
        Category
        <input
          name="category"
          defaultValue={article?.category}
          maxLength={60}
          required
          className={field}
        />
      </label>
      <label className="label">
        Date <span className="normal-case tracking-normal">(DD-MM-YYYY)</span>
        <input
          name="date"
          defaultValue={article?.date}
          placeholder="15-11-2026"
          pattern="[0-9]{2}-[0-9]{2}-[0-9]{4}"
          required
          className={field}
        />
      </label>
      <label className="label">
        Article in Markdown
        <textarea
          name="content"
          defaultValue={article?.contentMarkdown}
          rows={18}
          maxLength={1_000_000}
          required
          className={`${field} font-mono`}
        />
      </label>
      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={submitting}
          className="label border border-ink bg-ink px-6 py-3 text-surface transition-colors hover:border-accent hover:bg-accent disabled:opacity-50"
        >
          {submitting ? "Saving…" : article ? "Save changes" : "Create article"}
        </button>
        <p role="status" className="text-meta text-accent">{message}</p>
      </div>
    </form>
  )
}
