<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import { useDebounceFn } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useFileStore } from '@/stores/file'

import FileTable from '@/components/FileTable/index.vue'

const fileStore = useFileStore()
const { fileList } = storeToRefs(fileStore)

// 创建文件夹
let folderInfo = {} as any
const createFolderDebounceFn = useDebounceFn(() => {
  fileList.value.unshift(folderInfo)
  folderInfo = {}
}, 500)
const createFolder = () => {
  const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  folderInfo = {
    fileName: '精选壁纸-' + currentTime,
    fileSize: '-',
    fileChangeDate: currentTime,
    type: 'folder'
  }
  createFolderDebounceFn()
}
</script>

<template>
  <div class="btns-file">
    <el-button type="primary" color="#0d53ff" class="btn-custom">
      <div style="display: flex; align-items: center; font-weight: 700">
        <el-icon size="14"><Plus /></el-icon>
        <span>上传文件</span>
      </div>
    </el-button>
    <el-button type="primary" color="#ffffff" class="btn-custom btn-folder" @click="createFolder">
      <div style="display: flex; align-items: center; font-weight: 700">
        <el-icon size="14"><Folder /></el-icon>
        <span>新建文件夹</span>
      </div>
    </el-button>
  </div>
  <div class="file-list">
    <!-- TODO:文件导航面包屑 -->
    <div class="file-list-breadcrumb">
      <span>全部文件 </span>
      <span>{{ fileList.length }}</span>
    </div>
    <!-- 文件列表 -->
    <FileTable />
  </div>
</template>

<style lang="less" scoped>
.btns-file {
  margin: 0 0 0 18px;
  padding: 12px 0 20px 0;
  display: flex;
  border-bottom: 1px solid #f6f6f6;
  .btn-custom {
    height: 36px;
    line-height: 36px;
    border-radius: 8px;
  }
  .btn-folder {
    color: #52565e;
    border: 1px solid #ddd;
  }
}

.file-list {
  margin-left: 18px;
  .file-list-breadcrumb {
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    color: #999;
    font-weight: 700;
  }
}
</style>
