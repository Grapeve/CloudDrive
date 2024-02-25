import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface folderType {
  id: number
  parent_id: number
  name: string
  size: string
  type: string
  create_time: string
  updata_time: string
}

export interface fileType {
  id: number
  parent_id: number
  name: string
  size: string
  type: string
  mime_type: string
  create_time: string
  updata_time: string
  object_key: string
  url: string
}

export const useFileStore = defineStore('file', () => {
  const fileList = ref<(folderType | fileType)[]>([
    // {
    //   id: 1,
    //   name: '精选壁纸',
    //   parent_id: -1,
    //   size: '-',
    //   type: 'folder',
    //   create_time: '2024-02-09 00:00:00',
    //   updata_time: '2024-02-09 00:00:00'
    // },
  ])

  function fileDelete(index: number) {
    fileList.value.splice(index, 1)
  }

  return { fileList, fileDelete }
})
