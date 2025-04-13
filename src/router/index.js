import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

const router = createRouter({
  // history模式:createWebHistory
  // hash模式:createWebHashHistory
  // import.meta.env.BASE_URL是vite环境变量，可在vite.config.js中通过base选项更改默认路径
  history: createWebHistory(import.meta.env.BASE_URL),
  // 路由懒加载（异步路由）
  routes: [
    // 一级路由
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    // 二级路由
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})
// 导航守卫
router.beforeEach(to => {
  const userStore = useUserStore()
  if (!userStore.token && to.path !== '/login') return '/login'
})

export default router
