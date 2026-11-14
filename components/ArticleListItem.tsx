import Link from "next/link"
import { formatArticleDate } from "@/lib/formatDate"
import type { ArticleItem } from "@/types"

interface Props {
  category: string
  articles: ArticleItem[]
  index: number
}

const ArticleItemList = ({ category, articles, index }: Props) => {
  return (
    <section className="grid gap-5 border-b border-rule py-10 last:border-b-0 md:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] md:gap-10 md:py-14">
      <h2 className="label md:sticky md:top-10 md:self-start">
        <span className="mr-2 text-accent">
          {String(index + 1).padStart(2, "0")}
        </span>
        {category}
      </h2>

      <ul className="flex flex-col">
        {articles.map((article) => (
          <li key={article.id} className="border-t border-rule first:border-t-0">
            <Link
              href={`/${article.id}`}
              className="group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 py-3.5"
            >
              <span className="font-display text-display-sm tracking-display transition-colors duration-150 group-hover:text-accent">
                {article.title}
              </span>
              <span className="text-meta tabular-nums text-muted transition-colors duration-150 group-hover:text-ink">
                {formatArticleDate(article.date)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ArticleItemList
