import axios from '@/utils/axios'

export const deleteShareApi = async (shareId: number) => {
  return await axios.post('/share/deleteShare', { shareId: shareId })
}

export const getShareListApi = async () => {
  return await axios.get('/share/getShareList')
}

export const browseShareApi = async (url: string, code: any) => {
  return await axios.post('/share/browseShareLink', { shareUrl: url, shareCode: code })
}

export const saveShareToMineApi = async (
  shareUrl: string,
  shareCode: string,
  folderId: number = -1
) => {
  return await axios.post('/share/saveShare', { shareUrl, shareCode, folderId })
}

export const downloadSharedFileApi = async (
  shareUrl: string,
  shareCode: string,
  folderId: number = -1
) => {
  return await axios.post(
    '/share/downloadShare',
    { shareUrl, shareCode, folderId },
    {
      responseType: 'blob'
    }
  )
}

// 浏览文件夹（无须userId，仅搜索当前文件夹，不包含子孙文件夹）
export const getSharedFolderApi = async (folderId: number, keyword: string = '') => {
  return await axios.post('/share/getFolder', { folderId, keyword })
}
