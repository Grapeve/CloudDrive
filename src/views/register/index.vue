<script setup lang="ts">
import { ref } from 'vue'
import server from '@/utils/axios'

const regForm = ref({
  username: '',
  password: '',
  gender: 1,
  phone: '',
  email: '',
  code: ''
}) as object

const password_check = ref('') as string

function regSubmit() {
  console.log(regForm.value)
}

function sendCode() {
  // console.log(regForm.value.email)
  server
    .post('/user/sendCode', { email: regForm.value.email })
    .then((response) => {
      // 处理成功响应
      console.log(response.data)
    })
    .catch((error) => {
      // 处理错误
      console.error('发生错误:', error)
    })
}
</script>

<template>
  <div class="login">
    <el-form :model="regForm" label-width="120px">
      <el-form-item label="用户名：" required>
        <el-input v-model="regForm.username" />
      </el-form-item>
      <el-form-item label="密码：" required>
        <el-input v-model="regForm.password" show-password />
      </el-form-item>
      <el-form-item label="确认密码：" required>
        <el-input v-model="password_check" show-password />
      </el-form-item>
      <el-form-item label="性别：">
        <el-radio-group v-model="regForm.gender">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号码：" required>
        <el-input v-model="regForm.phone" />
      </el-form-item>
      <el-form-item label="邮箱：" required>
        <el-input v-model="regForm.email">
          <template #append>
            <el-button @click="sendCode">发送验证码</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="验证码：" required>
        <el-input v-model="regForm.code" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="regSubmit">注册</el-button>
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
