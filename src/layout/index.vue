<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { ElMessage, ElNotification } from 'element-plus'
import { Search, Download } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'

import server from '@/utils/axios'
import { useBreadcrumbStore } from '@/stores/breadcrumb'
import { localGet, localRemove } from '@/utils/localStorageFn'
import { useFileStore } from '@/stores/file'
import { searchFileOrFolders } from '@/api/fileApi'
import TaskList from '@/components/TaskList/index.vue'

const route = useRoute()
const router = useRouter()

const breadcrumbStore = useBreadcrumbStore()

const fileStore = useFileStore()
const { fileList } = storeToRefs(fileStore)

const user = localGet('user')

const usage = ref(0.0)

// 获取已使用的空间
onMounted(() => {
  server
    .get('/file/usingMemory')
    .then((res) => {
      if (res.data.success) {
        usage.value = res.data.data.toFixed(2)
      } else {
        ElNotification({
          title: '错误',
          message: res.data.msg,
          type: 'error'
        })
      }
    })
    .catch((error) => {
      // 处理错误
      console.error('发生错误:', error)
    })
})

// 注册
const register = () => {
  router.push('/register')
}

// 登录
const login = () => {
  router.push('/login')
}

// 退出登录
const logout = () => {
  localRemove('user')
  localRemove('token')
  router.push('/login')
}

// 改头像
// TODO: 修改头像
const updateAvatar = () => {
  router.push('/')
}

// 改密码
const changePwd = () => {
  router.push('/changepwd')
}

// 改个人信息
const changeInfo = () => {
  router.push('/changeinfo')
}

// 搜索
const searchInput = ref<string>('')
const searchFile = async () => {
  const { data } = await searchFileOrFolders(-1, searchInput.value)
  if (data.success === true) {
    breadcrumbStore.clearBreadcrumb()
    breadcrumbStore.addBreadcrumb({
      id: '-1',
      name: `搜索: ${searchInput.value}`
    })
    fileList.value = [...data.data.files, ...data.data.folders]
  } else {
    ElMessage({
      type: 'error',
      message: data.msg
    })
  }

  searchInput.value = ''
}

const currentPath = ref('all')
watch(
  () => route.path,
  (val) => {
    currentPath.value = val.slice(1)
    fileList.value = new Array()
    breadcrumbStore.clearBreadcrumb()
  }
)
</script>

<template>
  <div class="layout">
    <el-container style="height: 100%">
      <el-header class="layout-header">
        <div class="cloud-drive-name">
          <SvgIcon icon="pan" style="font-size: 50px"></SvgIcon>
          <span>简存取云盘</span>
        </div>
        <div class="right-content">
          <TaskList />
          <div class="serach-area">
            <el-input
              v-model="searchInput"
              placeholder="搜索全部文件"
              style="height: 36px"
              @change="searchFile"
              :prefix-icon="Search"
            >
            </el-input>
          </div>
          <div class="user-info">
            <el-dropdown>
              <div style="display: flex; align-items: center; height: 50px">
                <!-- <el-avatar
                :size="45"
                src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
              /> -->
                <el-avatar :size="45" :src="user.avatar" />
                <div class="user-info-right-wrap">
                  <span class="user-name">{{ user.username }}</span>
                  <el-progress :percentage="usage / 10.24" color="#0d53ff" :show-text="false" />
                  <span class="user-space"
                    ><span>{{ usage }}</span
                    >M / 1G</span
                  >
                </div>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <div @click="changeInfo">修改个人信息</div>
                  </el-dropdown-item>
                  <!-- <el-dropdown-item>
                    <div @click="updateAvatar">更新头像</div>
                  </el-dropdown-item> -->
                  <el-dropdown-item>
                    <div @click="changePwd">修改密码</div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="logout">退出登录</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-container>
        <el-aside class="layout-navbar">
          <!-- 导航栏 -->
          <div class="layout-navbar-container">
            <el-menu
              :default-active="currentPath"
              text-color="#000000a6"
              active-text-color="#0d53ff"
              :router="true"
            >
              <el-menu-item index="all" route="all">
                <el-icon><Files /></el-icon>
                <span>全部文件</span>
              </el-menu-item>
              <el-menu-item index="recent" route="recent">
                <el-icon><Timer /></el-icon>
                <span>最近</span>
              </el-menu-item>
              <el-menu-item index="video" route="video">
                <el-icon><VideoCamera /></el-icon>
                <span>视频</span>
              </el-menu-item>
              <el-menu-item index="img" route="img">
                <el-icon><Picture /></el-icon>
                <span>图片</span>
              </el-menu-item>
              <el-menu-item index="doc" route="doc">
                <el-icon><Folder /></el-icon>
                <span>文档</span>
              </el-menu-item>
              <el-menu-item index="music" route="music">
                <el-icon><Headset /></el-icon>
                <span>音频</span>
              </el-menu-item>
              <el-menu-item index="share" route="share">
                <el-icon><Share /></el-icon>
                <span>我的分享</span>
              </el-menu-item>
              <el-menu-item index="recycle" route="recycle">
                <el-icon><Delete /></el-icon>
                <span>回收站</span>
              </el-menu-item>
            </el-menu>
          </div>
        </el-aside>
        <el-main class="layout-main">
          <div class="layout-main-container">
            <RouterView />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="less" scoped>
.layout {
  width: 100%;
  height: 100%;
  background-color: #ededf0;
}
.layout-header {
  height: 62px;
  padding: 0;
  display: flex;
  align-items: center;
  .cloud-drive-name {
    padding-left: 25px;
    font-size: 24px;
    font-weight: 600;
  }
  .right-content {
    margin: 0 10px 0 auto;
    display: flex;
    align-items: center;
  }
  .serach-area {
    height: 36px;
    width: 200px;
    border-radius: 8px;
    background-color: #fff;
    margin: 0 20px 0 0;
  }
  .user-info {
    height: 50px;
    margin: 0 10px 0 auto;
    .user-info-right-wrap {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      margin-left: 12px;
      .user-name {
        width: 100px;
        font-size: 13px;
        color: #222222;
        font-weight: 600;
        letter-spacing: 0.3px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      :deep(.el-progress-bar__outer) {
        background-color: rgba(16%, 16%, 100%, 0.1);
      }
      .user-space {
        font-size: 11px;
        color: #52565e;
        font-weight: 600;
      }
    }
    :deep(.el-tooltip__trigger:focus-visible) {
      outline: unset;
    }
  }
}
.layout-navbar {
  width: 220px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .layout-navbar-container {
    margin-top: 20px;
    width: 100%;
    height: 100%;
    font-weight: 600;
    :deep(.el-menu-item) {
      background-color: #ededf0;
      height: 38px;
      transition: all 0.3s ease;
    }
    :deep(.is-active) {
      font-weight: 600;
      transition: all 0.3s ease;
    }
  }
}
.layout-main {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  .layout-main-container {
    width: 100%;
    height: 100%;
    padding: 10px 0 0 10px;
    background-color: #fff;
    border-top-right-radius: 24px;
    border-top-left-radius: 24px;
  }
}
.upload-task-content {
  background-color: red;
}
</style>
