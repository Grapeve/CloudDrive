import axios from 'axios'
import { localGet } from './localStorageFn'

const server = axios.create({
  baseURL: '',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    token: localGet('token') || '',
    post: {
      'Content-Type': 'application/jsona'
    }
  }
})

// 请求拦截器，后续有需要再添加
server.interceptors.request.use((res) => {
  return res
})

// 响应拦截器，后续有需要再添加
server.interceptors.response.use((res) => {
  return res
})

export default server

// 使用
// import axios from '@/utils/axios'

// api/anime.ts
// export const getAnimes = async (page: number) => {
//   return axios.get(`https://shikimori.one/api/animes?page=${page}&limit=8&order=popularity`)
// }

// xxx/index.vue
// import {getAnimes} from "@/api/anime"
// const {data} = await getAnimes(1)
