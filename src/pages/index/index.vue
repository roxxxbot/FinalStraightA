<template>
  <view class="container">
    <view class="hero-section">
      <view class="hero-bg"></view>
      <view class="hero-content">
        <text class="hero-title">期末极限满绩</text>
        <text class="hero-subtitle">科学规划，轻松备考</text>
      </view>
    </view>

    <view class="card stats-card">
      <view class="stats-row">
        <view class="stat-item">
          <text class="stat-value">{{ store.studyDays }}</text>
          <text class="stat-label">复习天数</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{ store.courses.length }}</text>
          <text class="stat-label">考试科目</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{ store.totalCredits }}</text>
          <text class="stat-label">总学分</text>
        </view>
      </view>
    </view>

    <view class="card action-card">
      <view class="action-item" @click="goToExamImport">
        <view class="action-icon exam-icon">📅</view>
        <view class="action-info">
          <text class="action-title">导入考试时间</text>
          <text class="action-desc">添加考试科目和时间安排</text>
        </view>
        <text class="action-arrow">→</text>
      </view>
      
      <view class="action-item" @click="goToCourseConfig">
        <view class="action-icon config-icon">⚙️</view>
        <view class="action-info">
          <text class="action-title">科目配置</text>
          <text class="action-desc">设置学分、难度和学习类型</text>
        </view>
        <text class="action-arrow">→</text>
      </view>
      
      <view class="action-item" @click="generateSchedule">
        <view class="action-icon schedule-icon">📋</view>
        <view class="action-info">
          <text class="action-title">生成计划</text>
          <text class="action-desc">智能生成每日复习计划</text>
        </view>
        <text class="action-arrow">→</text>
      </view>
    </view>

    <view class="card tips-card">
      <text class="section-title">📝 今日小贴士</text>
      <view class="tip-content">
        <text class="tip-text">{{ todayTip }}</text>
      </view>
    </view>

    <view v-if="store.dailySchedules.length > 0" class="card preview-card">
      <view class="preview-header">
        <text class="section-title">今日计划预览</text>
        <text class="preview-date">{{ todayDate }}</text>
      </view>
      <view v-if="todaySchedule" class="preview-tasks">
        <view v-for="task in todaySchedule.tasks.slice(0, 3)" :key="task.id" class="preview-task">
          <view class="task-time">
            <text class="time-text">{{ task.startTime }}</text>
            <text class="time-separator">-</text>
            <text class="time-text">{{ task.endTime }}</text>
          </view>
          <view class="task-info">
            <text class="task-course">{{ task.courseName }}</text>
            <text class="task-content">{{ task.content }}</text>
          </view>
        </view>
        <view v-if="todaySchedule.tasks.length > 3" class="preview-more">
          <text class="more-text">还有 {{ todaySchedule.tasks.length - 3 }} 项任务...</text>
        </view>
      </view>
      <view v-else class="preview-empty">
        <text class="empty-text">暂无今日计划，请先生成复习计划</text>
      </view>
    </view>

    <!-- 底部导航 -->
    <view class="bottom-nav">
      <view class="nav-item" @click="goToSchedule">
        <text class="nav-icon">📋</text>
        <text class="nav-text">我的计划</text>
      </view>
      <view class="nav-item" @click="goToAdvice">
        <text class="nav-icon">💡</text>
        <text class="nav-text">备考建议</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useScheduleStore } from '@/stores/schedule'

const store = useScheduleStore()

const todayDate = computed(() => {
  const date = new Date()
  return `${date.getMonth() + 1}月${date.getDate()}日`
})

const todaySchedule = computed(() => {
  return store.getTodaySchedule()
})

const tips = [
  '合理安排复习时间，保持高效学习状态！',
  '记得定时休息，保护眼睛和身体健康',
  '保持良好心态，相信自己一定能行！',
  '复习时可以使用番茄工作法提高效率',
  '每天坚持运动，保持充沛精力',
  '合理饮食，多吃蔬菜水果补充营养',
  '遇到难题不要钻牛角尖，适当跳过回头再做'
]

const todayTip = computed(() => {
  const index = new Date().getDate() % tips.length
  return tips[index]
})

function goToExamImport() {
  uni.navigateTo({ url: '/pages/exam-import/exam-import' })
}

function goToCourseConfig() {
  if (store.exams.length === 0) {
    uni.showToast({ title: '请先导入考试时间', icon: 'none' })
    return
  }
  uni.navigateTo({ url: '/pages/course-config/course-config' })
}

function generateSchedule() {
  if (!store.currentDate) {
    uni.showToast({ title: '请先设置当前日期', icon: 'none' })
    return
  }
  if (store.exams.length === 0) {
    uni.showToast({ title: '请先导入考试时间', icon: 'none' })
    return
  }
  if (store.courses.length === 0) {
    uni.showToast({ title: '请先配置科目信息', icon: 'none' })
    return
  }
  
  store.generateDailySchedules()
  uni.navigateTo({ url: '/pages/schedule/schedule' })
}

function goToSchedule() {
  if (store.dailySchedules.length === 0) {
    uni.showToast({ title: '请先生成复习计划', icon: 'none' })
    return
  }
  uni.navigateTo({ url: '/pages/schedule/schedule' })
}

function goToAdvice() {
  uni.navigateTo({ url: '/pages/advice/advice' })
}
</script>

<style lang="scss" scoped>
.hero-section {
  position: relative;
  height: 320rpx;
  border-radius: 0 0 40rpx 40rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%);
}

.hero-content {
  position: relative;
  z-index: 1;
  padding: 60rpx 32rpx;
}

.hero-title {
  display: block;
  font-size: 48rpx;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12rpx;
}

.hero-subtitle {
  display: block;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.85);
}

.stats-card {
  padding: 32rpx;
}

.stats-row {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 48rpx;
  font-weight: 700;
  color: #6366f1;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}

.stat-divider {
  width: 2rpx;
  height: 60rpx;
  background: #e8e8e8;
}

.action-card {
  padding: 0;
}

.action-item {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
  border-bottom: 2rpx solid #f5f5f5;
  
  &:last-child {
    border-bottom: none;
  }
}

.action-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-right: 20rpx;
}

.exam-icon {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
}

.config-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
}

.schedule-icon {
  background: linear-gradient(135deg, #22c55e 0%, #4ade80 100%);
}

.action-info {
  flex: 1;
}

.action-title {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8rpx;
}

.action-desc {
  display: block;
  font-size: 24rpx;
  color: #999;
}

.action-arrow {
  font-size: 32rpx;
  color: #ccc;
}

.tips-card {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border: 2rpx solid #fde68a;
}

.tip-content {
  padding: 16rpx;
}

.tip-text {
  font-size: 28rpx;
  color: #92400e;
  line-height: 1.6;
}

.preview-card {
  padding: 24rpx;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.preview-date {
  font-size: 26rpx;
  color: #6366f1;
  font-weight: 500;
}

.preview-task {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 2rpx dashed #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
}

.task-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20rpx;
  min-width: 120rpx;
}

.time-text {
  font-size: 24rpx;
  color: #6366f1;
  font-weight: 500;
}

.time-separator {
  font-size: 20rpx;
  color: #ccc;
  margin: 4rpx 0;
}

.task-info {
  flex: 1;
}

.task-course {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8rpx;
}

.task-content {
  display: block;
  font-size: 24rpx;
  color: #999;
}

.preview-more {
  padding: 16rpx 0;
  text-align: center;
}

.more-text {
  font-size: 24rpx;
  color: #6366f1;
}

.preview-empty {
  padding: 40rpx 0;
  text-align: center;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
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
