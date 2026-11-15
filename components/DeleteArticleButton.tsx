"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function DeleteArticleButton({
  slug,
  returnTo = "/articles",
}: {
  slug: string
  returnTo?: string
}) {
  const router = useRouter()
  const [message, setMessage] = useState("")

  const remove = async () => {
    if (!window.confirm("Delete this article?")) return

    try {
      const response = await fetch(`/api/articles/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const result = (await response.json()) as { message?: string }
        setMessage(result.message ?? "The article could not be deleted.")
        return
      }

      router.push(returnTo)
      router.refresh()
    } catch {
      setMessage("Could not connect. Please try again.")
    }
  }

  return (
    <div>
      <button type="button" className="link text-meta" onClick={remove}>
        Delete
      </button>
      {message && <p role="status" className="text-meta text-accent">{message}</p>}
    </div>
  )
}
