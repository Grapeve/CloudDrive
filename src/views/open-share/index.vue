<script setup lang="ts">
import { ref, watch, onMounted, getCurrentInstance, onBeforeMount } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useBreadcrumbStore } from '@/stores/breadcrumb'
import { localGet, localRemove } from '@/utils/localStorageFn'
import server from '@/utils/axios'
import { ElNotification } from 'element-plus'
import { browseShareApi } from '@/api/shareApi'
import Table from '@/components/openShareTable/index.vue'

const route = useRoute()
const router = useRouter()

const user = localGet('user')

const usage = ref(0.0)

const shareUrl: string = route.query.link ?? ''
const code = ref('')
if (route.query.code) {
  code.value = route.query.code
}

const shareInfo = ref({
  shareCode: null,
  browseCount: 0,
  description: '',
  shareFiles: [
    {
      id: 70,
      userId: 1,
      folderId: -1,
      name: '1.zip',
      size: 1,
      url: 'https://cloud-disk-1314407651.cos.ap-guangzhou.myqcloud.com/2024-02-27/2024-02-27/a7481532-8da9-46f5-a3aa-1cef6c7f7099.png',
      mimeType: null,
      checksum: null,
      objectKey: '2024-02-27/a7481532-8da9-46f5-a3aa-1cef6c7f7099.png',
      createTime: '2024-02-27 16:51:37',
      updateTime: '2024-02-27 22:27:31',
      status: 1,
      deleteTime: null
    }
  ],
  expireTime: null,
  createTime: '2024-02-27 22:59:26',
  shareFileCount: 1,
  shareUrl: '346005ec-c30a-484c-84d2-59a56c977d61',
  id: 27,
  shareFolderCount: 0,
  downloadCount: 0,
  shareFolders: [],
  shareUser: {
    avatar:
      'https://cloud-disk-1314407651.cos.ap-guangzhou.myqcloud.com/2024-02-25/5e5de92e-d629-436b-8089-f40f1a032596.jpeg',
    username: '王五'
  },
  saveCount: 0
})
const fileTable = ref([{}])

// 获取已使用的空间
function getSpace() {
  // console.log(shareUrl)
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
}

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

// 处理不同页面间切换
const pageNo = ref(9)

onBeforeMount(() => {
  if (shareUrl.length === 36) {
    pageNo.value = 1
    submitCode()
  } else if (code.value !== '') {
    pageNo.value = 3
    submitCode()
  } else if (shareUrl.length === 37) {
    pageNo.value = 2
  }
})

// 提交提取码
async function submitCode() {
  var scode = null
  if (pageNo.value !== 1) {
    scode = code.value
  }
  const { data } = await browseShareApi(shareUrl, scode)
  if (data.success === true) {
    shareInfo.value = data.data
    fileTable.value = [...data.data.shareFolders, ...data.data.shareFiles]
    pageNo.value = 1
  } else {
    ElNotification({
      title: '失败！',
      message: data.msg,
      type: 'error'
    })
  }
}
</script>

<template>
  <div class="layout">
    <el-container style="height: 100%">
      <el-header class="layout-header">
        <div class="cloud-drive-name">
          <SvgIcon icon="pan" style="font-size: 50px"></SvgIcon>
          <span>简存取云盘</span>
        </div>
        <div class="user-info">
          <el-dropdown>
            <div style="display: flex; align-items: center; height: 50px">
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
                <el-dropdown-item>
                  <div @click="updateAvatar">更新头像</div>
                </el-dropdown-item>
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
      </el-header>
      <el-container>
        <el-main class="layout-main">
          <div class="layout-main-container">
            <div v-if="pageNo === 2" style="position: absolute; top: 40%; left: 30%">
              <el-input
                v-model="code"
                size="large"
                placeholder="请输入提取码"
                style="width: 200px; margin: 20px"
              ></el-input>
              <el-button
                type="primary"
                size="large"
                color="#0d53ff"
                class="btn-custom"
                @click="submitCode()"
              >
                <div style="display: flex; align-items: center; font-weight: 700">
                  <span>提取文件</span>
                </div>
              </el-button>
            </div>
            <div v-else-if="pageNo === 1">
              <div>
                分享时间：{{ shareInfo.createTime }} -
                {{ shareInfo.expireTime ? shareInfo.expireTime : '无限期 ' }} 共分享
                {{ shareInfo.shareFolderCount + shareInfo.shareFileCount }} 个文件<br />
                分享人：{{ shareInfo.shareUser.username }}
              </div>
              <Table :fileShareList="fileTable" />
            </div>
            <div v-else-if="pageNo === 9">
              <el-result icon="error" title="发生错误" sub-title="您的分享链接有误，请检查！" />
            </div>
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
</style>
