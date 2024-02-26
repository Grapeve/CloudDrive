<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import dayjs from 'dayjs'
import { useDebounceFn } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { ArrowRight } from '@element-plus/icons-vue'
import { ElMessage, ElNotification } from 'element-plus'
import server from '@/utils/axios'

import FileTable from '@/components/FileTable/index.vue'
import { useFileStore, type folderType } from '@/stores/file'
import { useBreadcrumbStore } from '@/stores/breadcrumb'
import { createFolderApi } from '@/api/fileApi'

const fileStore = useFileStore()
const { fileList } = storeToRefs(fileStore)

const breadcrumbStore = useBreadcrumbStore()
const { breadCrumbs } = storeToRefs(breadcrumbStore)

// 创建文件夹
let createFoldername: string = ''
const createFolderDebounceFn = useDebounceFn(async () => {
  try {
    const { data } = await createFolderApi(createFoldername, -1)
    if (data.success === true) {
      fileList.value.unshift({ ...data.data, type: 'folder' })
      ElMessage({
        type: 'success',
        message: data.msg
      })
    } else {
      ElMessage({
        type: 'error',
        message: data.msg
      })
    }
  } catch (error: any) {
    ElMessage({
      type: 'error',
      message: error.message
    })
  }
  createFoldername = ''
}, 500)
const createFolder = () => {
  const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  createFoldername = '新建文件夹-' + currentTime
  createFolderDebounceFn()
}

// TODO:点击面包屑左边的全部文件文本返回至最外层
const goToAllFile = () => {}
// TODO:点击面包屑返回对应的文件夹列表
const goToThis = (fileId: string) => {}

// 首次加载页面时获取所有文件并存入store中
onBeforeMount(() => {
  // TODO: 调接口获取文件列表
  server
    .post('/folder/getFolder', { folderId: -1 })
    .then((res) => {
      if (res.data.success) {
        fileList.value = [...res.data.data.folders, ...res.data.data.files]
      } else {
        ElNotification({
          title: '获取文件列表失败！',
          message: res.data.msg,
          type: 'error'
        })
      }
    })
    .catch((error) => {
      // 处理错误
      console.error('发生错误:', error)
    })
})
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
    <div>
      <div v-if="breadCrumbs.length === 0" class="file-list-breadcrumb">
        <span>全部文件</span>
        <span style="margin: 1px 0 0 5px">{{ fileList.length }}</span>
      </div>
      <div v-else class="file-list-breadcrumb">
        <span class="all-files" @click="goToAllFile">全部文件</span>
        <el-breadcrumb :separator-icon="ArrowRight" class="breadcrumb-container">
          <el-breadcrumb-item v-for="(breadCrumb, index) in breadCrumbs" :key="index">
            <a class="breadcrumb-item-a" @click="goToThis(breadCrumb.id)" href="#/all">{{
              breadCrumb.name
            }}</a>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
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
    display: flex;
    align-items: center;
  }
  .all-files {
    &:hover {
      color: #0d53ff;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
    }
  }
  .breadcrumb-container {
    display: inline-block;
    padding: 2px 0 0 10px;
  }
  .breadcrumb-item-a {
    &:hover {
      color: #0d53ff;
    }
  }
}
</style>
@/api/fileApi
