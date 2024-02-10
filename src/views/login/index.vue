<script setup lang="ts">
import { ref } from 'vue'

const loginForm = ref({
  username: "",
  password: "",
  isMaintain: false,
}) as object

function loginSubmit(){
  console.log(loginForm)
}


</script>

<template>
  <div class="login">
    <el-form :model="loginForm" label-width="120px">
      <el-form-item label="用户名：">
        <el-input v-model="loginForm.username" />
      </el-form-item>
      <el-form-item label="密码：">
        <el-input v-model="loginForm.password" show-password/>
      </el-form-item>
      <el-form-item label="保持登录：">
        <el-checkbox v-model="loginForm.isMaintain"/>
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
