<template>
  <view class="container">
    <view v-if="store.dailySchedules.length === 0" class="empty-state">
      <text class="empty-icon">📋</text>
      <text class="empty-title">暂无复习计划</text>
      <text class="empty-desc">请先导入考试时间并配置科目信息</text>
      <button class="btn-primary mt-20" @click="goToConfig">开始配置</button>
    </view>

    <view v-else class="schedule-content">
      <view class="date-nav">
        <view class="nav-btn" @click="prevDay">
          <text class="nav-icon">‹</text>
        </view>
        <view class="date-info">
          <text class="current-date">{{ displayDate }}</text>
          <text class="current-weekday">{{ weekdayText }}</text>
        </view>
        <view class="nav-btn" @click="nextDay">
          <text class="nav-icon">›</text>
        </view>
      </view>

      <view class="progress-section">
        <view class="progress-header">
          <text class="progress-label">复习进度</text>
          <text class="progress-percent">{{ progressPercent }}%</text>
        </view>
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
        </view>
        <view class="progress-info">
          <text class="info-text">已复习 {{ completedTasks }} / {{ totalTasks }} 项</text>
        </view>
      </view>

      <view class="card timeline-card">
        <view class="card-header">
          <text class="section-title">⏰ 一日计划</text>
          <text class="export-btn" @click="exportPDF">📄 导出PDF</text>
        </view>
        
        <view class="timeline">
          <view 
            v-for="(task, index) in currentSchedule?.tasks" 
            :key="task.id" 
            class="timeline-item"
          >
            <view class="timeline-line">
              <view class="timeline-dot"></view>
              <view v-if="index < currentSchedule?.tasks.length - 1" class="timeline-connector"></view>
            </view>
            <view class="timeline-content">
              <view class="task-time">
                <text class="time-start">{{ task.startTime }}</text>
                <text class="time-end">{{ task.endTime }}</text>
              </view>
              <view class="task-card">
                <view class="task-header">
                  <text class="task-course">{{ task.courseName }}</text>
                  <view class="task-tags">
                    <text class="tag-time">{{ task.duration }}分钟</text>
                  </view>
                </view>
                <text class="task-content">{{ task.content }}</text>
                <view class="task-action">
                  <view :class="['check-circle', task.completed ? 'checked' : '']" @click="toggleTask(task.id)">
                    <text v-if="task.completed" class="check-icon">✓</text>
                  </view>
                  <text :class="['task-status', task.completed ? 'completed' : '']">
                    {{ task.completed ? '已完成' : '未完成' }}
                  </text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view v-if="currentSchedule?.tasks.length === 0" class="no-task">
          <text class="no-task-icon">🎉</text>
          <text class="no-task-text">今日无任务，好好休息！</text>
        </view>
      </view>

      <view class="card summary-card">
        <text class="section-title">📊 今日统计</text>
        <view class="summary-grid">
          <view class="summary-item">
            <text class="summary-value">{{ totalHours }}</text>
            <text class="summary-label">学习时长</text>
            <text class="summary-unit">小时</text>
          </view>
          <view class="summary-item">
            <text class="summary-value">{{ currentSchedule?.tasks.length || 0 }}</text>
            <text class="summary-label">任务数量</text>
            <text class="summary-unit">项</text>
          </view>
          <view class="summary-item">
            <text class="summary-value">{{ completedTasks }}</text>
            <text class="summary-label">已完成</text>
            <text class="summary-unit">项</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部导航 -->
    <view class="bottom-nav">
      <view class="nav-item" @click="goToHome">
        <text class="nav-icon">🏠</text>
        <text class="nav-text">首页</text>
      </view>
      <view class="nav-item" @click="goToAdvice">
        <text class="nav-icon">💡</text>
        <text class="nav-text">备考建议</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useScheduleStore } from '@/stores/schedule'

const store = useScheduleStore()

const currentDateIndex = ref(0)
const completedTasksMap = ref<Record<string, boolean>>({})

const currentSchedule = computed(() => {
  return store.dailySchedules[currentDateIndex.value]
})

const displayDate = computed(() => {
  if (!currentSchedule.value) return ''
  const date = new Date(currentSchedule.value.date)
  return `${date.getMonth() + 1}月${date.getDate()}日`
})

const weekdayText = computed(() => {
  if (!currentSchedule.value) return ''
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const date = new Date(currentSchedule.value.date)
  return weekdays[date.getDay()]
})

const totalTasks = computed(() => {
  return currentSchedule.value?.tasks.length || 0
})

const completedTasks = computed(() => {
  return currentSchedule.value?.tasks.filter(t => completedTasksMap.value[t.id]).length || 0
})

const progressPercent = computed(() => {
  if (totalTasks.value === 0) return 0
  return Math.round((completedTasks.value / totalTasks.value) * 100)
})

const totalHours = computed(() => {
  const totalMinutes = currentSchedule.value?.tasks.reduce((sum, t) => sum + t.duration, 0) || 0
  return (totalMinutes / 60).toFixed(1)
})

function prevDay() {
  if (currentDateIndex.value > 0) {
    currentDateIndex.value--
  }
}

function nextDay() {
  if (currentDateIndex.value < store.dailySchedules.length - 1) {
    currentDateIndex.value++
  }
}

function goToHome() {
  uni.navigateTo({ url: '/pages/index/index' })
}

function goToAdvice() {
  uni.navigateTo({ url: '/pages/advice/advice' })
}

function goToConfig() {
  uni.navigateTo({ url: '/pages/exam-import/exam-import' })
}

function toggleTask(taskId: string) {
  completedTasksMap.value[taskId] = !completedTasksMap.value[taskId]
}

function goToConfig() {
  uni.navigateTo({ url: '/pages/exam-import/exam-import' })
}

function exportPDF() {
  uni.showLoading({ title: '正在生成...' })
  
  setTimeout(() => {
    try {
      // 生成HTML内容
      let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>期末复习计划</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { text-align: center; color: #6366f1; margin-bottom: 30px; }
    .day { margin-bottom: 30px; page-break-inside: avoid; }
    .day-title { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 15px; border-bottom: 2px solid #6366f1; padding-bottom: 8px; }
    .task { display: flex; padding: 12px; background: #f8fafc; border-radius: 6px; margin-bottom: 10px; border-left: 3px solid #6366f1; }
    .task-time { min-width: 80px; font-weight: bold; color: #6366f1; font-size: 14px; }
    .task-content { flex: 1; }
    .task-course { font-weight: bold; margin-bottom: 4px; font-size: 14px; }
    .task-desc { color: #666; font-size: 13px; }
    .footer { text-align: center; margin-top: 40px; color: #999; font-size: 12px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>📚 期末复习计划</h1>
`

      store.dailySchedules.forEach(schedule => {
        const date = new Date(schedule.date)
        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        const weekday = weekdays[date.getDay()]
        
        html += `<div class="day">
  <div class="day-title">${date.getMonth() + 1}月${date.getDate()}日 ${weekday}</div>
`
        
        schedule.tasks.forEach(task => {
          html += `<div class="task">
    <div class="task-time">${task.startTime} - ${task.endTime}</div>
    <div class="task-content">
      <div class="task-course">${task.courseName}</div>
      <div class="task-desc">${task.content}</div>
    </div>
  </div>
`
        })
        
        html += `</div>\n`
      })

      html += `<div class="footer">
  <p>💪 加油！坚持就是胜利！</p>
  <p>生成时间：${new Date().toLocaleString()}</p>
</div>
</body>
</html>`

      // 创建下载
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = '期末复习计划.html'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      uni.hideLoading()
      uni.showToast({ title: '导出成功', icon: 'success' })
    } catch (e) {
      uni.hideLoading()
      uni.showToast({ title: '导出失败，请重试', icon: 'none' })
    }
  }, 500)
}
</script>

<style lang="scss" scoped>
.empty-state {
  padding: 100rpx 40rpx;
  text-align: center;
}

.empty-icon {
  font-size: 120rpx;
  display: block;
  margin-bottom: 24rpx;
}

.empty-title {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16rpx;
}

.empty-desc {
  display: block;
  font-size: 28rpx;
  color: #999;
  margin-bottom: 32rpx;
}

.schedule-content {
  padding-top: 20rpx;
}

.date-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx;
  background: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
}

.nav-btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border-radius: 50%;
}

.nav-icon {
  font-size: 36rpx;
  color: #6366f1;
  font-weight: 300;
}

.date-info {
  text-align: center;
}

.current-date {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #1a1a1a;
}

.current-weekday {
  display: block;
  font-size: 24rpx;
  color: #999;
  margin-top: 4rpx;
}

.progress-section {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.progress-label {
  font-size: 28rpx;
  color: #333;
}

.progress-percent {
  font-size: 28rpx;
  font-weight: 600;
  color: #6366f1;
}

.progress-bar {
  height: 12rpx;
  background: #f0f0f0;
  border-radius: 6rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 6rpx;
  transition: width 0.3s ease;
}

.progress-info {
  margin-top: 12rpx;
}

.info-text {
  font-size: 24rpx;
  color: #999;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.export-btn {
  font-size: 26rpx;
  color: #6366f1;
  padding: 12rpx 20rpx;
  background: #eef2ff;
  border-radius: 20rpx;
}

.timeline {
  position: relative;
}

.timeline-item {
  display: flex;
  margin-bottom: 24rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.timeline-line {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40rpx;
}

.timeline-dot {
  width: 16rpx;
  height: 16rpx;
  background: #6366f1;
  border-radius: 50%;
  margin-top: 8rpx;
}

.timeline-connector {
  flex: 1;
  width: 2rpx;
  background: #e8e8e8;
  margin-top: 8rpx;
}

.timeline-content {
  flex: 1;
  margin-left: 16rpx;
}

.task-time {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 12rpx;
}

.time-start {
  font-size: 28rpx;
  font-weight: 600;
  color: #6366f1;
}

.time-end {
  font-size: 26rpx;
  color: #999;
}

.task-card {
  background: #f8fafc;
  border-radius: 12rpx;
  padding: 20rpx;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.task-course {
  font-size: 30rpx;
  font-weight: 600;
  color: #1a1a1a;
}

.task-tags {
  display: flex;
  gap: 8rpx;
}

.tag-time {
  font-size: 22rpx;
  color: #6366f1;
  background: #eef2ff;
  padding: 6rpx 12rpx;
  border-radius: 10rpx;
}

.task-content {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 16rpx;
}

.task-action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12rpx;
}

.check-circle {
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid #d1d5db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.checked {
    background: #6366f1;
    border-color: #6366f1;
  }
}

.check-icon {
  font-size: 24rpx;
  color: #ffffff;
}

.task-status {
  font-size: 24rpx;
  color: #999;
  
  &.completed {
    color: #22c55e;
  }
}

.no-task {
  padding: 60rpx 0;
  text-align: center;
}

.no-task-icon {
  font-size: 60rpx;
  display: block;
  margin-bottom: 16rpx;
}

.no-task-text {
  font-size: 28rpx;
  color: #999;
}

.summary-card {
  padding: 24rpx;
}

.summary-grid {
  display: flex;
  justify-content: space-around;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.summary-value {
  font-size: 40rpx;
  font-weight: 700;
  color: #6366f1;
}

.summary-label {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}

.summary-unit {
  font-size: 22rpx;
  color: #ccc;
}

.bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  display: flex;
  padding: 16rpx 40rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.nav-icon {
  font-size: 48rpx;
}

.nav-text {
  font-size: 24rpx;
  color: #666;
}
</style>
