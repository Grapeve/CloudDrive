<script setup lang="ts">
import { ref, onBeforeMount, provide } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'

// import SortTable from '@/components/SortTable/index.vue'
import FileTable from '@/components/FileTable/index.vue'
import { useFileStore, type folderType } from '@/stores/file'
import UploadButton from '@/components/UploadButton/index.vue'
import { deleteFileApi, getRecentFilesApi, searchFilesByMimeTypeApi } from '@/api/fileApi'

const tableHeight = ref(window.innerHeight * 0.798)

const fileStore = useFileStore()
const { fileList, multipleSelection } = storeToRefs(fileStore)

// 文件列表子组件实例
interface FileTableRef {
  fileRenameFn: (index: number) => void
  clearMultipleSelection: () => void
}

const fileTableRef = ref<FileTableRef | null>(null)
// const fileList = ref([{}])
provide('fileList', fileList)

// 批量删除文件
const multipleSelectionDelete = () => {
  ElMessageBox.confirm('文件删除后将保存在回收站，您确定这样做吗？', '删除文件', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      let fileIds: number[] = []
      multipleSelection.value.forEach((item) => {
        fileIds.push(item.id)
      })
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
      const { data } = await getRecentFilesApi()
      fileList.value = data.data.files
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除取消'
      })
    })
}

// 首次加载页面时获取所有文件并存入store中
onBeforeMount(async () => {
  // 调接口获取文件列表
  const { data } = await getRecentFilesApi()
  fileList.value = data.data
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
    <!-- 多选操作 -->
    <div class="multiple-selection-area" v-if="multipleSelection.length > 0">
      <el-button type="primary" color="#ffffff" class="btn-custom btn-folder">
        <div style="display: flex; align-items: center; font-weight: 700">
          <span>下载</span>
        </div>
      </el-button>
      <el-button type="primary" color="#ffffff" class="btn-custom btn-folder">
        <div style="display: flex; align-items: center; font-weight: 700">
          <span>分享</span>
        </div>
      </el-button>
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
      <el-button type="primary" color="#ffffff" class="btn-custom btn-folder">
        <div style="display: flex; align-items: center; font-weight: 700">
          <span>移动到</span>
        </div>
      </el-button>
    </div>
  </div>
  <div class="file-list">
    <!-- 文件列表 -->
    <!-- <SortTable ref="fileTableRef" /> -->
    <FileTable ref="fileTableRef" :table-height="tableHeight" />
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

    :deep(.el-button) {
      margin-left: 0;
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
