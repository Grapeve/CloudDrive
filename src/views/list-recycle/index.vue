<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'

import FileTable from '@/components/FileTable/index.vue'
import { useFileStore } from '@/stores/file'
import {
  deleteFileApi,
  deleteFolderApi,
  getRecycleBinApi,
  retrieveFileApi,
  retrieveFolderApi
} from '@/api/fileApi'

const tableHeight = ref(window.innerHeight * 0.798)

const fileStore = useFileStore()
const { fileList, multipleSelection } = storeToRefs(fileStore)

// 文件列表子组件实例
interface FileTableRef {
  clearMultipleSelection: () => void
}
const fileTableRef = ref<FileTableRef | null>(null)

// 批量还原
const recycleSelectedFile = async () => {
  if (multipleSelection.value.length > 0) {
    const fileIdList: number[] = []
    const folderIdList: number[] = []
    multipleSelection.value.forEach((item) => {
      if (item.type === 'folder') {
        folderIdList.push(item.id)
      } else {
        fileIdList.push(item.id)
      }
    })
    if (fileIdList.length > 0) {
      const { data } = await retrieveFileApi(fileIdList)
      if (data.success === true) {
        ElMessage({
          type: 'success',
          message: '文件还原成功！'
        })
      } else {
        ElMessage({
          type: 'error',
          message: data.msg
        })
      }
    }
    if (folderIdList.length > 0) {
      const { data } = await retrieveFolderApi(folderIdList)
      if (data.success === true) {
        ElMessage({
          type: 'success',
          message: '文件夹还原成功！'
        })
      } else {
        ElMessage({
          type: 'error',
          message: data.msg
        })
      }
    }
    multipleSelection.value = new Array()
    fileTableRef.value?.clearMultipleSelection()
    const { data } = await getRecycleBinApi()
    fileList.value = [...data.data.files, ...data.data.folders]
  } else {
    ElMessage({
      type: 'warning',
      message: '请选择要还原的文件或文件夹'
    })
  }
}

// 批量彻底删除
const completeDeleteSelectedFile = () => {
  if (multipleSelection.value.length > 0) {
    ElMessageBox.confirm('文件彻底删除后将不可恢复，您确定这样做吗？', '删除文件', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const fileIdList: number[] = []
      const folderIdList: number[] = []
      multipleSelection.value.forEach((item) => {
        if (item.type === 'folder') {
          folderIdList.push(item.id)
        } else {
          fileIdList.push(item.id)
        }
      })
      if (fileIdList.length > 0) {
        const { data } = await deleteFileApi(fileIdList, 2)
        if (data.success === true) {
          ElMessage({
            type: 'success',
            message: '文件彻底删除成功！'
          })
        } else {
          ElMessage({
            type: 'error',
            message: data.msg
          })
        }
      }
      if (folderIdList.length > 0) {
        const { data } = await deleteFolderApi(folderIdList, 2)
        if (data.success === true) {
          ElMessage({
            type: 'success',
            message: '文件夹彻底删除成功！'
          })
        } else {
          ElMessage({
            type: 'error',
            message: data.msg
          })
        }
      }
      multipleSelection.value = new Array()
      fileTableRef.value?.clearMultipleSelection()
      const { data } = await getRecycleBinApi()
      fileList.value = [...data.data.files, ...data.data.folders]
    })
  } else {
    ElMessage({
      type: 'warning',
      message: '请选择要彻底删除的文件或文件夹'
    })
  }
}

onMounted(async () => {
  const { data } = await getRecycleBinApi()
  fileList.value = [...data.data.files, ...data.data.folders]
})
</script>

<template>
  <div class="btns-file">
    <el-button type="success" class="btn-custom">
      <div
        style="display: flex; align-items: center; font-weight: 700"
        @click="recycleSelectedFile"
      >
        <el-icon size="14"><RefreshLeft /></el-icon>
        <span>还原</span>
      </div>
    </el-button>
    <el-button
      type="danger"
      color="#ef4343"
      class="btn-custom btn-delete"
      @click="completeDeleteSelectedFile"
    >
      <div style="display: flex; align-items: center; font-weight: 700">
        <el-icon size="14"><Delete /></el-icon>
        <span>批量删除</span>
      </div>
    </el-button>
  </div>
  <!-- 文件列表 -->
  <FileTable ref="fileTableRef" show-type="recycle" :table-height="tableHeight" />
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
  .btn-delete {
    margin-left: 10px;
    border: 1px solid #ddd;
  }
  .multiple-selection-area {
    margin: 0 22px 0 auto;
    :deep(.el-button) {
      margin-left: 0;
    }
  }
}
</style>
