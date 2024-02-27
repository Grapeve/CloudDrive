import axios from '@/utils/axios'

export const deleteShareApi = async (shareId: number) => {
  return await axios.post('/share/deleteShare', { shareId: shareId })
}

export const getShareListApi = async () => {
  return await axios.get('/share/getShareList')
}

export const browseShareApi = async (url: string, code: string) => {
  return await axios.post('/share/browseShareLink', { shareUrl: url, shareCode: code })
}
