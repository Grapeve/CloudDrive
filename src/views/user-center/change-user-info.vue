<template>
  <div class="changeinfo">
    <el-form :model="changeinfo" label-width="120px">
      <el-form-item label="用户名：" required>
        <el-input v-model="changeinfo.username" />
      </el-form-item>
      <el-form-item label="性别：">
        <el-radio-group v-model="changeinfo.gender">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号码：" required>
        <el-input v-model="changeinfo.phone" />
      </el-form-item>
      <el-form-item label="邮箱：" required>
        <el-input v-model="changeinfo.email">
          <template #append>
            <el-button @click="sendCode">发送验证码</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="验证码：" required>
        <el-input v-model="changeinfo.code" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changeSubmit">确认修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElNotification } from 'element-plus'
import server from '@/utils/axios'
import { localSet, localGet } from '@/utils/localStorageFn'
import { User } from '@element-plus/icons-vue'

const changeinfo = ref({
  username: '',
  gender: 1,
  phone: '',
  email: '',
  code: ''
})

onMounted(() => {
  const user = localGet('user')
  changeinfo.value.username = user.username
  changeinfo.value.gender = user.gender
  changeinfo.value.phone = user.phone
  changeinfo.value.email = user.email
})

function changeSubmit() {
  server
    .post('/user/updateUser', changeinfo.value)
    .then((response) => {
      if (response.data.success === true) {
        ElNotification({
          title: '信息修改成功！',
          type: 'success'
        })
        const user = localGet('user')
        user.username = changeinfo.value.username
        user.gender = changeinfo.value.gender
        user.phone = changeinfo.value.phone
        user.email = changeinfo.value.email
        localSet('user', user)
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

function sendCode() {
  // console.log(regForm.value.email)
  // TODO: 增加邮箱格式验证
  server
    .post('/user/sendCode', { email: changeinfo.value.email })
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

<style scoped></style>
