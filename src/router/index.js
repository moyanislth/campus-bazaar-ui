import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/components/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/HomeView.vue')
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
  history: createWebHistory(),
  routes
})

export default router