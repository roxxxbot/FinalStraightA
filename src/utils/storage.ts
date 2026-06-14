export function saveToStorage(key: string, data: any): void {
  try {
    uni.setStorageSync(key, JSON.stringify(data))
  } catch (e) {
    console.error('保存数据失败:', e)
  }
}

export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const data = uni.getStorageSync(key)
    if (data) {
      return JSON.parse(data) as T
    }
  } catch (e) {
    console.error('读取数据失败:', e)
  }
  return defaultValue
}

export function removeFromStorage(key: string): void {
  try {
    uni.removeStorageSync(key)
  } catch (e) {
    console.error('删除数据失败:', e)
  }
}

export function clearAllStorage(): void {
  try {
    uni.clearStorageSync()
  } catch (e) {
    console.error('清空数据失败:', e)
  }
}
