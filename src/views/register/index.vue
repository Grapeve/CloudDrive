<script setup lang="ts">
import { ref } from 'vue'
import { ElNotification } from 'element-plus'
import server from '@/utils/axios'
import router from '@/router'

const regForm = ref({
  username: '',
  password: '',
  gender: 1,
  phone: '',
  email: '',
  code: ''
})

const password_check = ref('')

function regSubmit() {
  if (regForm.value.password === password_check.value) {
    console.log(regForm.value)
    server
      .post('/user/register', regForm.value)
      .then((response) => {
        if (response.data.success === true) {
          ElNotification({
            title: '注册成功！',
            message: '现在返登录页面',
            type: 'success'
          })
          router.push('/login')
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

function sendCode() {
  // console.log(regForm.value.email)
  // TODO: 增加邮箱格式验证
  server
    .post('/user/sendCode', { email: regForm.value.email })
    .then((response) => {
      if (response.data.success === true) {
        ElNotification({
          title: '验证码发送成功！',
          type: 'success'
        })
        // TODO: 增加再次发送倒计时
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
    <div class="register-container">
      <div class="cloud-drive-name">
        <SvgIcon icon="pan" style="font-size: 50px"></SvgIcon>
        <span>简存取云盘</span>
      </div>
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
          <el-button type="primary" @click="regSubmit" style="width: 227px">注册</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="router.push('/login')" style="width: 227px">
            返回登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.login {
  width: 50vh;
  height: 80vh;
  display: flex;
  flex-direction: column;
  /* 垂直布局 */
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.register-container {
  padding-top: 100px;
  padding-right: 70px;
}

.cloud-drive-name {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 20px;
  /* 留出一些空间 */
  /* padding-left: 80px; */
  font-size: 24px;
  font-weight: 600;
}
</style>
