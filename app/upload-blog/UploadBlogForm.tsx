"use client"

import { FormEvent, useState } from "react"

type Status = "idle" | "ok" | "error"

export default function UploadBlogForm() {
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [isUploading, setIsUploading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget

    setIsUploading(true)
    setMessage("")
    setStatus("idle")
    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        body: new FormData(form),
      })
      const result = (await response.json()) as { message: string }
      if (!response.ok) {
        setMessage(result.message || "The files could not be uploaded.")
        setStatus("error")
        return
      }

      setMessage(result.message)
      setStatus("ok")
      form.reset()
    } catch {
      setMessage("The upload failed. Please try again.")
      setStatus("error")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-measure">
      <label className="block border-y border-rule py-6">
        <span className="font-display text-display-sm tracking-display">
          Select Markdown files
        </span>
        <span className="mt-1 block text-meta text-muted">
          .md files carrying <code className="text-ink">title</code>,{" "}
          <code className="text-ink">category</code> and{" "}
          <code className="text-ink">date</code> front matter.
        </span>
        <input
          type="file"
          accept=".md,text/markdown"
          name="files"
          multiple
          required
          className="mt-5 block w-full cursor-pointer text-meta text-muted file:mr-4 file:cursor-pointer file:border file:border-ink file:bg-surface file:px-3 file:py-1.5 file:font-mono file:text-meta file:text-ink file:transition-colors hover:file:bg-ink hover:file:text-surface"
        />
      </label>

      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="submit"
          disabled={isUploading}
          className="border border-ink bg-surface px-5 py-2 text-meta tracking-label uppercase transition-[box-shadow,transform,background-color,color] duration-100 hover:-translate-x-px hover:-translate-y-px hover:shadow-offset disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {isUploading ? "Uploading…" : "Upload"}
        </button>

        <p
          role="status"
          aria-live="polite"
          className={`text-meta ${
            status === "error"
              ? "text-accent"
              : status === "ok"
                ? "text-ink"
                : "text-muted"
          }`}
        >
          {status === "ok" && message ? "✓ " : null}
          {message}
        </p>
      </div>
    </form>
  )
}
