import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import DeleteArticleButton from "@/components/DeleteArticleButton"
import { getArticleData } from "@/lib/articles"
import { formatArticleDate } from "@/lib/formatDate"
import { getCurrentUser } from "@/lib/auth"

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> => {
  const article = await getArticleData(params.slug)
  return { title: article?.title ?? "Article not found" }
}

const Article = async ({ params }: { params: { slug: string } }) => {
  const [articleData, user] = await Promise.all([
    getArticleData(params.slug),
    getCurrentUser(),
  ])
  if (!articleData) notFound()
  const canManage =
    user?.role === "admin" || user?.id === articleData.userId

  return (
    <div className="mx-auto max-w-shell px-6 md:px-10">
      <div className="grid gap-8 border-b border-ink pb-7 pt-10 md:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] md:gap-10 md:pt-14">
        <Link href="/" className="link w-fit text-meta">
          ← Index
        </Link>
        <dl className="flex flex-wrap items-baseline gap-x-10 gap-y-2">
          <div>
            <dt className="label">Filed under</dt>
            <dd className="mt-1 text-meta">{articleData.category}</dd>
          </div>
          <div>
            <dt className="label">Published</dt>
            <dd className="mt-1 text-meta tabular-nums">
              {formatArticleDate(articleData.date)}
            </dd>
          </div>
          {articleData.authorName && (
            <div>
              <dt className="label">Written by</dt>
              <dd className="mt-1 text-meta">{articleData.authorName}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="grid gap-8 md:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] md:gap-10">
        <aside className="flex gap-5 pt-8 md:flex-col">
          {canManage && (
            <>
              <Link href={`/articles/${articleData.id}/edit`} className="link text-meta">
                Edit
              </Link>
              <DeleteArticleButton slug={articleData.id} />
            </>
          )}
        </aside>
        <article
          className="article max-w-measure py-12 md:py-16"
          dangerouslySetInnerHTML={{ __html: articleData.contentHtml }}
        />
      </div>

      <footer className="border-t border-ink py-8">
        <Link href="/" className="link text-meta">
          ← Back to the index
        </Link>
      </footer>
    </div>
  )
}

export default Article
