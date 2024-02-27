<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useBreadcrumbStore } from '@/stores/breadcrumb'
import { singleUploadFileApi, addFileDataToDBApi } from '@/api/fileApi'

const breadcrumbStore = useBreadcrumbStore()
const { breadCrumbs } = storeToRefs(breadcrumbStore)

const uploadRef = ref()
const uploadFileList = ref<any[]>([])

// 文件上传相关操作
const handleUpload = (file: File) => {
  uploadFileList.value.push(file)
  return false // 阻止自动上传
}
const uploadFile = async () => {
  uploadDialogVisible.value = false
  uploadRef.value!.submit()
  // 拿到了文件对象存储到uploadFileList中
  const uploadFormData = new FormData()
  uploadFileList.value.forEach((file) => {
    uploadFormData.append('file', file)
  })
  const { data } = await singleUploadFileApi(uploadFormData)
  if (data.success === true) {
    const fileData = data.data
    let parentId = -1
    if (breadCrumbs.value.length > 0) {
      parentId = Number(breadCrumbs.value[breadCrumbs.value.length - 1].id)
    }
    fileData.folderId = parentId
    const res = await addFileDataToDBApi(fileData)
  }
}

// 上传Dialog
const uploadDialogVisible = ref(false)
</script>

<template>
  <div class="upload-area">
    <el-button
      type="primary"
      color="#0d53ff"
      class="btn-custom"
      @click="uploadDialogVisible = true"
    >
      <div style="display: flex; align-items: center; font-weight: 700">
        <el-icon size="14"><Plus /></el-icon>
        <span>上传文件</span>
      </div>
    </el-button>
    <!-- 上传文件Dialog -->
    <el-dialog title="上传文件" v-model="uploadDialogVisible" width="650">
      <el-upload
        ref="uploadRef"
        action="#"
        :auto-upload="false"
        :before-upload="handleUpload"
        multiple
        drag
        :limit="1"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖拽至此处，或<em>点击上传</em></div>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="uploadDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="uploadFile">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.btn-custom {
  height: 36px;
  line-height: 36px;
  border-radius: 8px;
}
</style>
