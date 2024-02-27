<script setup lang="ts">
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

import server from '@/utils/axios'
import { getShareListApi } from '@/api/shareApi'
import { Close } from '@element-plus/icons-vue'

const tableHeight = ref(window.innerHeight - 200)
const shareList = ref([])

// 获取分享列表
onBeforeMount(async () => {
  const { data } = await getShareListApi()
  if (data.success === true) {
    shareList.value = data.data.shares
    // console.log(shareList.value)
  } else {
    ElMessage({
      type: 'error',
      message: data.msg
    })
  }
})

// 进入分享
function goToShare(shareInfo: object) {}

// 文件删除
// let deleteFoloderIds: number[] = []
// const fileDelete = (index: number) => {
//   ElMessageBox.confirm('文件删除后将保存在回收站，您确定这样做吗？', '删除文件', {
//     confirmButtonText: '确认',
//     cancelButtonText: '取消',
//     type: 'warning'
//   })
//     .then(async () => {
//       if (fileList.value[index].type === 'folder') {
//         // 删除文件夹进入回收站
//         try {
//           deleteFoloderIds.push(fileList.value[index].id)
//           const { data } = await deleteFolderApi(deleteFoloderIds, 0)
//           if (data.success === true) {
//             fileStore.fileDelete(index)
//             deleteFoloderIds = []
//             ElMessage({
//               type: 'success',
//               message: '删除成功'
//             })
//           } else {
//             deleteFoloderIds = []
//             ElMessage({
//               type: 'error',
//               message: data.msg
//             })
//           }
//         } catch (error: any) {
//           deleteFoloderIds = []
//           ElMessage({
//             type: 'error',
//             message: error.message
//           })
//         }
//       } else {
//         // 删除文件进入回收站
//         try {
//           deleteFoloderIds.push(fileList.value[index].id)
//           const { data } = await deleteFileApi(deleteFoloderIds, 0)
//           if (data.success === true) {
//             fileStore.fileDelete(index)
//             deleteFoloderIds = []
//             ElMessage({
//               type: 'success',
//               message: '删除成功'
//             })
//           } else {
//             deleteFoloderIds = []
//             ElMessage({
//               type: 'error',
//               message: data.msg
//             })
//           }
//         } catch (error: any) {
//           deleteFoloderIds = []
//           ElMessage({
//             type: 'error',
//             message: error.message
//           })
//         }
//       }
//     })
//     .catch(() => {
//       ElMessage({
//         type: 'info',
//         message: '删除取消'
//       })
//     })
// }

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
</script>

<template>
  <!-- 分享列表 -->
  <el-table
    :data="shareList"
    style="width: 100%"
    :height="tableHeight"
    @cell-mouse-enter="showOperation"
    @cell-mouse-leave="hiddenOperation"
  >
    <el-table-column prop="description" label="分享描述" min-width="300">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <img src="/src/assets/imgs/folder.png" width="32" height="32" />
          <div style="margin-left: 10px; cursor: pointer">
            <span @click="goToShare(scope.row)">{{ scope.row.description }} </span>
          </div>
        </div>
        <div class="file-operation-content">
          <el-tooltip content="查看分享链接" placement="top" effect="light">
            <el-button circle color="#0d53ff">
              <el-icon :size="18"><Link /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="取消分享" placement="top" effect="light">
            <el-button circle color="#bb0fff">
              <el-icon :size="18"><Close /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="downloadCount" label="下载次数" min-width="80" />
    <el-table-column prop="createTime" label="分享时间" min-width="160" />
    <el-table-column prop="expireTime" label="过期时间" min-width="160" />
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
