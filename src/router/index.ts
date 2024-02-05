import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/index.vue')
    },
    {
      path: '/',
      component: () => import('@/layout/index.vue'),
      redirect: '/all',
      children: [
        {
          path: '/all',
          name: 'All',
          component: () => import('@/views/list-all/index.vue')
        },
        {
          path: '/recent',
          name: 'Recent',
          component: () => import('@/views/list-recent/index.vue')
        },
        {
          path: '/video',
          name: 'Video',
          component: () => import('@/views/list-video/index.vue')
        },
        {
          path: '/img',
          name: 'Img',
          component: () => import('@/views/list-img/index.vue')
        },
        {
          path: '/doc',
          name: 'Doc',
          component: () => import('@/views/list-doc/index.vue')
        },
        {
          path: '/music',
          name: 'Music',
          component: () => import('@/views/list-music/index.vue')
        },
        {
          path: '/share',
          name: 'Share',
          component: () => import('@/views/list-share/index.vue')
        },
        {
          path: '/recycle',
          name: 'Recycle',
          component: () => import('@/views/list-recycle/index.vue')
        }
      ]
    }
  ]
})

export default router
