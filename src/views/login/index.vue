<script setup lang="ts">
import { ref } from 'vue'
import { ElNotification } from 'element-plus'
import server from '@/utils/axios'
import { localSet, localGet } from '@/utils/localStorageFn'
import router from '@/router'

const loginForm = ref({
  username: '',
  password: ''
  // isMaintain: false
})

function loginSubmit() {
  server
    .post('/user/login', loginForm.value)
    .then((response) => {
      if (response.data.success === true) {
        ElNotification({
          title: '登录成功！',
          type: 'success'
        })
        localSet('token', response.data.data.token)
        localSet('user', response.data.data.user)
        // console.log(localGet('token'))
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
}
</script>

<template>
  <div class="login">
    <div class="cloud-drive-name">
      <SvgIcon icon="pan" style="font-size: 50px"></SvgIcon>
      <span>简存取云盘</span>
    </div>
    <el-form :model="loginForm" label-width="120px">
      <el-form-item label="用户名：">
        <el-input v-model="loginForm.username" />
      </el-form-item>
      <el-form-item label="密码：">
        <el-input v-model="loginForm.password" show-password />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="loginSubmit" style="width: 92px">登录</el-button>
        <el-button type="primary" @click="router.push('/register')" style="width: 92px">
          注册
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.login {
  width: 50vh;
  height: 50vh;
  display: flex;
  flex-direction: column;
  /* 垂直布局 */
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.cloud-drive-name {
  margin-bottom: 20px;
  /* 留出一些空间 */
  padding-left: 80px;
  font-size: 24px;
  font-weight: 600;
}
</style>
