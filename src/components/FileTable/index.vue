<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'
import { useDebounceFn } from '@vueuse/core'
import { useFileStore } from '@/stores/file'
import { useBreadcrumbStore } from '@/stores/breadcrumb'
import { ElMessage, ElMessageBox } from 'element-plus'

import { renameFileApi, renameFolderApi, getFolderApi } from '@/api/fileApi'

const fileStore = useFileStore()
const breadcrumbStore = useBreadcrumbStore()

const tableHeight = ref(window.innerHeight - 200)
const { fileList } = storeToRefs(fileStore)

// 进入文件夹
const goToFolder = async (file: any) => {
  if (file.type === 'folder') {
    const { data } = await getFolderApi(file.id, '')
    if (data.success === true) {
      // 面包屑导航存入store
      breadcrumbStore.addBreadcrumb({
        id: file.id,
        name: file.name
      })
      fileList.value = [...data.data.folders]
    } else {
      ElMessage({
        type: 'error',
        message: data.msg
      })
    }
  }
}

// 多选
const fileMultipleSelection = ref<any[]>([])
const handleSelectionChange = (val: any) => {
  fileMultipleSelection.value = val
  console.log(fileMultipleSelection.value)
}

// 文件重命名
let fileRenameName = ref<string>('')
let renameNo = ref<number | null>(null)
const fileRenameFn = (index: number) => {
  fileRenameName.value = fileList.value[index].name
  renameNo.value = index
}
const renameFolderNameFn = async () => {
  try {
    if (fileList.value[renameNo.value!].type === 'folder') {
      const { data } = await renameFolderApi(
        fileList.value[renameNo.value!].id,
        fileRenameName.value
      )
      if (data.success === true) {
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
    } else {
      const { data } = await renameFileApi(fileList.value[renameNo.value!].id, fileRenameName.value)
      if (data.success === true) {
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
    }
  } catch (error) {
    console.log(error)
  }

  fileList.value[renameNo.value!].name = fileRenameName.value
  fileRenameName.value = ''
  renameNo.value = null
}

// 文件删除
const fileDelete = (index: number) => {
  ElMessageBox.confirm('文件删除后将保存在回收站，您确定这样做吗？', '删除文件', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      fileStore.fileDelete(index)
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除取消'
      })
    })
}

// 鼠标悬浮至文件时展示文件相关操作
const showOperation = (row: any, column: any, cell: HTMLElement, event: any) => {
  let parentDiv = cell.firstElementChild as HTMLElement
  if (parentDiv) {
    let btnsDiv = parentDiv?.lastElementChild as HTMLElement
    btnsDiv.style.display = 'inline-block'
  }
}
// 鼠标移出文件时隐藏文件相关操作
const hiddenOperation = (row: any, column: any, cell: HTMLElement, event: any) => {
  let parentDiv = cell.firstElementChild as HTMLElement
  if (parentDiv) {
    let btnsDiv = parentDiv?.lastElementChild as HTMLElement
    btnsDiv.style.display = 'none'
  }
}
</script>

<template>
  <!-- 文件列表 -->
  <el-table
    :data="fileList"
    ref="fileTableRef"
    style="width: 100%"
    :height="tableHeight"
    @cell-mouse-enter="showOperation"
    @cell-mouse-leave="hiddenOperation"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="35" />
    <el-table-column prop="name" label="文件名" min-width="780">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <img
            src="/src/assets/imgs/folder.png"
            width="32"
            height="32"
            v-if="scope.row.type === 'folder'"
          />
          <img
            src="/src/assets/imgs/docx.png"
            width="32"
            height="32"
            v-else-if="scope.row.type === 'docx'"
          />
          <img :src="scope.row.url" width="32" height="32" v-else-if="scope.row.type === 'img'" />
          <img
            src="/src/assets/imgs/music.png"
            width="32"
            height="32"
            v-else-if="scope.row.type === 'music'"
          />
          <div style="margin-left: 10px; cursor: pointer">
            <span v-if="scope.$index !== renameNo" @click="goToFolder(scope.row)"
              >{{ scope.row.name }}
            </span>
            <el-input
              v-else
              v-model="fileRenameName"
              @blur="renameFolderNameFn"
              @keyup.enter.native="$event.target.blur()"
            ></el-input>
          </div>
        </div>
        <div class="file-operation-content">
          <el-tooltip content="下载" placement="top" effect="light">
            <el-button circle color="#0d53ff">
              <el-icon :size="18"><Download /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="重命名" placement="top" effect="light">
            <el-button circle color="#bb0fff" @click="fileRenameFn(scope.$index)">
              <el-icon :size="18"><EditPen /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="分享" placement="top" effect="light">
            <el-button circle color="#ff0fcb">
              <el-icon :size="18"><Share /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="移动" placement="top" effect="light">
            <el-button circle color="#ff0f53">
              <el-icon :size="18"><Promotion /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top" effect="light">
            <el-button circle color="#ff430f" @click="fileDelete(scope.$index)">
              <el-icon :size="18"><Delete /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="size" label="大小" min-width="180">
      <template #default="scope">
        <span v-if="scope.row.type === 'folder'">-</span>
        <!-- TODO:文件大小输出格式化 -->
        <span v-else>{{ scope.row.size }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="update_time" label="修改日期" min-width="200" />
  </el-table>
</template>

<style lang="less" scoped>
.file-operation-content {
  display: none;
  position: absolute;
  right: 35px;
  top: 8px;
}
:deep(.el-input > .is-focus) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}
:deep(.el-table__row > .el-checkbox) {
  display: inline-block !important;
}
</style>
@/api/fileApi
