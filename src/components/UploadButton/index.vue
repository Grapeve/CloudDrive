<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useFileStore } from '@/stores/file'
import { useBreadcrumbStore } from '@/stores/breadcrumb'
import { useUploadTaskStore } from '@/stores/uploadTask'
import {
  singleUploadFileApi,
  addFileDataToDBApi,
  getFolderApi,
  uploadFolderApi,
  initiateMultipartUploadApi,
  uploadPart,
  completeMultipartUploadApi
} from '@/api/fileApi'
import { ElMessage } from 'element-plus'

const breadcrumbStore = useBreadcrumbStore()
const { breadCrumbs } = storeToRefs(breadcrumbStore)

const fileStore = useFileStore()
const { fileList } = storeToRefs(fileStore)

const uploadTaskStore = useUploadTaskStore()
const { uploadTask, viewFlag } = storeToRefs(uploadTaskStore)

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
  // console.log(uploadFileList.value[0])
  ElMessage({
    type: 'success',
    message: '上传文件中，请稍等！'
  })
  const { data } = await initiateMultipartUploadApi(uploadFileList.value[0].name)
  let parentId = -1 // 父文件夹
  if (breadCrumbs.value.length > 0) {
    parentId = Number(breadCrumbs.value[breadCrumbs.value.length - 1].id)
  }
  if (data.success === true) {
    viewFlag.value = true
    uploadTask.value.push(data.data)
    uploadTask.value[0].uploadFileDTO = {
      folderId: parentId,
      filename: uploadFileList.value[0].name,
      size: uploadFileList.value[0].size,
      mimeType: uploadFileList.value[0].type,
      objectKey: data.data.key,
      status: 1
    }
    uploadTask.value[0].size = uploadFileList.value[0].size
    uploadTask.value[0].process = 0
    uploadTask.value[0].statu = 1
  }
  const chunks = createFileChunk(uploadFileList.value)
  uploadSliceFile(chunks!, parentId)
  uploadFileList.value = new Array()
  // 拿到了文件对象存储到uploadFileList中
  // const uploadFormData = new FormData()
  // uploadFileList.value.forEach((file) => {
  //   uploadFormData.append('file', file)
  // })
  // ElMessage({
  //   type: 'success',
  //   message: '上传中，请稍等！'
  // })

  // const { data } = await singleUploadFileApi(uploadFormData)
  // if (data.success === true) {
  //   const fileData = data.data
  //   let parentId = -1
  //   if (breadCrumbs.value.length > 0) {
  //     parentId = Number(breadCrumbs.value[breadCrumbs.value.length - 1].id)
  //   }
  //   fileData.folderId = parentId
  //   const res = await addFileDataToDBApi(fileData) // 将文件数据插入数据库
  //   if (res.data.success === true) {
  //     const res = await getFolderApi(parentId)
  //     fileList.value = [...res.data.data.folders, ...res.data.data.files]
  //     ElMessage({
  //       type: 'success',
  //       message: '上传成功！'
  //     })
  //   } else {
  //     ElMessage({
  //       type: 'error',
  //       message: res.data.msg
  //     })
  //   }
  // }
}

// 将文件转变为切片
const createFileChunk = (files: File[]) => {
  if (!files.length) return
  const SIZE = 2 * 1024 * 1024 // 2M 切片大小
  const fileChunks: Blob[] = []
  files.forEach((file) => {
    let curSize = 0
    let index = 0
    const fileSize = file.size
    while (curSize < fileSize) {
      let end = curSize + SIZE <= fileSize ? curSize + SIZE : fileSize
      index++
      fileChunks.push(file.slice(curSize, end))
      curSize += SIZE
    }
  })
  return fileChunks
}
// 切片上传
const uploadSliceFile = (fileChunks: Blob[], parentId: number) => {
  if (!fileChunks.length) return
  const uploadFileQuene: any[] = []
  fileChunks.forEach(async (chunk, index) => {
    const chunksName = uploadFileList.value[0].name + '_' + index
    const formData = new FormData()
    formData.append('file', chunk)
    uploadFileQuene.push(
      uploadPart(uploadTask.value[0].key, uploadTask.value[0].upload, index + 1, formData)
    )
    Promise.all(uploadFileQuene).then(async (res) => {
      if (res.length === fileChunks.length) {
        const partETagDTOs: any[] = res.map((item) => {
          return {
            partNumber: item.data.data.partNumber,
            tag: item.data.data.etag
          }
        })
        const { data } = await completeMultipartUploadApi(
          uploadTask.value[0].key,
          uploadTask.value[0].upload,
          partETagDTOs,
          uploadTask.value[0].uploadFileDTO
        )
        if (data.success === true) {
          viewFlag.value = false
          uploadTask.value[0].process = 1
          ElMessage({
            type: 'success',
            message: '上传成功！'
          })
          uploadTask.value = new Array()
          const { data } = await getFolderApi(parentId)
          fileList.value = [...data.data.folders, ...data.data.files]
        } else {
          uploadTask.value[0].statu = 0
          ElMessage({
            type: 'success',
            message: data.msg
          })
        }
      } else {
        let uploadSize = 0
        res.forEach((response) => {
          uploadSize += fileChunks[response.data.data.partNumber - 1].size
        })
        uploadTask.value[0].process = uploadSize / uploadTask.value[0].size
      }
    })
  })
}

// 上传文件夹
const uploadFolderRef = ref()
const uploadFolder = () => {
  uploadFolderRef.value.click()
}
const selectFolder = async (event: any) => {
  const files = event.target.files
  const formData = new FormData()
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i])
  }
  let parentId = -1
  if (breadCrumbs.value.length > 0) {
    parentId = Number(breadCrumbs.value[breadCrumbs.value.length - 1].id)
  }
  ElMessage({
    type: 'success',
    message: '上传文件夹中，请稍等！'
  })
  const { data } = await uploadFolderApi(parentId, formData)
  if (data.success === true) {
    ElMessage({
      type: 'success',
      message: '上传成功！'
    })
    const res = await getFolderApi(parentId)
    fileList.value = [...res.data.data.folders, ...res.data.data.files]
  } else {
    ElMessage({
      type: 'error',
      message: data.msg
    })
  }
}

// 上传Dialog
const uploadDialogVisible = ref(false)
</script>

<template>
  <div class="upload-area">
    <el-dropdown :visible-arrow="false">
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
      <template #dropdown>
        <el-dropdown-menu style="width: 110px">
          <el-dropdown-item @click="uploadDialogVisible = true">文件</el-dropdown-item>
          <el-dropdown-item>
            <span @click="uploadFolder">文件夹</span>
            <input
              type="file"
              style="display: none"
              ref="uploadFolderRef"
              webkitdirectory
              :onchange="selectFolder"
            />
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
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
        <div class="el-upload__text">将文件拖拽至此处，或<em>点击上传</em>，只能上传单个文件</div>
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
.upload-area {
  :deep(.el-popper > .el-popper__arrow) {
    display: none !important;
  }
}
.btn-custom {
  height: 36px;
  line-height: 36px;
  border-radius: 8px;
}
</style>
