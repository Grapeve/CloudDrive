import axios from 'axios'
import { localGet, localRemove } from './localStorageFn'
import router from '@/router/index'

const server = axios.create({
  baseURL: 'http://114.132.210.33:9096',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    token: localGet('token') || ''
    // post: {
    //     'Content-Type': 'application/jsona'
    // }
  }
})

// 请求拦截器，后续有需要再添加
server.interceptors.request.use((config) => {
  if (localGet('token')) {
    if (config.headers.token !== localGet('token')) {
      config.headers.token = localGet('token')
    }
  }
  return config
})

// 响应拦截器，后续有需要再添加
server.interceptors.response.use((res) => {
  if (res.data.code === 2001) {
    localRemove('token')
    router.push('/login')
  }
  return res
})
// response => {
//     if (response.data.code === 999) {
//         localRemove("token");
//         // router.replace('/');
//         console.log("token过期");
//     }
//     return response;
// },
// error => {
//     return Promise.reject(error);
// }

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
