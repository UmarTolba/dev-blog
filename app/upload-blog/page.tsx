import type { Metadata } from "next"
import UploadBlogForm from "./UploadBlogForm"

export const metadata: Metadata = {
  title: "Upload Blog",
  description: "Upload Markdown articles to the blog.",
}

export default function UploadBlogPage() {
  return (
    <main className="mx-auto mt-12 max-w-xl p-4">
      <h1 className="text-3xl">Upload Blog</h1>
      <p>Choose one or more Markdown articles to add to your blog.</p>
      <UploadBlogForm />
    </main>
  )
}
