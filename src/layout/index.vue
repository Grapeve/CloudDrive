<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { ref, watch } from 'vue'

const route = useRoute()

const currentPath = ref('all')
watch(
  () => route.path,
  (val) => {
    currentPath.value = val.slice(1)
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
        <div></div>
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
