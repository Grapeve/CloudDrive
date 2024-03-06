<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Download } from '@element-plus/icons-vue'

import { useUploadTaskStore } from '@/stores/uploadTask'

const uploadTaskStore = useUploadTaskStore()
const { uploadTask, viewFlag } = storeToRefs(uploadTaskStore)
</script>

<template>
  <div>
    <el-popover
      title="上传任务列表"
      placement="bottom-end"
      width="450"
      trigger="click"
      v-model:visible="viewFlag"
    >
      <template #reference>
        <el-button type="primary" :icon="Download" style="width: 55px; margin-right: 25px" />
      </template>
      <div>
        <el-table :data="uploadTask" empty-text="暂无传输任务" max-height="100px">
          <el-table-column
            align="center"
            header-align="center"
            label="文件名称"
            width="120"
            :show-overflow-tooltip="true"
          >
            <template #default="scope">{{ scope.row.uploadFileDTO.filename }}</template>
          </el-table-column>
          <el-table-column align="center" header-align="center" label="上传进度" width="180">
            <template #default="scope">
              <el-progress
                :percentage="scope.row.process.toFixed(2) * 100"
                color="#0d53ff"
                :show-text="false"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" header-align="center" label="文件状态" width="120">
            <template #default="scope">{{ scope.row.statu === 1 ? '上传中' : '失败' }}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-popover>
  </div>
</template>

<style lang="less" scoped></style>
