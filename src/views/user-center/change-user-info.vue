<template>
  <div class="changeinfo">
    <div class="changeInfo-container">
      <div class="cloud-drive-name" @click="router.push('/')">
        <SvgIcon icon="pan" style="font-size: 50px"></SvgIcon>
        <span>简存取云盘</span>
      </div>
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
          <div style="display: flex; flex-direction: column">
            <el-button type="primary" @click="changeSubmit" style="width: 240px">
              确认修改
            </el-button>
            <el-button
              type="primary"
              @click="router.push('/')"
              style="width: 240px; margin: 10px 0 0 0"
            >
              返回
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElNotification } from 'element-plus'
import server from '@/utils/axios'
import { localSet, localGet } from '@/utils/localStorageFn'
import router from '@/router'

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

<style scoped>
.changeinfo {
  width: 55vh;
  height: 80vh;
  display: flex;
  /* 垂直布局 */
  align-items: center;
  justify-content: center;
  margin: 0px auto;
}

.changeInfo-container {
  margin-right: 20px;
}

.cloud-drive-name {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-bottom: 20px;
  /* 留出一些空间 */
  /* padding-left: 40px; */
  font-size: 24px;
  font-weight: 600;
}
</style>
