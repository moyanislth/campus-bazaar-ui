<template>
  <div class="main-layout">
    <!-- 顶部导航栏  -->
    <nav class="navbar">
      <div class="container flex items-center justify-between">
        <h1 class="logo-text">校园二手市场</h1>
        <div class="nav-items">
          <template v-for="item in navItems" :key="item.title">
            <!-- 普通路由链接 -->
            <router-link v-if="item.path" :to="item.path" class="nav-link">
              {{ item.title }}
            </router-link>

            <!-- 操作按钮（如登出） -->
            <a v-else-if="item.handler" href="#" class="nav-link" @click.prevent="handleLogout()">
              {{ item.title }}
            </a>
          </template>
        </div>
      </div>
    </nav>

    <!-- 内容区域 -->
    <main class="content-area">
      <div class="container">
        <router-view />
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="app-footer">
      <div class="container">
        <p class="footer-text">© 2024 Campus Bazaar</p>
      </div>
    </footer>
  </div>
</template>

<script>

/**
 * 主布局组件
 * 采用顶部导航 + 流式内容布局
 */
export default {
  name: 'MainLayout',
  methods: {
    /**
     * 处理登出操作：清空localStorage并跳转至登录页
     */
    handleLogout() {
      localStorage.clear(); // 清空所有localStorage数据
      this.$router.push('/auth'); // 跳转至认证页面
    },
    /**
     * 生成导航项数组
     * 根据用户角色动态添加管理入口
     */
    generateNavItems() {
      const baseItems = [
        { title: '首页', path: '/' },
        { title: '商品', path: '/products' },
        { title: '我的', path: '/profile' }
      ]

      // 如果是管理员，添加后台入口 如果是商家，添加上架功能
      const json = JSON.parse(localStorage.getItem("userInfo"))


      if (json != null && json.role === 2) {
        baseItems.push({ title: '后台', path: '/admin' })
      }
      if (json!= null && json.role === 1) {
        baseItems.push({ title: '上架', path: '/merchant' })
      }

      // 登出项使用 `handler` 代替 `path`，绑定清空localStorage的方法
      baseItems.push({ title: '登出', handler: 'handleLogout' });

      return baseItems
    }
  },
  data() {
    // 从localStorage读取购物车数据
    const savedCart = localStorage.getItem('campusBazaarCart')
    return {
      navItems: this.generateNavItems(),
      cart: {
        cartItems: savedCart ? JSON.parse(savedCart).cartItems : [], // 购物车商品列表
        totalPrice: 0 // 总费用
      }
    }
  },
  provide() {
    return {
      cart: this.cart,
    }
  },
  mounted() {
    // 监听添加购物车事件
    this.$bus.on('add-to-cart', (newItem) => {
      // 查找购物车中是否已存在相同ID的商品
      const existingItem = this.cart.cartItems.find(item => item.id === newItem.id);
      if (existingItem) {
        // 存在则数量+1
        existingItem.quantity += newItem.quantity;
      } else {
        // 不存在则添加新商品
        this.cart.cartItems.push(newItem);
      }
      // 计算总费用
      this.cart.totalPrice = this.cart.totalPrice + newItem.price * newItem.quantity;
      // 保存到localStorage
      localStorage.setItem('campusBazaarCart', JSON.stringify(this.cart));
      console.log(this.cart);
      // 调试
      // localStorage.removeItem("campusBazaarCart")
    });
  }
}

</script>

<style scoped>
.navbar {
  /* 毛玻璃效果实现 */
  background: rgba(255, 255, 255, 0.8);
  /* 半透明白色背景 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.1);
  /* 双层阴影增加层次感 */
  backdrop-filter: saturate(180%) blur(10px);
  /* 关键属性：背景饱和度和模糊 */
  height: 72px;
  /* 固定导航栏高度 */
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  /* 底部微边框 */
}

.logo-text {
  color: var(--primary-color);
  font-weight: 600;
  font-size: 1.4rem;
  /* 24px等效字号 */
}

.nav-link {
  color: var(--text-dark);
  padding: 0 1.2rem;
  /* 水平间距 */
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  /* 贝塞尔曲线动画 */
  position: relative;
  /* 为选中下划线定位准备 */
  font-weight: 500;
  /* 中等字重 */
}

.nav-link:hover {
  color: var(--primary-color);
  transform: translateY(-2px);
  /* Y轴位移悬停效果 */
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -6px;
  /* 定位在文字下方 */
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary-color);
  transform: scaleX(0);
  /* 初始隐藏下划线 */
  transition: transform 0.1s ease-out;
  /* 平滑过渡动画 */
}

.nav-link.active::after {
  transform: scaleX(0);
  /* 激活状态隐藏下划线 */
}

.nav-link:hover::after {
  transform: scaleX(1);
  /* 悬停时展开下划线 */
}

/* 主内容区布局 */
.content-area {
  flex: 1;
  /* 填充剩余空间 */
  padding: 2rem 0;
  /* 上下边距 */
}

/* 页脚样式 */
.app-footer {
  text-align: center;
  border-top: 1px solid #d2d2d7;
  /* 顶部分割线 */
  padding: 1.5rem 0;
  /* 垂直间距 */
}
</style>
