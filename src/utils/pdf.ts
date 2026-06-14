import type { DaySchedule, DailyTask } from '@/stores/schedule'

export function generatePDFContent(schedules: DaySchedule[]): string {
  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>期末复习计划</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      color: #333;
    }
    h1 {
      text-align: center;
      color: #6366f1;
      margin-bottom: 40px;
    }
    .day-section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }
    .day-title {
      font-size: 24px;
      font-weight: bold;
      color: #1a1a1a;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #6366f1;
    }
    .task-item {
      display: flex;
      margin-bottom: 20px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
      border-left: 4px solid #6366f1;
    }
    .task-time {
      min-width: 100px;
      font-weight: bold;
      color: #6366f1;
    }
    .task-content {
      flex: 1;
    }
    .task-course {
      font-weight: bold;
      margin-bottom: 8px;
    }
    .task-desc {
      color: #666;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      color: #999;
      font-size: 14px;
    }
    @media print {
      body {
        padding: 20px;
      }
      .day-section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <h1>📚 期末复习计划</h1>
`

  schedules.forEach(schedule => {
    const date = new Date(schedule.date)
    const dateStr = `${date.getMonth() + 1}月${date.getDate()}日`
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const weekday = weekdays[date.getDay()]

    html += `
    <div class="day-section">
      <div class="day-title">${dateStr} ${weekday}</div>
`

    schedule.tasks.forEach(task => {
      html += `
      <div class="task-item">
        <div class="task-time">${task.startTime} - ${task.endTime}</div>
        <div class="task-content">
          <div class="task-course">${task.courseName}</div>
          <div class="task-desc">${task.content}</div>
        </div>
      </div>
`
    })

    html += `
    </div>
`
  })

  html += `
  <div class="footer">
    <p>💪 加油！坚持就是胜利！</p>
    <p>生成时间：${new Date().toLocaleDateString()}</p>
  </div>
</body>
</html>
`

  return html
}

export function downloadPDF(html: string, filename: string = '复习计划.html') {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

export function getWeekday(dateStr: string): string {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const date = new Date(dateStr)
  return weekdays[date.getDay()]
}
