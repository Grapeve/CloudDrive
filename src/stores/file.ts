import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useFileStore = defineStore('file', () => {
  const fileList = ref([
    {
      fileName: '精选壁纸',
      fileSize: '-',
      fileChangeDate: '2024-02-09 00:00:00',
      type: 'folder'
    },
    {
      fileName: '需求说明书.docx',
      fileSize: '12KB',
      fileChangeDate: '2024-02-09 1:00:00',
      type: 'docx'
    }
  ])

  return { fileList }
})
