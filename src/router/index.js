import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/components/MainLayout.vue'),
    children: [
      {
        path: '',  // 父路由内的默认路由
        name: 'Home',
        component: () => import('@/views/HomeView.vue')
      },
      {
        path: '/products',  // 父路由内的默认路由
        name: 'Products',
        component: () => import('@/views/ProductView.vue')
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('@/views/AuthPage.vue'),
    name: 'Authentication'
  }
]

const router = createRouter({
  history: createWebHistory(),  // 标准HTML5路由模式
  routes                        // 注入路由表
})

export default router