<script setup lang="ts">
import { ref, getCurrentInstance, watch, inject } from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

import { convertSize } from '@/utils/index'
import server from '@/utils/axios'

defineProps(['fileShareList'])
const tableHeight = ref(window.innerHeight - 200)

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
  <!-- 文件列表 -->
  <el-table
    :data="fileShareList"
    ref="fileTableRef"
    style="width: 100%"
    :height="tableHeight"
    @cell-mouse-enter="showOperation"
    @cell-mouse-leave="hiddenOperation"
  >
    <el-table-column type="selection" width="35" />
    <el-table-column prop="name" label="文件名" min-width="400" class="file-show">
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
          <!-- <img
            src="/src/assets/imgs/pdf.png"
            width="32"
            height="32"
            v-else-if="scope.row.mime_type.includes('pdf')"
          /> -->
          <img
            src="/src/assets/imgs/music.png"
            width="32"
            height="32"
            v-else-if="scope.row.type === 'music'"
          />
          <img
            src="/src/assets/imgs/video.png"
            width="32"
            height="32"
            v-else-if="scope.row.type === 'video'"
          />
          <!-- <img
            src="/src/assets/imgs/excel.png"
            width="32"
            height="32"
            v-else-if="
              scope.row.mime_type.includes(
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              )
            "
          /> -->
          <img
            src="/src/assets/imgs/zip.png"
            width="32"
            height="32"
            v-else-if="scope.row.type === 'zip'"
          />
          <img src="/src/assets/imgs/unknown.png" width="32" height="32" v-else />
          <div style="margin-left: 10px; cursor: pointer">
            <span>{{ scope.row.name }}</span>
          </div>
        </div>
        <div class="file-operation-content">
          <el-tooltip content="下载" placement="top" effect="light">
            <el-button circle color="#0d53ff">
              <el-icon :size="18"><Download /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="保存到网盘" placement="top" effect="light">
            <el-button circle color="#bb0fff">
              <el-icon :size="18"><PartlyCloudy /></el-icon>
            </el-button>
          </el-tooltip>
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
    <el-table-column prop="updateTime" label="修改日期" min-width="200" />
  </el-table>

  <!-- 移动Dialog -->
  <!-- <el-dialog title="移动到" v-model="moveVisible" width="600">
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
  </el-dialog> -->
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
