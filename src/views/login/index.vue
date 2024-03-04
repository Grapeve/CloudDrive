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
    <el-form :model="loginForm" label-width="120px">
      <el-form-item label="用户名：">
        <el-input v-model="loginForm.username" />
      </el-form-item>
      <el-form-item label="密码：">
        <el-input v-model="loginForm.password" show-password />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="loginSubmit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.login {
  width: 50vh;
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
}
</style>
