import axios from 'axios'
import {localGet, localRemove} from './localStorageFn'

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
server.interceptors.request.use(
    res => {
        if (localGet('token')) { //判断token是否存在
            res.headers.token = localGet('token');  //将token设置成请求头
        }
        return res;
    },
    err => {
        return Promise.reject(err);
    }
)

// 响应拦截器，后续有需要再添加
server.interceptors.response.use(
    response => {
        if (response.data.code === 999) {
            localRemove("token");
            // router.replace('/');
            console.log("token过期");
        }
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

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
