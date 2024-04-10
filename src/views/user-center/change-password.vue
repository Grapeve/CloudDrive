<template>
  <div class="changepwd">
    <div class="changepwd-container">
      <div class="cloud-drive-name">
        <SvgIcon icon="pan" style="font-size: 50px"></SvgIcon>
        <span>简存取云盘</span>
      </div>
      <el-form :model="changepwd" label-width="180px">
        <el-form-item label="原密码：" required>
          <el-input v-model="changepwd.oldPassword" show-password />
        </el-form-item>
        <el-form-item label="新密码：" required>
          <el-input v-model="changepwd.newPassword" show-password />
        </el-form-item>
        <el-form-item label="再次输入新密码：" required>
          <el-input v-model="renew" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changeSubmit" style="width: 100px">登录</el-button>
          <el-button type="primary" @click="router.push('/')" style="width: 100px">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElNotification } from 'element-plus'
import server from '@/utils/axios'
import router from '@/router'

const changepwd = ref({
  oldPassword: '',
  newPassword: ''
})

const renew = ref('')

function changeSubmit() {
  if (changepwd.value.newPassword === renew.value) {
    // console.log(changepwd.value)
    server
      .post('/user/resetPassword', changepwd.value)
      .then((response) => {
        if (response.data.success === true) {
          ElNotification({
            title: '密码修改成功！',
            type: 'success'
          })
          router.push('/')
        } else {
          ElNotification({
            title: '错误',
            message: response.data.msg,
            type: 'error'
          })
        }
      })
      .catch((error) => {
        // 处理错误
        console.error('发生错误:', error)
      })
  } else {
    ElNotification({
      title: '错误',
      message: '两次输入密码不一致！',
      type: 'error'
    })
  }
}
</script>

<style scoped>
.changepwd {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* 垂直布局 */
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.changepwd-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 400px;
  padding-bottom: 100px;
  padding-right: 100px;
}

.cloud-drive-name {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  /* 留出一些空间 */
  padding-left: 80px;
  font-size: 24px;
  font-weight: 600;
}
</style>
