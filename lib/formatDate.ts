import moment from "moment"

const STORED_FORMAT = "DD-MM-YYYY"

export const formatArticleDate = (date: string): string => {
  const parsed = moment(date, STORED_FORMAT, true)
  return parsed.isValid() ? parsed.format("DD MMM YYYY") : date
}
