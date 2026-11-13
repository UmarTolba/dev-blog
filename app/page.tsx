import ArticleItemList from "@/components/ArticleListItem"
import { getCategorisedArticles } from "@/lib/articles"
import Link from "next/link"

export const dynamic = "force-dynamic"

const HomePage = () => {
  const articles = getCategorisedArticles()

  console.log(articles)
  return (
    <section className="mx-auto w-11/12 md:w-1/2 mt-20 flex flex-col gap-16 mb-20">
      <header className="font-cormorantGaramond font-light text-6xl text-neutral-900 text-center">
        <h1>minimal blog</h1>
        <Link
          href="/upload-blog"
          className="mt-4 inline-block font-poppins text-sm font-normal tracking-normal text-neutral-600 underline decoration-neutral-400 underline-offset-4 hover:text-neutral-950"
        >
          Upload blog
        </Link>
      </header>
      <section className="md:grid md:grid-cols-2 flex flex-col gap-10">
        {articles !== null &&
          Object.keys(articles).map((article) => (
            <ArticleItemList
              category={article}
              articles={articles[article]}
              key={article}
            />
          ))}
      </section>
    </section>
  )
}

export default HomePage
