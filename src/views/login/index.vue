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
    <div class="login-container">
      <div class="cloud-drive-name">
        <SvgIcon icon="pan" style="font-size: 50px"></SvgIcon>
        <span style="padding-left: 5px">简存取云盘</span>
      </div>
      <el-form :model="loginForm" label-width="120px" label-position="top">
        <el-form-item label="用户名：">
          <el-input v-model="loginForm.username" />
        </el-form-item>
        <el-form-item label="密码：">
          <el-input v-model="loginForm.password" show-password />
        </el-form-item>
        <el-form-item>
          <div>
            <el-button type="primary" @click="loginSubmit" style="width: 110px; margin-right: 8px">
              登录
            </el-button>
            <el-button type="primary" @click="router.push('/register')" style="width: 110px">
              注册
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <div style="font-size: 14px; font-size: 600; color: rgb(27, 27, 227)">
        <div>
          测试账号：
          <span style="padding-left: 10px">大橘不胖</span>
          <span style="margin-left: 25px">123456</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* 垂直布局 */
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.login-container {
  width: 240px;
  padding-bottom: 180px;
}

.cloud-drive-name {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  margin-bottom: 15px;
  /* 留出一些空间 */
  /* padding-left: 80px; */
  font-size: 24px;
  font-weight: 600;
}
</style>
