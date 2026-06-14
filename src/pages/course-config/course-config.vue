<template>
  <view class="container">
    <view class="card info-card">
      <view class="info-item">
        <text class="info-label">当前日期</text>
        <text class="info-value">{{ store.currentDate }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">复习天数</text>
        <text class="info-value highlight">{{ store.studyDays }} 天</text>
      </view>
    </view>

    <view class="card course-card">
      <text class="section-title">⚙️ 科目配置</text>
      <text class="section-desc">为每门科目设置学分、难度和学习类型，工具将根据这些参数智能分配复习时间</text>
      
      <view v-if="store.courses.length === 0" class="empty-list">
        <text class="empty-icon">📝</text>
        <text class="empty-text">暂无配置的科目</text>
        <text class="empty-hint">点击下方按钮开始配置</text>
      </view>
      
      <view v-else class="course-list">
        <view v-for="course in store.courses" :key="course.id" class="course-item">
          <view class="course-header">
            <text class="course-name">{{ course.name }}</text>
            <view class="course-tags">
              <text :class="['tag', `tag-${course.difficulty}`]">{{ difficultyText[course.difficulty] }}</text>
              <text :class="['tag', `tag-${course.type}`]">{{ typeText[course.type] }}</text>
            </view>
          </view>
          <view class="course-detail">
            <view class="detail-row">
              <text class="detail-label">学分</text>
              <text class="detail-value">{{ course.credits }} 学分</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">考试日期</text>
              <text class="detail-value">{{ course.examDate }}</text>
            </view>
          </view>
          <view class="course-actions">
            <text class="edit-btn" @click="editCourse(course)">编辑</text>
            <text class="delete-btn" @click="removeCourse(course.id)">删除</text>
          </view>
        </view>
      </view>
    </view>

    <view class="card tips-card">
      <text class="tips-title">📊 权重计算说明</text>
      <text class="tips-text">
        • 学分越高，分配时间越多\n
        • 难度：简单(1.0)、中等(1.2)、困难(1.5)\n
        • 类型：背诵(1.3)、刷题(1.0)\n
        • 临近考试科目优先级更高
      </text>
    </view>

    <view class="footer-btn">
      <button class="btn-secondary" @click="goBack">返回</button>
      <button class="btn-primary" @click="generateSchedule">生成计划</button>
    </view>

    <view v-if="showAddModal" class="modal-overlay" @click="closeModal">
      <view class="modal-content" @click.stop>
        <text class="modal-title">{{ editingCourse ? '编辑科目' : '添加科目' }}</text>
        
        <view class="form-group">
          <text class="form-label">选择科目</text>
          <picker :value="selectedExamIndex" :range="availableExams" range-key="name" @change="onExamSelect">
            <view class="picker-view">
              <text class="picker-text">{{ selectedExam?.name || '请选择科目' }}</text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>

        <view class="form-group">
          <text class="form-label">学分</text>
          <view class="credits-picker">
            <text class="picker-btn" @click="adjustCredits(-1)">-</text>
            <text class="credits-value">{{ formData.credits }}</text>
            <text class="picker-btn" @click="adjustCredits(1)">+</text>
          </view>
        </view>

        <view class="form-group">
          <text class="form-label">难度</text>
          <view class="option-group">
            <text 
              v-for="(text, key) in difficultyText" 
              :key="key"
              :class="['option-btn', formData.difficulty === key ? 'active' : '']"
              @click="formData.difficulty = key as 'easy' | 'medium' | 'hard'"
            >{{ text }}</text>
          </view>
        </view>

        <view class="form-group">
          <text class="form-label">学习类型</text>
          <view class="option-group">
            <text 
              v-for="(text, key) in typeText" 
              :key="key"
              :class="['option-btn', formData.type === key ? 'active' : '']"
              @click="formData.type = key as 'memorize' | 'practice'"
            >{{ text }}</text>
          </view>
        </view>

        <view class="modal-actions">
          <button class="btn-secondary" @click="closeModal">取消</button>
          <button class="btn-primary" @click="saveCourse">{{ editingCourse ? '保存' : '添加' }}</button>
        </view>
      </view>
    </view>

    <view class="fab-btn" @click="showAddModal = true">
      <text class="fab-icon">+</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useScheduleStore, type Course } from '@/stores/schedule'

const store = useScheduleStore()
const showAddModal = ref(false)
const editingCourse = ref<Course | null>(null)
const selectedExamIndex = ref(-1)

const difficultyText: Record<string, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难'
}

const typeText: Record<string, string> = {
  memorize: '背诵型',
  practice: '刷题型'
}

const formData = reactive({
  credits: 3,
  difficulty: 'medium' as 'easy' | 'medium' | 'hard',
  type: 'practice' as 'memorize' | 'practice'
})

const availableExams = computed(() => {
  const configuredCourseIds = store.courses.map(c => c.name)
  return store.exams.filter(e => !configuredCourseIds.includes(e.name))
})

const selectedExam = computed(() => {
  if (selectedExamIndex.value >= 0 && availableExams.value.length > 0) {
    return availableExams.value[selectedExamIndex.value]
  }
  return null
})

function onExamSelect(e: any) {
  selectedExamIndex.value = e.detail.value
}

function adjustCredits(delta: number) {
  formData.credits = Math.max(1, Math.min(10, formData.credits + delta))
}

function editCourse(course: Course) {
  editingCourse.value = course
  selectedExamIndex.value = -1
  formData.credits = course.credits
  formData.difficulty = course.difficulty
  formData.type = course.type
  showAddModal.value = true
}

function removeCourse(id: string) {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个科目配置吗？',
    success: (res) => {
      if (res.confirm) {
        store.removeCourse(id)
        uni.showToast({ title: '删除成功', icon: 'success' })
      }
    }
  })
}

function saveCourse() {
  if (editingCourse.value) {
    store.updateCourse(editingCourse.value.id, {
      credits: formData.credits,
      difficulty: formData.difficulty,
      type: formData.type
    })
    uni.showToast({ title: '更新成功', icon: 'success' })
  } else {
    if (!selectedExam.value) {
      uni.showToast({ title: '请选择科目', icon: 'none' })
      return
    }
    
    store.addCourse({
      name: selectedExam.value.name,
      credits: formData.credits,
      difficulty: formData.difficulty,
      type: formData.type,
      examDate: selectedExam.value.date
    })
    uni.showToast({ title: '添加成功', icon: 'success' })
  }
  
  closeModal()
}

function closeModal() {
  showAddModal.value = false
  editingCourse.value = null
  selectedExamIndex.value = -1
  formData.credits = 3
  formData.difficulty = 'medium'
  formData.type = 'practice'
}

function goBack() {
  uni.navigateBack()
}

function generateSchedule() {
  if (store.courses.length === 0) {
    uni.showToast({ title: '请至少配置一门科目', icon: 'none' })
    return
  }
  
  store.generateDailySchedules()
  uni.switchTab({ url: '/pages/schedule/schedule' })
}
</script>

<style lang="scss" scoped>
.info-card {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  padding: 24rpx;
  border-radius: 16rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  
  &:first-child {
    border-bottom: 2rpx solid rgba(255, 255, 255, 0.2);
  }
}

.info-label {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
}

.info-value {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 500;
}

.highlight {
  font-size: 36rpx;
  font-weight: 700;
}

.section-desc {
  display: block;
  font-size: 26rpx;
  color: #999;
  margin-bottom: 24rpx;
}

.empty-list {
  padding: 60rpx 0;
  text-align: center;
}

.empty-icon {
  font-size: 80rpx;
  display: block;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
  display: block;
  margin-bottom: 8rpx;
}

.empty-hint {
  font-size: 24rpx;
  color: #ccc;
}

.course-list {
  margin-top: 16rpx;
}

.course-item {
  padding: 24rpx;
  background: #fafafa;
  border-radius: 12rpx;
  margin-bottom: 16rpx;
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.course-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #1a1a1a;
}

.course-tags {
  display: flex;
  gap: 12rpx;
}

.course-detail {
  margin-bottom: 16rpx;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8rpx 0;
}

.detail-label {
  font-size: 26rpx;
  color: #999;
}

.detail-value {
  font-size: 26rpx;
  color: #666;
}

.course-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
}

.edit-btn {
  font-size: 26rpx;
  color: #6366f1;
  padding: 8rpx 20rpx;
}

.delete-btn {
  font-size: 26rpx;
  color: #ef4444;
  padding: 8rpx 20rpx;
}

.tips-card {
  background: #f0fdf4;
  border: 2rpx solid #bbf7d0;
  padding: 24rpx;
}

.tips-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #166534;
  margin-bottom: 12rpx;
}

.tips-text {
  font-size: 24rpx;
  color: #15803d;
  line-height: 1.8;
  white-space: pre-wrap;
}

.footer-btn {
  display: flex;
  gap: 20rpx;
  margin-top: 40rpx;
  padding-bottom: 40rpx;
}

.footer-btn .btn-secondary,
.footer-btn .btn-primary {
  flex: 1;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 620rpx;
  background: #ffffff;
  border-radius: 24rpx;
  padding: 32rpx;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-title {
  display: block;
  font-size: 34rpx;
  font-weight: 600;
  color: #1a1a1a;
  text-align: center;
  margin-bottom: 32rpx;
}

.form-group {
  margin-bottom: 28rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 16rpx;
}

.picker-view {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  background: #f8fafc;
  border-radius: 12rpx;
}

.picker-text {
  font-size: 30rpx;
  color: #1a1a1a;
}

.picker-arrow {
  font-size: 24rpx;
  color: #999;
}

.credits-picker {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40rpx;
}

.picker-btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border-radius: 50%;
  font-size: 36rpx;
  color: #6366f1;
  font-weight: 600;
}

.credits-value {
  font-size: 48rpx;
  font-weight: 700;
  color: #6366f1;
}

.option-group {
  display: flex;
  gap: 20rpx;
}

.option-btn {
  flex: 1;
  padding: 20rpx;
  text-align: center;
  border-radius: 12rpx;
  font-size: 28rpx;
  background: #f5f7fa;
  color: #666;
  
  &.active {
    background: #6366f1;
    color: #ffffff;
  }
}

.modal-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 32rpx;
}

.modal-actions .btn-secondary,
.modal-actions .btn-primary {
  flex: 1;
}

.fab-btn {
  position: fixed;
  right: 40rpx;
  bottom: 200rpx;
  width: 100rpx;
  height: 100rpx;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(99, 102, 241, 0.4);
}

.fab-icon {
  font-size: 48rpx;
  color: #ffffff;
  font-weight: 300;
}
</style>
