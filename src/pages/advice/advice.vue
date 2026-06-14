<template>
  <view class="container">
    <view class="tabs">
      <view 
        v-for="tab in tabs" 
        :key="tab.key"
        :class="['tab-item', activeTab === tab.key ? 'active' : '']"
        @click="activeTab = tab.key"
      >
        <text class="tab-icon">{{ tab.icon }}</text>
        <text class="tab-text">{{ tab.text }}</text>
      </view>
    </view>

    <view class="advice-content">
      <view v-if="activeTab === 'sleep'" class="advice-list">
        <view v-for="advice in sleepAdvice" :key="advice.id" class="advice-card">
          <view class="advice-icon sleep">💤</view>
          <view class="advice-info">
            <text class="advice-title">{{ advice.title }}</text>
            <text class="advice-desc">{{ advice.content }}</text>
          </view>
        </view>
      </view>

      <view v-if="activeTab === 'diet'" class="advice-list">
        <view v-for="advice in dietAdvice" :key="advice.id" class="advice-card">
          <view class="advice-icon diet">🥗</view>
          <view class="advice-info">
            <text class="advice-title">{{ advice.title }}</text>
            <text class="advice-desc">{{ advice.content }}</text>
          </view>
        </view>
      </view>

      <view v-if="activeTab === 'exercise'" class="advice-list">
        <view v-for="advice in exerciseAdvice" :key="advice.id" class="advice-card">
          <view class="advice-icon exercise">🏋️</view>
          <view class="advice-info">
            <text class="advice-title">{{ advice.title }}</text>
            <text class="advice-desc">{{ advice.content }}</text>
          </view>
        </view>
      </view>

      <view v-if="activeTab === 'mindset'" class="advice-list">
        <view v-for="advice in mindsetAdvice" :key="advice.id" class="advice-card">
          <view class="advice-icon mindset">🧠</view>
          <view class="advice-info">
            <text class="advice-title">{{ advice.title }}</text>
            <text class="advice-desc">{{ advice.content }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="motivation-card">
      <text class="motivation-quote">"{{ currentQuote.text }}"</text>
      <text class="motivation-author">— {{ currentQuote.author }}</text>
    </view>

    <!-- 底部导航 -->
    <view class="bottom-nav">
      <view class="nav-item" @click="goToHome">
        <text class="nav-icon">🏠</text>
        <text class="nav-text">首页</text>
      </view>
      <view class="nav-item" @click="goToSchedule">
        <text class="nav-icon">📋</text>
        <text class="nav-text">我的计划</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { sleepAdvice, dietAdvice, exerciseAdvice, mindsetAdvice } from '@/data/advice'

const tabs = [
  { key: 'sleep', icon: '💤', text: '作息' },
  { key: 'diet', icon: '🥗', text: '饮食' },
  { key: 'exercise', icon: '🏋️', text: '锻炼' },
  { key: 'mindset', icon: '🧠', text: '心态' }
]

const activeTab = ref('sleep')

const quotes = [
  { text: '成功的秘诀在于始终如一地坚持目标', author: '迪斯雷利' },
  { text: '每一个不曾起舞的日子，都是对生命的辜负', author: '尼采' },
  { text: '不要等待机会，而要创造机会', author: '林肯' },
  { text: '学习不是为了应付考试，而是为了遇见更好的自己', author: '佚名' },
  { text: '今天的努力是明天的底气', author: '佚名' },
  { text: '星光不问赶路人，时光不负有心人', author: '佚名' }
]

const currentQuote = computed(() => {
  const index = new Date().getDate() % quotes.length
  return quotes[index]
})

function goToHome() {
  uni.navigateTo({ url: '/pages/index/index' })
}

function goToSchedule() {
  uni.navigateTo({ url: '/pages/schedule/schedule' })
}
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 8rpx;
  margin-bottom: 20rpx;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 16rpx;
  border-radius: 12rpx;
  transition: all 0.3s ease;
  
  &.active {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  }
}

.tab-icon {
  font-size: 36rpx;
  margin-bottom: 8rpx;
}

.tab-text {
  font-size: 24rpx;
  color: #666;
  
  .active & {
    color: #ffffff;
  }
}

.advice-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.advice-card {
  display: flex;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.advice-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-right: 20rpx;
  
  &.sleep {
    background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  }
  
  &.diet {
    background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  }
  
  &.exercise {
    background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
  }
  
  &.mindset {
    background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
  }
}

.advice-info {
  flex: 1;
}

.advice-title {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12rpx;
}

.advice-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

.motivation-card {
  margin-top: 32rpx;
  padding: 32rpx;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 20rpx;
  text-align: center;
}

.motivation-quote {
  display: block;
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 500;
  line-height: 1.6;
  margin-bottom: 16rpx;
}

.motivation-author {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
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
