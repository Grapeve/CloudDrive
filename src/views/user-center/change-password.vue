<template>
  <div class="changepwd">
    <el-form :model="changepwd" label-width="120px">
      <el-form-item label="原密码：" required>
        <el-input v-model="changepwd.oldPassword" show-password />
      </el-form-item>
      <el-form-item label="新密码：">
        <el-input v-model="changepwd.newPassword" show-password />
      </el-form-item>
      <el-form-item label="再次输入新密码：">
        <el-input v-model="renew" show-password />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changeSubmit">登录</el-button>
      </el-form-item>
    </el-form>
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

<style scoped></style>
