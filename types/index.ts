export type ArticleItem = {
  id: string
  title: string
  date: string
  category: string
}

export type ArticleData = ArticleItem & {
  contentHtml: string
  contentMarkdown: string
  userId: number | null
  authorName: string | null
}
