<script setup lang="ts">
import { inject, onBeforeMount, onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

import server from '@/utils/axios'
import { deleteShareApi, getShareListApi } from '@/api/shareApi'
import { Close } from '@element-plus/icons-vue'

const tableHeight = ref(window.innerHeight - 200)
const shareList = ref([])
const baseFront = inject('baseFront')

// 复制文字
function copyText(text: string) {
  var textarea = document.createElement('textarea') //创建临时的textarea元素
  textarea.value = text //设置要复制的文本内容
  document.body.appendChild(textarea) //添加到页面上
  textarea.select() //选中文本区域
  try {
    document.execCommand('copy') //执行复制命令
  } catch (err) {
    console.error('无法复制到剪贴板', err)
  } finally {
    document.body.removeChild(textarea) //移除临时的textarea元素
  }
}

function shareCopy() {
  const text: string = '分享链接：' + linkView.value + ' \n提取码：' + codeView.value
  copyText(text)
  ElNotification({
    type: 'success',
    message: '复制成功！'
  })
}

function shareCopy2() {
  copyText(linkView.value)
  ElNotification({
    type: 'success',
    message: '复制成功！'
  })
}

// 获取分享列表
async function getShareList() {
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
}

onBeforeMount(() => {
  getShareList()
})

// 打开分享链接窗口
const linkVisible = ref(false)
const linkView = ref('')
const codeView = ref('')
function openLinkDialog(index: number) {
  linkView.value = baseFront + '/openShareLink?link=' + shareList.value[index].shareUrl
  codeView.value = shareList.value[index].shareCode
  linkVisible.value = true
}

// 进入分享
function goToShare(shareInfo: object) {}

// 文件删除
const cancelShare = (index: number) => {
  ElMessageBox.confirm(
    '取消分享后，该条分享记录将被删除，好友将不能再访问，是否继续？',
    '取消分享',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const { data } = await deleteShareApi(shareList.value[index].id)
      if (data.success === true) {
        getShareList()
        ElMessage({
          type: 'success',
          message: '取消分享成功'
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
</script>

<template>
  <div>
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
            <img src="/src/assets/imgs/zip.png" width="32" height="32" />
            <div style="margin-left: 10px; cursor: pointer">
              <span @click="goToShare(scope.row)" v-if="scope.row.description !== ''"
                >{{ scope.row.description }}
              </span>
              <span @click="goToShare(scope.row)" v-else-if="scope.row.shareFileCount > 0"
                >{{ scope.row.shareFiles[0].name }} 等
                {{ scope.row.shareFileCount + scope.row.shareFolderCount }} 个文件</span
              >
              <span @click="goToShare(scope.row)" v-else
                >{{ scope.row.shareFolders[0].name }} 等
                {{ scope.row.shareFolderCount }} 个文件夹</span
              >
            </div>
          </div>
          <div class="file-operation-content">
            <el-tooltip content="查看分享链接" placement="top" effect="light">
              <el-button circle color="#0d53ff" @click="openLinkDialog(scope.$index)">
                <el-icon :size="18">
                  <Link />
                </el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="取消分享" placement="top" effect="light">
              <el-button circle color="#bb0fff" @click="cancelShare(scope.$index)">
                <el-icon :size="18">
                  <Close />
                </el-icon>
              </el-button>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="browseCount" label="浏览次数" min-width="80" />
      <el-table-column prop="createTime" label="分享时间" min-width="160" />
      <el-table-column prop="expireTime" label="过期时间" min-width="160">
        <template #default="scope">
          <span v-if="scope.row.expireTime === null">永久有效</span>
          <span v-else>{{ scope.row.expireTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分享链接Dialog -->
    <el-dialog v-model="linkVisible" title="成功创建分享链接" width="500">
      <el-input v-model="linkView" size="large" readonly />
      <span v-if="codeView !== null">
        提取码:<el-input v-model="codeView" style="margin: 2%; width: auto" size="large" readonly />
        <el-button type="primary" color="#0d53ff" class="btn-custom" @click="shareCopy()">
          <div style="display: flex; align-items: center; font-weight: 700">
            <span>复制链接及提取码</span>
          </div>
        </el-button>
      </span>
      <el-button
        type="primary"
        color="#0d53ff"
        class="btn-custom"
        style="margin-top: 2%"
        @click="shareCopy2()"
        v-if="codeView === null"
      >
        <div style="display: flex; align-items: center; font-weight: 700">
          <span>复制链接</span>
        </div>
      </el-button>
      <br /><br />
      <div class="dialog-footer">
        <el-button @click="linkVisible = false" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
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
