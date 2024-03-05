import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'

import { useFileStore, type fileType, type folderType } from '@/stores/file'
import { downloadFileApi, downloadFolderApi } from '@/api/fileApi'
import { saveShareToMineApi, downloadSharedFileApi } from '@/api/shareApi'
import { localGet } from './localStorageFn'

const fileStore = useFileStore()
const { fileList } = storeToRefs(fileStore)

const browserDownload = (data: Blob, name: string) => {
  const url = window.URL.createObjectURL(data)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.style.display = 'none'
  document.body.appendChild(a)
  // 触发下载
  a.click()
  // 下载完成后释放内存
  window.URL.revokeObjectURL(url)
  ElMessage({
    type: 'success',
    message: '文件夹下载成功'
  })
}

export const downloadFile = (file: fileType | folderType) => {
  if (!localGet('token')) {
    ElMessage({
      type: 'warning',
      message: '请先登录'
    })
    return
  }
  if (file.type === 'folder') {
    ElMessageBox.confirm('即将下载该文件夹，您确定这样做吗？', '下载文件夹', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      ElMessage({
        type: 'success',
        message: '下载中，请误关闭浏览器！'
      })
      // const { data } = await downloadFolderApi(fileList.value[index].id)
      downloadFolderApi(file.id).then((res) => {
        browserDownload(res.data, file.name)
      })
    })
  } else {
    ElMessageBox.confirm('即将下载该文件，您确定这样做吗？', '下载文件', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      ElMessage({
        type: 'success',
        message: '下载中，请误关闭浏览器！'
      })
      const { data } = await downloadFileApi((file as fileType).object_key)
      browserDownload(data, file.name)
    })
  }
}

export const saveToMine = async (
  file: fileType | folderType,
  shareInfo: {
    shareUrl: string
    code: string
  }
) => {
  if (!localGet('token')) {
    ElMessage({
      type: 'warning',
      message: '请先登录'
    })
    return
  }
  ElMessage({
    type: 'success',
    message: '转存中，请稍等！'
  })
  const { data } = await saveShareToMineApi(shareInfo.shareUrl, shareInfo.code)
  if (data.success === true) {
    ElMessage({
      type: 'success',
      message: '保存至我的网盘成功！'
    })
  } else {
    ElMessage({
      type: 'error',
      message: data.msg
    })
  }
}

export const downloadSharedFile = async (
  file: fileType | folderType,
  shareInfo: {
    shareUrl: string
    code: string
  }
) => {
  ElMessage({
    type: 'success',
    message: '下载中，请勿关闭浏览器！'
  })
  const { data } = await downloadSharedFileApi(shareInfo.shareUrl, shareInfo.code)
  if (data.success === true) {
    browserDownload(data, file.name)
  } else {
    ElMessage({
      type: 'error',
      message: data.msg
    })
  }
}
