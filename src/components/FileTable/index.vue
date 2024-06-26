<script setup lang="ts">
import { ref, getCurrentInstance, watch, inject, type PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { useFileStore } from '@/stores/file'
import { useBreadcrumbStore } from '@/stores/breadcrumb'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

import {
  renameFileApi,
  renameFolderApi,
  getFolderApi,
  deleteFolderApi,
  deleteFileApi,
  getFolderTreeApi,
  moveFolderApi,
  retrieveFileApi,
  retrieveFolderApi
} from '@/api/fileApi'
import { getSharedFolderApi } from '@/api/shareApi'
import { convertSize } from '@/utils/index'
import server from '@/utils/axios'
import { downloadFile, saveToMine, downloadSharedFile } from '@/utils/fileOperation'

const fileStore = useFileStore()
const breadcrumbStore = useBreadcrumbStore()
const baseFront = inject('baseFront')

// const tableHeight = ref(window.innerHeight - 200)
const { fileList, multipleSelection } = storeToRefs(fileStore)

interface ShareInfo {
  shareUrl: string
  code: string
}

const props = defineProps({
  showType: {
    type: String,
    required: false,
    default: 'common'
  },
  tableHeight: {
    type: Number,
    required: false,
    default: window.innerHeight * 0.71
  },
  showInfo: {
    type: Object as PropType<ShareInfo>,
    required: false
  }
})

const preViewVis = ref(false)
const preViewUrl = ref('')
const preViewType = ref('')
// 进入文件夹
const goToFolder = async (file: any) => {
  // 分享页面浏览文件夹
  if (props.showType === 'share') {
    if (file.type === 'folder') {
      const { data } = await getSharedFolderApi(file.id)
      if (data.success === true) {
        breadcrumbStore.addBreadcrumb({
          id: file.id,
          name: file.name
        })
        fileList.value = [...data.data.folders, ...data.data.files]
      }
      return
    }
  }
  if (file.type === 'folder') {
    const { data } = await getFolderApi(file.id, '')
    if (data.success === true) {
      // 面包屑导航存入store
      breadcrumbStore.addBreadcrumb({
        id: file.id,
        name: file.name
      })
      fileList.value = [...data.data.folders, ...data.data.files]
    } else {
      ElMessage({
        type: 'error',
        message: data.msg
      })
    }
  } else if (file.mime_type?.includes('image')) {
    preViewUrl.value = file.url
    preViewType.value = 'image'
    preViewVis.value = true
  } else if (file.mime_type?.includes('video')) {
    preViewUrl.value = file.url
    preViewType.value = 'video'
    preViewVis.value = true
  } else if (file.mime_type?.includes('audio')) {
    preViewUrl.value = file.url
    preViewType.value = 'audio'
    preViewVis.value = true
  }
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
let deleteFoloderIds: number[] = []
const fileDelete = (index: number) => {
  ElMessageBox.confirm('文件删除后将保存在回收站，您确定这样做吗？', '删除文件', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      if (fileList.value[index].type === 'folder') {
        // 删除文件夹进入回收站
        try {
          deleteFoloderIds.push(fileList.value[index].id)
          const { data } = await deleteFolderApi(deleteFoloderIds, 0)
          if (data.success === true) {
            fileStore.fileDelete(index)
            deleteFoloderIds = []
            ElMessage({
              type: 'success',
              message: '删除成功'
            })
          } else {
            deleteFoloderIds = []
            ElMessage({
              type: 'error',
              message: data.msg
            })
          }
        } catch (error: any) {
          deleteFoloderIds = []
          ElMessage({
            type: 'error',
            message: error.message
          })
        }
      } else {
        // 删除文件进入回收站
        try {
          deleteFoloderIds.push(fileList.value[index].id)
          const { data } = await deleteFileApi(deleteFoloderIds, 0)
          if (data.success === true) {
            fileStore.fileDelete(index)
            deleteFoloderIds = []
            ElMessage({
              type: 'success',
              message: '删除成功'
            })
          } else {
            deleteFoloderIds = []
            ElMessage({
              type: 'error',
              message: data.msg
            })
          }
        } catch (error: any) {
          deleteFoloderIds = []
          ElMessage({
            type: 'error',
            message: error.message
          })
        }
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除取消'
      })
    })
}

// 文件还原
const recycleFile = async (index: number) => {
  if (fileList.value[index].type === 'folder') {
    const { data } = await retrieveFolderApi([fileList.value[index].id])
    if (data.success === true) {
      fileStore.fileDelete(index)
      ElMessage({
        type: 'success',
        message: '文件夹还原成功！'
      })
    } else {
      ElMessage({
        type: 'error',
        message: '文件夹还原失败！'
      })
    }
  } else {
    const { data } = await retrieveFileApi([fileList.value[index].id])
    if (data.success === true) {
      fileStore.fileDelete(index)
      ElMessage({
        type: 'success',
        message: '文件还原成功！'
      })
    } else {
      ElMessage({
        type: 'error',
        message: '文件还原失败！'
      })
    }
  }
}

// 文件彻底删除
const completeDeleteFile = (index: number) => {
  ElMessageBox.confirm('文件删除后将不可恢复，您确定这样做吗？', '删除文件', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    if (fileList.value[index].type === 'folder') {
      const { data } = await deleteFolderApi([fileList.value[index].id], 2)
      if (data.success === true) {
        fileStore.fileDelete(index)
        ElMessage({
          type: 'success',
          message: '文件夹彻底删除成功！'
        })
      } else {
        ElMessage({
          type: 'error',
          message: '文件夹彻底删除失败！'
        })
      }
    } else {
      const { data } = await deleteFileApi([fileList.value[index].id], 2)
      if (data.success === true) {
        fileStore.fileDelete(index)
        ElMessage({
          type: 'success',
          message: '文件彻底删除成功！'
        })
      } else {
        ElMessage({
          type: 'error',
          message: '文件彻底删除失败！'
        })
      }
    }
  })
}

// 鼠标悬浮至文件时展示文件相关操作
const showOperation = (row: any, column: any, cell: HTMLElement, event: any) => {
  let parentDiv = cell.firstElementChild as HTMLElement
  let btnsDiv = parentDiv?.lastElementChild as HTMLElement
  if (btnsDiv?.classList?.[0]?.includes('file-operation-content')) {
    btnsDiv.style.display = 'inline-block'
  }
}
// 鼠标移出文件时隐藏文件相关操作
const hiddenOperation = (row: any, column: any, cell: HTMLElement, event: any) => {
  let parentDiv = cell.firstElementChild as HTMLElement
  let btnsDiv = parentDiv?.lastElementChild as HTMLElement
  if (btnsDiv?.classList?.[0]?.includes('file-operation-content')) {
    btnsDiv.style.display = 'none'
  }
}

// 分享相关
const shareVisible = ref(false)
const isProtected = ref(false)
const unlimitedDate = ref(false)
const shareInfo = ref({
  fileIds: [-1],
  folderIds: [-1],
  shareCode: null,
  expireTime: '',
  description: ''
})

watch(unlimitedDate, (newData) => {
  if (newData === true) {
    shareInfo.value.expireTime = ''
  }
})

function shareStart(index: any) {
  // console.log(fileList.value[index])
  if (fileList.value[index].type === 'folder') {
    shareInfo.value.folderIds = [fileList.value[index].id]
    shareInfo.value.fileIds = []
  } else {
    shareInfo.value.fileIds = [fileList.value[index].id]
    shareInfo.value.folderIds = []
  }
  isProtected.value = false
  shareVisible.value = true
}

function shareConfirm() {
  // console.log(shareInfo.value)
  if (!isProtected.value) {
    shareInfo.value.shareCode = null
  }
  server
    .post('/share/addShare', shareInfo.value)
    .then((res) => {
      if (res.data.success) {
        const codeShow = isProtected.value ? res.data.data.shareCode : '无需提取码'
        const timeShow = !unlimitedDate.value ? res.data.data.expireTime : '无限期'

        shareVisible.value = false
        isProtected.value = false
        unlimitedDate.value = false
        ElMessageBox.alert(
          '分享链接：' +
            baseFront +
            '/openShareLink?link=' +
            res.data.data.shareUrl +
            '<br>提取码：' +
            codeShow +
            '<br>有效期至：' +
            timeShow,
          '分享成功！',
          {
            confirmButtonText: '返回',
            dangerouslyUseHTMLString: true
          }
        )
      } else {
        ElNotification({
          title: '分享失败！',
          message: res.data.msg,
          type: 'error'
        })
      }
    })
    .catch((error) => {
      // 处理错误
      console.error('发生错误:', error)
    })
}

// 移动文件夹相关
interface Tree {
  label: string
  id: number
  children?: Tree[]
}

const treeProps = {
  label: 'label',
  children: 'children'
}
const treeRef = ref(null)
const moveVisible = ref(false)
const moveFileIndex = ref<number>(0) // 待移动文件夹在store中存储的位置
const treeData = ref<Tree[]>([])
const moveFile = async (index: number) => {
  moveVisible.value = true
  moveFileIndex.value = index
  const { data } = await getFolderTreeApi(-1)
  treeData.value = data.data
}
// 移动确认按钮
let destFolderId: number = -1
const doChoseTreeNodeCallBack = async (data: Tree) => {
  let srcFolderIds = []
  let srcFileIds = []
  destFolderId = (treeRef.value as any).getCurrentNode()?.id // 目标文件夹id
  if (destFolderId === undefined) {
    ElMessage({
      type: 'warning',
      message: '未选择移动文件夹'
    })
  }
  if (!!destFolderId && destFolderId !== fileList.value[moveFileIndex.value].id) {
    if (fileList.value[moveFileIndex.value].type === 'folder') {
      srcFolderIds.push(fileList.value[moveFileIndex.value].id)
    } else {
      srcFileIds.push(fileList.value[moveFileIndex.value].id)
    }
    const { data } = await moveFolderApi(srcFolderIds, srcFileIds, destFolderId)
    if (data.success === true) {
      ElMessage({
        type: 'success',
        message: '移动文件夹成功'
      })
      moveVisible.value = false
      fileStore.fileDelete(moveFileIndex.value)
    }
  }
}
// 移动取消按钮
const cancelChoseTreeNodeCallBack = () => {
  moveVisible.value = false
  destFolderId = -1
}

// 多选
const fileMultipleSelection = ref<any[]>([])
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

const { proxy } = getCurrentInstance() as any
const clearMultipleSelection = () => {
  proxy.$refs.fileTableRef.clearSelection()
}

// 向外暴露修改文件夹名方法，清除多项
defineExpose({
  fileRenameFn,
  clearMultipleSelection
})
</script>

<template>
  <!-- 文件列表 -->
  <el-table
    :data="fileList"
    ref="fileTableRef"
    style="width: 100%"
    :height="props.tableHeight"
    @cell-mouse-enter="showOperation"
    @cell-mouse-leave="hiddenOperation"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="35" />
    <el-table-column prop="name" label="文件名" min-width="780" class="file-show">
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
            v-else-if="
              scope.row.mime_type?.includes(
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              )
            "
          />
          <el-image
            :src="scope.row.url"
            style="width: 32px; height: 32px"
            v-else-if="scope.row.mime_type?.includes('image')"
          />
          <img
            src="/src/assets/imgs/pdf.png"
            width="32"
            height="32"
            v-else-if="scope.row.mime_type?.includes('pdf')"
          />
          <img
            src="/src/assets/imgs/ppt.png"
            width="32"
            height="32"
            v-else-if="scope.row.mime_type?.includes('presentationml.presentation')"
          />
          <img
            src="/src/assets/imgs/music.png"
            width="32"
            height="32"
            v-else-if="scope.row.mime_type?.includes('audio')"
          />
          <img
            src="/src/assets/imgs/video.png"
            width="32"
            height="32"
            v-else-if="scope.row.mime_type?.includes('video')"
          />
          <img
            src="/src/assets/imgs/excel.png"
            width="32"
            height="32"
            v-else-if="
              scope.row.mime_type?.includes(
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              )
            "
          />
          <img
            src="/src/assets/imgs/txt.png"
            width="32"
            height="32"
            v-else-if="scope.row.mime_type?.includes('text/plain')"
          />
          <img
            src="/src/assets/imgs/zip.png"
            width="32"
            height="32"
            v-else-if="scope.row.mime_type?.includes('application/x-zip-compressed')"
          />
          <img src="/src/assets/imgs/unknown.png" width="32" height="32" v-else />
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
          <div v-if="props.showType === 'common'">
            <el-tooltip content="下载" placement="top" effect="light">
              <el-button circle color="#0d53ff" @click="downloadFile(fileList[scope.$index])">
                <el-icon :size="18">
                  <Download />
                </el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="重命名" placement="top" effect="light">
              <el-button circle color="#bb0fff" @click="fileRenameFn(scope.$index)">
                <el-icon :size="18">
                  <EditPen />
                </el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="分享" placement="top" effect="light">
              <el-button circle color="#ff0fcb" @click="shareStart(scope.$index)">
                <el-icon :size="18">
                  <Share />
                </el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="移动" placement="top" effect="light">
              <el-button circle color="#ff0f53" @click="moveFile(scope.$index)">
                <el-icon :size="18">
                  <Promotion />
                </el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" effect="light">
              <el-button circle color="#ff430f" @click="fileDelete(scope.$index)">
                <el-icon :size="18">
                  <Delete />
                </el-icon>
              </el-button>
            </el-tooltip>
          </div>
          <div v-else-if="props.showType === 'recycle'">
            <el-tooltip content="还原" placement="top" effect="light">
              <el-button circle color="#67C23A" @click="recycleFile(scope.$index)">
                <el-icon :size="18" style="color: white">
                  <Refresh />
                </el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="彻底删除" placement="top" effect="light">
              <el-button circle color="#ef4343" @click="completeDeleteFile(scope.$index)">
                <el-icon :size="18">
                  <Delete />
                </el-icon>
              </el-button>
            </el-tooltip>
          </div>
          <div v-else-if="props.showType === 'share'">
            <el-tooltip content="下载" placement="top" effect="light">
              <el-button
                circle
                color="#0d53ff"
                @click="downloadSharedFile(fileList[scope.$index], props.showInfo!)"
              >
                <el-icon :size="18">
                  <Download />
                </el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="保存到网盘" placement="top" effect="light">
              <el-button
                circle
                color="#bb0fff"
                @click="saveToMine(fileList[scope.$index], props.showInfo!)"
              >
                <el-icon :size="18">
                  <PartlyCloudy />
                </el-icon>
              </el-button>
            </el-tooltip>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="size" label="大小" min-width="180">
      <template #default="scope1">
        <span v-if="scope1.row.type === 'folder'">-</span>
        <!-- TODO:文件大小输出格式化 -->
        <span v-else>{{ convertSize(scope1.row.size) }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="delete_time"
      label="删除日期"
      min-width="200"
      v-if="props.showType === 'recycle'"
    />
    <el-table-column prop="update_time" label="修改日期" min-width="200" v-else />
  </el-table>
  <!-- 分享Dialog -->
  <el-dialog v-model="shareVisible" title="分享文件" width="500">
    <el-form :model="shareInfo" label-width="100px">
      <el-form-item label="分享描述">
        <el-input v-model="shareInfo.description" autocomplete="off" />
      </el-form-item>
      <el-form-item label="分享有效期">
        <el-date-picker
          v-model="shareInfo.expireTime"
          type="datetime"
          placeholder="请选择日期"
          format="YYYY/MM/DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          :disabled="unlimitedDate"
        />&nbsp;&nbsp;
        <el-checkbox label="无限期" v-model="unlimitedDate"></el-checkbox>
      </el-form-item>
      <el-form-item label="需要提取码">
        <el-checkbox v-model="isProtected"></el-checkbox>
      </el-form-item>
      <el-form-item label="提取码" v-show="isProtected">
        <el-input v-model="shareInfo.shareCode" autocomplete="off" />
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="shareVisible = false">取消</el-button>
      <el-button type="primary" @click="shareConfirm"> 确认分享 </el-button>
    </div>
  </el-dialog>
  <!-- 移动Dialog -->
  <el-dialog title="移动到" v-model="moveVisible" width="600">
    <div class="tree-dialog-area">
      <el-tree
        :data="treeData"
        :props="treeProps"
        node-key="id"
        :default-expanded-keys="[1]"
        :expand-on-click-node="false"
        ref="treeRef"
      >
        <template #default="{ node, data }">
          <div class="treeNode-area">
            <img src="/src/assets/imgs/folder.png" width="28" height="28" />
            <span class="treeNode-lable">{{ node.label }}</span>
          </div>
        </template>
      </el-tree>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelChoseTreeNodeCallBack">取消</el-button>
        <el-button type="primary" @click="doChoseTreeNodeCallBack">移动</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 文件预览 -->
  <el-dialog v-model="preViewVis" top="8vh" :width="1000" title="文件预览">
    <div style="display: flex; text-align: center">
      <img :src="preViewUrl" width="965" v-if="preViewType === 'image'" />
      <video controls autoplay width="965" v-if="preViewType === 'video'">
        <source :src="preViewUrl" type="video/mp4" />
      </video>
      <audio :src="preViewUrl" width="965" controls v-if="preViewType === 'audio'"></audio>
    </div>
  </el-dialog>
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

.tree-dialog-area {
  :deep(.el-tree-node__content) {
    height: 33px;
  }
}
.treeNode-area {
  display: flex;
  justify-content: center;
  align-items: center;
  .treeNode-lable {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    margin-left: 4px;
  }
}
.treeNode-empty {
  height: 0px !important;
}
</style>
@/utils/fileOperation
