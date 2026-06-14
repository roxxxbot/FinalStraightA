<template>
  <view class="container">
    <view class="card date-card">
      <text class="section-title">📅 设置当前日期</text>
      <picker mode="date" :value="store.currentDate" @change="onDateChange">
        <view class="date-picker">
          <text class="date-text">{{ store.currentDate || '请选择日期' }}</text>
          <text class="date-arrow">▼</text>
        </view>
      </picker>
    </view>

    <view class="card exam-card">
      <view class="card-header">
        <text class="section-title">📝 添加考试科目</text>
        <text class="add-btn" @click="showAddExam = true">+ 添加</text>
      </view>
      
      <view v-if="store.exams.length === 0" class="empty-list">
        <text class="empty-icon">📚</text>
        <text class="empty-text">暂无考试科目，请添加</text>
      </view>
      
      <view v-else class="exam-list">
        <view v-for="exam in store.exams" :key="exam.id" class="exam-item">
          <view class="exam-info">
            <text class="exam-name">{{ exam.name }}</text>
            <text class="exam-detail">{{ exam.date }} {{ exam.time }}</text>
          </view>
          <view class="exam-actions">
            <text class="action-btn delete-btn" @click="removeExam(exam.id)">删除</text>
          </view>
        </view>
      </view>
    </view>

    <view class="card tips-card">
      <text class="tips-title">💡 提示</text>
      <text class="tips-text">建议按照考试时间顺序添加，工具会根据考试日期智能分配复习时间</text>
    </view>

    <view class="footer-btn">
      <button class="btn-primary" @click="nextStep">下一步</button>
    </view>

    <view v-if="showAddExam" class="modal-overlay" @click="showAddExam = false">
      <view class="modal-content" @click.stop>
        <text class="modal-title">添加考试科目</text>
        <view class="form-group">
          <text class="form-label">科目名称</text>
          <input class="input-field" v-model="newExam.name" placeholder="请输入科目名称" />
        </view>
        <view class="form-group">
          <text class="form-label">考试日期</text>
          <picker mode="date" :value="newExam.date" @change="onExamDateChange">
            <view class="date-picker">
              <text class="date-text">{{ newExam.date || '请选择日期' }}</text>
              <text class="date-arrow">▼</text>
            </view>
          </picker>
        </view>
        <view class="form-group">
          <text class="form-label">考试时间</text>
          <picker mode="time" :value="newExam.time" @change="onExamTimeChange">
            <view class="date-picker">
              <text class="date-text">{{ newExam.time || '请选择时间' }}</text>
              <text class="date-arrow">▼</text>
            </view>
          </picker>
        </view>
        <view class="modal-actions">
          <button class="btn-secondary" @click="showAddExam = false">取消</button>
          <button class="btn-primary" @click="addExam">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useScheduleStore } from '@/stores/schedule'

const store = useScheduleStore()
const showAddExam = ref(false)

const newExam = reactive({
  name: '',
  date: '',
  time: ''
})

function onDateChange(e: any) {
  store.setCurrentDate(e.detail.value)
}

function onExamDateChange(e: any) {
  newExam.date = e.detail.value
}

function onExamTimeChange(e: any) {
  newExam.time = e.detail.value
}

function addExam() {
  if (!newExam.name) {
    uni.showToast({ title: '请输入科目名称', icon: 'none' })
    return
  }
  if (!newExam.date) {
    uni.showToast({ title: '请选择考试日期', icon: 'none' })
    return
  }
  if (!newExam.time) {
    uni.showToast({ title: '请选择考试时间', icon: 'none' })
    return
  }
  
  store.addExam({
    name: newExam.name,
    date: newExam.date,
    time: newExam.time
  })
  
  newExam.name = ''
  newExam.date = ''
  newExam.time = ''
  showAddExam.value = false
  
  uni.showToast({ title: '添加成功', icon: 'success' })
}

function removeExam(id: string) {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个考试科目吗？',
    success: (res) => {
      if (res.confirm) {
        store.removeExam(id)
        uni.showToast({ title: '删除成功', icon: 'success' })
      }
    }
  })
}

function nextStep() {
  if (!store.currentDate) {
    uni.showToast({ title: '请先设置当前日期', icon: 'none' })
    return
  }
  if (store.exams.length === 0) {
    uni.showToast({ title: '请至少添加一门考试科目', icon: 'none' })
    return
  }
  
  uni.navigateTo({ url: '/pages/course-config/course-config' })
}
</script>

<style lang="scss" scoped>
.date-card {
  padding: 24rpx;
}

.date-picker {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  background: #f8fafc;
  border-radius: 12rpx;
}

.date-text {
  font-size: 30rpx;
  color: #1a1a1a;
}

.date-arrow {
  font-size: 24rpx;
  color: #999;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.add-btn {
  font-size: 28rpx;
  color: #6366f1;
  font-weight: 500;
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
}

.exam-list {
  margin-top: 16rpx;
}

.exam-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 2rpx dashed #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
}

.exam-info {
  flex: 1;
}

.exam-name {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8rpx;
}

.exam-detail {
  display: block;
  font-size: 24rpx;
  color: #999;
}

.exam-actions {
  margin-left: 20rpx;
}

.action-btn {
  font-size: 26rpx;
  padding: 12rpx 24rpx;
  border-radius: 20rpx;
}

.delete-btn {
  background: #fef2f2;
  color: #ef4444;
}

.tips-card {
  background: #f0f9ff;
  border: 2rpx solid #bae6fd;
  padding: 24rpx;
}

.tips-title {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #0369a1;
  margin-bottom: 12rpx;
}

.tips-text {
  font-size: 26rpx;
  color: #075985;
  line-height: 1.6;
}

.footer-btn {
  margin-top: 40rpx;
  padding-bottom: 40rpx;
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
  margin-bottom: 24rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 12rpx;
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
</style>
