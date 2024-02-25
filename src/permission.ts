import router from './router/index'
import { localGet } from './utils/localStorageFn'
// 白名单
const whiteList = ['/login']

/**
 * *路由前置守卫
 * @param {*} to   要到哪里去
 * @param {*} from 从哪里来
 * @param {*} next 是否要去？
 */
router.beforeEach(async (to, from, next) => {
  if (localGet('token')) {
    // 1. 用户已登录，则不允许进入login
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    // 2. 用户未登录，只允许进入login
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
})
