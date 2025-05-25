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
        path: '/products/:id',
        name: 'ProductDetail',
        component: () => import('@/views/common/ProductDetail.vue'),
        meta: { title: '商品详情' }
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/common/ProfileView.vue')
      },
      {
        path: '/wallet',
        name: 'Wallet',
        component: () => import('@/views/common/WalletView.vue'),

      },
      {
        path: '/merchant',
        name: 'Merchant',
        component: () => import('@/views/common/MerchantView.vue'),

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
  },
  {
    path: '/error',
    component: () => import('@/components/Error.vue'),
    name: 'Error'
  },
  {
    path: '/:pathMatch(.*)*', // 匹配所有未定义的路由
    redirect: '/error'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫，检查用户权限
router.beforeEach((to, from, next) => {
  const userInfo = localStorage.getItem('userInfo');


  // 1. 检查是否登录（排除登录页本身）
  if (userInfo === null && to.path !== '/auth') {
    next('/auth');  // 跳转到登录页
    return;        // 关键！终止后续逻辑
  }

  // 2. 管理员权限检查
  if (to.path.startsWith('/admin')) {
    try {
      const json = JSON.parse(userInfo);
      if (json.role !== 2) {  // 2 是管理员
        next('/error?code=403'); // 无权限页
        return;
      }
    } catch (e) {
      console.error('解析 userInfo 失败', e);
      next('/error?code=500'); // 数据异常页
      return;
    }
  }

  // 4. 默认放行
  next();
});


export default router