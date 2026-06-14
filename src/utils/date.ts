/**
 * 格式化日期
 * @param dateStr 日期字符串 (YYYY-MM-DD)
 * @returns 格式化后的日期字符串 (M月D日)
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

/**
 * 获取星期几
 * @param dateStr 日期字符串 (YYYY-MM-DD)
 * @returns 星期几的中文表示
 */
export function getWeekday(dateStr: string): string {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const date = new Date(dateStr)
  return weekdays[date.getDay()]
}

/**
 * 计算两个日期之间的天数
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 天数
 */
export function daysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diff = end.getTime() - start.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * 判断是否为今天
 * @param dateStr 日期字符串
 * @returns 是否为今天
 */
export function isToday(dateStr: string): boolean {
  const today = new Date().toISOString().split('T')[0]
  return dateStr === today
}

/**
 * 格式化时间显示
 * @param minutes 分钟数
 * @returns 格式化后的时间字符串
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}分钟`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
}
