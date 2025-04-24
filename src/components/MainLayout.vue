<template>
  <div class="main-layout">
    <!-- 顶部导航栏  -->
    <nav class="navbar">
      <div class="container flex items-center justify-between">
        <h1 class="logo-text">校园二手</h1>
        <div class="nav-items">
          <router-link 
            v-for="(item, index) in navItems" 
            :key="item.path"
            :to="item.path"
            class="nav-link">
            {{ item.title }}
          </router-link>
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
  data() {
    return {
      navItems: [
        { title: '首页', path: '/' },
        { title: '商品', path: '/items' },
        { title: '我的', path: '/profile' }
      ]
    }
  }
}
</script>

<style scoped>
.navbar {
  /* 毛玻璃效果实现 */
  background: rgba(255, 255, 255, 0.8); /* 半透明白色背景 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.1); /* 双层阴影增加层次感 */
  backdrop-filter: saturate(180%) blur(10px); /* 关键属性：背景饱和度和模糊 */
  height: 72px; /* 固定导航栏高度 */
  border-bottom: 1px solid rgba(0, 0, 0, 0.05); /* 底部微边框 */
}

.logo-text {
  color: var(--primary-color);
  font-weight: 600;
  font-size: 1.4rem; /* 24px等效字号 */
}

.nav-link {
  color: var(--text-dark);
  padding: 0 1.2rem; /* 水平间距 */
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); /* 贝塞尔曲线动画 */
  position: relative; /* 为选中下划线定位准备 */
  font-weight: 500; /* 中等字重 */
}

.nav-link:hover {
  color: var(--primary-color);
  transform: translateY(-2px); /* Y轴位移悬停效果 */
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -6px; /* 定位在文字下方 */
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary-color);
  transform: scaleX(0); /* 初始隐藏下划线 */
  transition: transform 0.1s ease-out; /* 平滑过渡动画 */
}

.nav-link.active::after {
  transform: scaleX(0); /* 激活状态隐藏下划线 */
}

.nav-link:hover::after {
  transform: scaleX(1); /* 悬停时展开下划线 */
}

/* 主内容区布局 */
.content-area {
  flex: 1; /* 填充剩余空间 */
  padding: 2rem 0; /* 上下边距 */
}

/* 页脚样式 */
.app-footer {
  text-align: center;
  border-top: 1px solid #d2d2d7; /* 顶部分割线 */
  padding: 1.5rem 0; /* 垂直间距 */
}
</style>
