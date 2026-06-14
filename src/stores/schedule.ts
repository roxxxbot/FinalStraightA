import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Exam {
  id: string
  name: string
  date: string
  time: string
}

export interface Course {
  id: string
  name: string
  credits: number
  difficulty: 'easy' | 'medium' | 'hard'
  type: 'memorize' | 'practice'
  examDate: string
}

export interface DailyTask {
  id: string
  courseId: string
  courseName: string
  startTime: string
  endTime: string
  content: string
  duration: number
  completed?: boolean
}

export interface DaySchedule {
  date: string
  tasks: DailyTask[]
}

export const useScheduleStore = defineStore('schedule', () => {
  const currentDate = ref('')
  const exams = ref<Exam[]>([])
  const courses = ref<Course[]>([])
  const dailySchedules = ref<DaySchedule[]>([])

  const studyDays = computed(() => {
    if (!currentDate.value || exams.value.length === 0) return 0
    const start = new Date(currentDate.value)
    const latestExam = exams.value.reduce((latest, exam) => {
      return exam.date > latest.date ? exam : latest
    })
    const end = new Date(latestExam.date)
    const diff = end.getTime() - start.getTime()
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  })

  const totalCredits = computed(() => {
    return courses.value.reduce((sum, course) => sum + course.credits, 0)
  })

  function setCurrentDate(date: string) {
    currentDate.value = date
  }

  function addExam(exam: Omit<Exam, 'id'>) {
    const id = Date.now().toString()
    exams.value.push({ ...exam, id })
  }

  function removeExam(id: string) {
    exams.value = exams.value.filter(e => e.id !== id)
  }

  function addCourse(course: Omit<Course, 'id'>) {
    const id = Date.now().toString()
    courses.value.push({ ...course, id })
  }

  function updateCourse(id: string, updates: Partial<Course>) {
    const index = courses.value.findIndex(c => c.id === id)
    if (index !== -1) {
      courses.value[index] = { ...courses.value[index], ...updates }
    }
  }

  function removeCourse(id: string) {
    courses.value = courses.value.filter(c => c.id !== id)
  }

  function generateDailySchedules() {
    if (!currentDate.value || courses.value.length === 0) {
      uni.showToast({ title: '请先配置考试信息', icon: 'none' })
      return
    }

    dailySchedules.value = []
    const startDate = new Date(currentDate.value)
    
    for (let day = 0; day < studyDays.value; day++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + day)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayTasks = generateDayTasks(dateStr, day, studyDays.value)
      dailySchedules.value.push({ date: dateStr, tasks: dayTasks })
    }
  }

  function generateDayTasks(dateStr: string, dayIndex: number, totalDays: number): DailyTask[] {
    const tasks: DailyTask[] = []
    const todayCourses = courses.value.filter(c => {
      const examDate = new Date(c.examDate)
      const today = new Date(dateStr)
      const daysUntilExam = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntilExam >= 0 && daysUntilExam <= totalDays - dayIndex
    })

    if (todayCourses.length === 0) return tasks

    const timeSlots = [
      { start: '08:00', end: '10:00', duration: 120 },
      { start: '10:30', end: '12:30', duration: 120 },
      { start: '14:00', end: '16:00', duration: 120 },
      { start: '16:30', end: '18:30', duration: 120 },
      { start: '19:30', end: '21:30', duration: 120 },
    ]

    const coursePriority = todayCourses.map(course => {
      const examDate = new Date(course.examDate)
      const today = new Date(dateStr)
      const daysUntilExam = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      const difficultyWeight = course.difficulty === 'hard' ? 1.5 : course.difficulty === 'medium' ? 1.2 : 1.0
      const typeWeight = course.type === 'memorize' ? 1.3 : 1.0
      const timeWeight = daysUntilExam > 0 ? 1 / daysUntilExam : 2.0
      
      return {
        course,
        priority: course.credits * difficultyWeight * typeWeight * timeWeight
      }
    }).sort((a, b) => b.priority - a.priority)

    const totalPriority = coursePriority.reduce((sum, cp) => sum + cp.priority, 0)
    
    let slotIndex = 0
    coursePriority.forEach(cp => {
      const allocationRatio = cp.priority / totalPriority
      const allocatedSlots = Math.max(1, Math.ceil(allocationRatio * timeSlots.length))
      
      for (let i = 0; i < allocatedSlots && slotIndex < timeSlots.length; i++) {
        const slot = timeSlots[slotIndex]
        const taskContent = generateTaskContent(cp.course, dayIndex, totalDays)
        
        tasks.push({
          id: `${dateStr}-${slot.start}-${cp.course.id}`,
          courseId: cp.course.id,
          courseName: cp.course.name,
          startTime: slot.start,
          endTime: slot.end,
          content: taskContent,
          duration: slot.duration
        })
        slotIndex++
      }
    })

    return tasks
  }

  function generateTaskContent(course: Course, dayIndex: number, totalDays: number): string {
    const examDate = new Date(course.examDate)
    const today = new Date()
    const daysUntilExam = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    const progress = Math.round(((totalDays - daysUntilExam + dayIndex) / totalDays) * 100)

    if (course.type === 'memorize') {
      if (progress < 30) {
        return `📚 精读教材第${Math.ceil((dayIndex + 1) * (course.credits * 2) / totalDays)}章，整理笔记`
      } else if (progress < 60) {
        return `📖 背诵重点知识点，完成${course.name}思维导图`
      } else if (progress < 80) {
        return `🧠 默写核心概念，模拟自测`
      } else {
        return `✨ 查漏补缺，回顾易混点`
      }
    } else {
      if (progress < 30) {
        return `📝 完成课后习题第${Math.ceil((dayIndex + 1) * 2)}章`
      } else if (progress < 60) {
        return `💻 刷题练习，整理错题本`
      } else if (progress < 80) {
        return `🎯 真题模拟，限时训练`
      } else {
        return `🔍 错题复盘，总结解题技巧`
      }
    }
  }

  function getTodaySchedule(): DaySchedule | undefined {
    const today = new Date().toISOString().split('T')[0]
    return dailySchedules.value.find(s => s.date === today)
  }

  return {
    currentDate,
    exams,
    courses,
    dailySchedules,
    studyDays,
    totalCredits,
    setCurrentDate,
    addExam,
    removeExam,
    addCourse,
    updateCourse,
    removeCourse,
    generateDailySchedules,
    getTodaySchedule
  }
})
