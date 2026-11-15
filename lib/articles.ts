import fs from "fs"
import matter from "gray-matter"
import path from "path"
import moment from "moment"
import { getArticlePath, getArticlePaths, removeArticlePath } from "@/lib/articlePaths"
import { database } from "@/lib/database"
import { remark } from "remark"
import html from "remark-html"

import type { ArticleData, ArticleItem } from "@/types"

const getYoutubeId = (value: string): string | null => {
  try {
    const url = new URL(value)
    const id =
      url.hostname === "youtu.be"
        ? url.pathname.slice(1)
        : url.hostname.endsWith("youtube.com")
          ? url.searchParams.get("v") ??
            url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1]
          : null

    return id && /^[\w-]{11}$/.test(id) ? id : null
  } catch {
    return null
  }
}

export const getSortedArticles = (): ArticleItem[] => {
  const allArticlesData: ArticleItem[] = []

  for (const articlePath of getArticlePaths()) {
    const fullPath = path.join(process.cwd(), articlePath)
    let fileContents: string
    try {
      fileContents = fs.readFileSync(fullPath, "utf-8")
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        removeArticlePath(fullPath)
        continue
      }
      throw error
    }

    const { data } = matter(fileContents)
    allArticlesData.push({
      id: path.basename(articlePath, ".md"),
      title: data.title,
      date: data.date,
      category: data.category,
    })
  }

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

export const getArticleData = async (
  slug: string,
): Promise<ArticleData | null> => {
  const articlePath = getArticlePath(slug)
  if (!articlePath) return null

  const fullPath = path.join(process.cwd(), articlePath.path)
  let fileContents: string
  try {
    fileContents = fs.readFileSync(fullPath, "utf-8")
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      removeArticlePath(fullPath)
      return null
    }
    throw error
  }

  const matterResult = matter(fileContents)
  const videos: string[] = []
  const content = matterResult.content.replace(
    /\[\[(https?:\/\/[^\]\s]+)\]\]/g,
    (match, url: string) => {
      const videoId = getYoutubeId(url)
      if (!videoId) return match

      const placeholder = `YOUTUBE_VIDEO_${videos.length}_PLACEHOLDER`
      videos.push(
        `<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${videoId}" title="YouTube video" loading="lazy" allowfullscreen></iframe></div>`,
      )
      return placeholder
    },
  )
  const processedContent = await remark()
    .use(html)
    .process(content)
  let contentHtml = processedContent.toString()
  videos.forEach((video, index) => {
    contentHtml = contentHtml.replace(
      `<p>YOUTUBE_VIDEO_${index}_PLACEHOLDER</p>`,
      video,
    )
  })
  const author = articlePath.userId
    ? (database
        .prepare("SELECT name FROM users WHERE id = ?")
        .get(articlePath.userId) as { name: string } | undefined)
    : undefined

  return {
    id: slug,
    title: matterResult.data.title,
    date: matterResult.data.date,
    category: matterResult.data.category,
    contentHtml,
    contentMarkdown: matterResult.content,
    userId: articlePath.userId,
    authorName: author?.name ?? null,
  }
}
