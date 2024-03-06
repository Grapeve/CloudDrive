import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUploadTaskStore = defineStore('uploadTask', () => {
  // 上传文件的任务队列
  const uploadTask = ref<any[]>([])
  const viewFlag = ref(false)

  return { uploadTask, viewFlag }
})
