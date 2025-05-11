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
      },
      {
        path: '/products',
        name: 'Products',
        component: () => import('@/views/common/ProductView.vue')
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/common/ProfileView.vue')
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('@/components/admin/AdminLayout.vue'),
    // TODO: 这里需要修改为管理员权限的判断
    meta: { requiresAuth: false, adminOnly: false },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/AdminDashboard.vue'),
        meta: { title: '仪表盘' }
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: () => import('@/views/admin/UserManagement.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'products',
        name: 'ProductReview',
        component: () => import('@/views/admin/ProductReview.vue'),
        meta: { title: '商品管理' }
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('@/views/AuthPage.vue'),
    name: 'Auth'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫, 检查用户是否登录
router.beforeEach((to, _from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  const isAdmin = localStorage.getItem('isAdmin') === 'true'

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({
        name: 'Auth',
        query: { redirect: to.fullPath }
      })
      return
    }
  }

  if (to.matched.some(record => record.meta.adminOnly)) {
    if (!isAdmin) {
      next('/')
      return
    }
  }

  next()
})

export default router