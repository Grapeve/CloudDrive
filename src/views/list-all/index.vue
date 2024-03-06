<script setup lang="ts">
import { ref, onBeforeMount, onMounted } from 'vue'
import dayjs from 'dayjs'
import { useDebounceFn } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { ArrowRight } from '@element-plus/icons-vue'
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'
import server from '@/utils/axios'

import FileTable from '@/components/FileTable/index.vue'
import { useFileStore, type folderType } from '@/stores/file'
import { useBreadcrumbStore } from '@/stores/breadcrumb'
import { createFolderApi, getFolderApi, deleteFolderApi, deleteFileApi } from '@/api/fileApi'
import UploadButton from '@/components/UploadButton/index.vue'

const fileStore = useFileStore()
const { fileList, multipleSelection } = storeToRefs(fileStore)

const breadcrumbStore = useBreadcrumbStore()
const { breadCrumbs } = storeToRefs(breadcrumbStore)

// 文件列表子组件实例
interface FileTableRef {
  fileRenameFn: (index: number) => void
  clearMultipleSelection: () => void
}

const fileTableRef = ref<FileTableRef | null>(null)

// 创建文件夹
let createFoldername: string = ''
const createFolderDebounceFn = useDebounceFn(async () => {
  try {
    let parentId = -1
    if (breadCrumbs.value.length > 0) {
      parentId = Number(breadCrumbs.value[breadCrumbs.value.length - 1].id)
    }
    const { data } = await createFolderApi(createFoldername, parentId)
    if (data.success === true) {
      fileList.value.unshift({ ...data.data, type: 'folder' })
      fileTableRef.value!.fileRenameFn(0)
      ElMessage({
        type: 'success',
        message: '创建文件夹成功'
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

// 批量删除文件夹
const multipleSelectionDelete = () => {
  ElMessageBox.confirm('文件删除后将保存在回收站，您确定这样做吗？', '删除文件', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      let folderIds: number[] = []
      let fileIds: number[] = []
      multipleSelection.value.forEach((item) => {
        if (item.type === 'folder') {
          folderIds.push(item.id)
        } else {
          fileIds.push(item.id)
        }
      })
      if (folderIds.length > 0) {
        const { data } = await deleteFolderApi(folderIds, 0)
        if (data.success === true) {
          ElMessage({
            type: 'success',
            message: '文件夹删除成功'
          })
        } else {
          ElMessage({
            type: 'error',
            message: data.msg
          })
        }
      }
      if (fileIds.length > 0) {
        const { data } = await deleteFileApi(fileIds, 0)
        if (data.success === true) {
          ElMessage({
            type: 'success',
            message: '文件删除成功'
          })
        } else {
          ElMessage({
            type: 'error',
            message: data.msg
          })
        }
      }
      multipleSelection.value = new Array()
      fileTableRef?.value?.clearMultipleSelection()
      const { data } = await getFolderApi(-1, '')
      fileList.value = [...data.data.folders, ...data.data.files]
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除取消'
      })
    })
}

// 点击面包屑左边的全部文件文本返回至最外层
const goToAllFile = async () => {
  const { data } = await getFolderApi(-1, '')
  if (data.success === true) {
    fileList.value = [...data.data.folders, ...data.data.files]
    breadcrumbStore.clearBreadcrumb()
  } else {
    ElMessage({
      type: 'error',
      message: data.msg
    })
  }
}
// 点击面包屑返回对应的文件夹列表
const goToThis = async (fileId: string) => {
  if (breadCrumbs.value[breadCrumbs.value.length - 1].id !== fileId) {
    const { data } = await getFolderApi(Number(fileId), '')
    if (data.success === true) {
      fileList.value = [...data.data.folders, ...data.data.files]
      breadcrumbStore.deleteBreadcrumb(fileId)
    } else {
      ElMessage({
        type: 'error',
        message: data.msg
      })
    }
  }
}

// 首次加载页面时获取所有文件并存入store中
onMounted(() => {
  // 调接口获取文件列表
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
    <!-- <el-button type="primary" color="#0d53ff" class="btn-custom">
      <div style="display: flex; align-items: center; font-weight: 700">
        <el-icon size="14"><Plus /></el-icon>
        <span>上传文件</span>
      </div>
    </el-button> -->
    <UploadButton style="margin-right: 15px" />
    <el-button type="primary" color="#ffffff" class="btn-custom btn-folder" @click="createFolder">
      <div style="display: flex; align-items: center; font-weight: 700">
        <el-icon size="14"><Folder /></el-icon>
        <span>新建文件夹</span>
      </div>
    </el-button>
    <!-- 多选操作 -->
    <div class="multiple-selection-area" v-if="multipleSelection.length > 0">
      <!-- <el-button type="primary" color="#ffffff" class="btn-custom btn-folder">
        <div style="display: flex; align-items: center; font-weight: 700">
          <span>下载</span>
        </div>
      </el-button> -->
      <!-- <el-button type="primary" color="#ffffff" class="btn-custom btn-folder">
        <div style="display: flex; align-items: center; font-weight: 700">
          <span>分享</span>
        </div>
      </el-button> -->
      <el-button
        type="primary"
        color="#ffffff"
        class="btn-custom btn-folder"
        v-if="multipleSelection.length === 1"
      >
        <div style="display: flex; align-items: center; font-weight: 700">
          <span>重命名</span>
        </div>
      </el-button>
      <el-button
        type="primary"
        color="#ffffff"
        class="btn-custom btn-folder"
        @click="multipleSelectionDelete"
      >
        <div style="display: flex; align-items: center; font-weight: 700">
          <span>删除</span>
        </div>
      </el-button>
      <!-- <el-button type="primary" color="#ffffff" class="btn-custom btn-folder">
        <div style="display: flex; align-items: center; font-weight: 700">
          <span>移动到</span>
        </div>
      </el-button> -->
    </div>
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
    <FileTable ref="fileTableRef" />
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

  .multiple-selection-area {
    margin-left: auto;
    margin-right: 50px;
    :deep(.el-button) {
      margin-left: 10px;
    }
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
