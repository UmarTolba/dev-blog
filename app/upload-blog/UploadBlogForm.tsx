"use client"

import { FormEvent, useState } from "react"

export default function UploadBlogForm() {
  const [message, setMessage] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget

    setIsUploading(true)
    setMessage("")
    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        body: new FormData(form),
      })
      const result = (await response.json()) as { message: string }
      if (!response.ok) {
        setMessage(result.message || "The files could not be uploaded.")
        return
      }

      setMessage(result.message)
      form.reset()
    } catch {
      setMessage("The upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <label>
        <span>Select Markdown files</span>
        <br />
        <span>.md files with title, category, and date front matter</span>
        <input
          type="file"
          accept=".md,text/markdown"
          name="files"
          multiple
          required
        />
      </label>

      <button
        type="submit"
        disabled={isUploading}
        className="w-fit border px-3 py-1 disabled:opacity-50"
      >
        {isUploading ? "Uploading..." : "Upload blog"}
      </button>

      <p role="status" aria-live="polite">
        {message}
      </p>
    </form>
  )
}
