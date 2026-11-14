import fs from "fs"
import matter from "gray-matter"
import path from "path"
import moment from "moment"
import { getArticlePaths } from "@/lib/articlePaths"
import { remark } from "remark"
import html from "remark-html"

import type { ArticleData, ArticleItem } from "@/types"

export const getSortedArticles = (): ArticleItem[] => {
  const allArticlesData = getArticlePaths().map((articlePath) => {
    const id = path.basename(articlePath, ".md")
    const fullPath = path.join(process.cwd(), articlePath)
    const fileContents = fs.readFileSync(fullPath, "utf-8")

    const matterResult = matter(fileContents)

    return {
      id,
      title: matterResult.data.title,
      date: matterResult.data.date,
      category: matterResult.data.category,
    }
  })

  return allArticlesData.sort((a, b) => {
    const format = "DD-MM-YYYY"
    const dateOne = moment(a.date, format)
    const dateTwo = moment(b.date, format)
    if (dateOne.isBefore(dateTwo)) {
      return -1
    } else if (dateOne.isAfter(dateTwo)) {
      return 1
    }
    return 0
  })
}

export const getCategorisedArticles = (): Record<string, ArticleItem[]> =>
  getSortedArticles().reduce<Record<string, ArticleItem[]>>((categories, article) => {
    categories[article.category] ??= []
    categories[article.category].push(article)
    return categories
  }, {})

export const getArticleData = async (slug: string): Promise<ArticleData> => {
  const articlePath = getArticlePaths().find(
    (storedPath) => path.basename(storedPath, ".md") === slug,
  )
  if (!articlePath) {
    throw new Error(`Article not found: ${slug}`)
  }
  const fullPath = path.join(process.cwd(), articlePath)
  const fileContents = fs.readFileSync(fullPath, "utf-8")
  const matterResult = matter(fileContents)
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)

  return {
    id: slug,
    title: matterResult.data.title,
    date: matterResult.data.date,
    category: matterResult.data.category,
    contentHtml: processedContent.toString(),
  }
}
