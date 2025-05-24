<template>
  <div class="home-view">
    <h2>欢迎来到校园二手市场</h2>
    <p>在这里发现优质二手商品，开启绿色校园生活</p>
  </div>
  <div class="home-view">
    <!-- 轮播图容器 -->
    <div class="carousel-container">
      <!-- 左右导航箭头 -->
      <button class="carousel-arrow prev" @click="prevSlide">&lt;</button>
      <button class="carousel-arrow next" @click="nextSlide">&gt;</button>

      <!-- 轮播轨道，动态绑定transform样式 -->
      <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <!-- 单个轮播项，增加点击事件 -->
        <div v-for="(item, index) in carouselItems" :key="index" class="carousel-item" @click="currentSlide = index">
          <img :src="item.image" alt="热门商品" class="carousel-image">
        </div>
      </div>

      <!-- 可点击导航点 -->
      <div class="carousel-dots">
        <span v-for="(dot, index) in carouselItems" :key="index" class="dot" :class="{ active: currentSlide === index }"
          @click="currentSlide = index"></span>
      </div>
    </div>

    <!-- 商品网格布局容器 -->
    <div class="product-grid">
      <!-- 单个商品卡片，使用v-for循环生成 -->
      <div v-for="product in products" :key="product.id" class="product-card"
        @click="navigateToDetail(product.product.id)">
        <!-- 商品缩略图 -->
        <img :src="getMainImageUrl(product.productImages)" alt="商品图片" class="product-thumbnail">

        <!-- 商品信息容器 -->
        <div class="product-info">
          <!-- 商品价格显示 -->
          <span class="price">¥{{ product.product.discountPrice === null ? product.product.originalPrice :
            product.product.discountPrice }}</span>

          <!-- 商家信息容器，使用flex布局两端对齐 -->
          <div class="merchant-info">
            <!-- 商家名称 -->
            <span class="merchant">{{ product.product.merchantName }}</span>
            <!-- 销量显示 -->
            <span class="sales">{{ product.product.nob }}人已购</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 加载提示 -->
    <div v-if="loading" class="loading-tip" style="text-align: center; padding: 20px; color: #666;">加载中...</div>
    <!-- 无更多数据提示 -->
    <div v-if="!hasMore && !loading" class="no-more-tip" style="text-align: center; padding: 20px; color: #999;">没有更多商品了
    </div>
  </div>
</template>

<script>
import { goodsAPI } from '@/api';

/**
 * 首页视图组件
 * 展示平台欢迎信息和核心功能入口
 */
export default {
  name: 'HomeView',
  data() {
    return {
      /** 轮播图 */
      currentSlide: 0,
      timer: null, // 新增定时器引用
      carouselItems: [
        { image: '/img/carousel/1.png' },
        { image: '/img/carousel/2.png' },
        { image: '/img/carousel/3.png' },
        { image: '/img/carousel/4.png' },
        { image: '/img/carousel/5.png' }
      ],
      /** 分页控制 */
      currentPage: 1,
      pageSize: 15, // 每页展示的商品数量
      loading: false, // 加载状态
      hasMore: true, // 是否有更多数据
      allProducts: [], // 存储所有商品数据
      /** 用于展示的商品列表 */
      products: []
    }
  },
  mounted() {
    this.startAutoPlay(); // 组件挂载后启动自动播放
    this.getProducts(); // 初始加载第一页数据
    window.addEventListener('scroll', this.handleScroll); // 添加滚动监听
  },
  beforeUnmount() {
    this.stopAutoPlay(); // 组件销毁前清除定时器
    window.removeEventListener('scroll', this.handleScroll); // 移除滚动监听
  },
  methods: {

    /**
     * 处理滚动事件
     */
    handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const documentHeight = document.documentElement.scrollHeight;
      // 滚动到底部附近且有更多数据时加载
      if (scrollTop + windowHeight >= documentHeight - 100 && !this.loading && this.hasMore) {
        this.currentPage++;
        this.getProducts();
      }
    },

    /**
     * 获取分页商品列表
     * @returns {Promise<Array>} 商品列表
    */
    async getProducts() {
      if (this.loading) return; // 防止重复请求
      this.loading = true;
      try {
        // 首次加载获取所有商品数据
        if (this.currentPage === 1) {
          const res = await goodsAPI.getAllProductsWithImg(); // 调用无参方法获取所有数据
          this.allProducts = res.data; // 存储所有商品
        }
        // 计算当前页需要展示的数据范围
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        const newProducts = this.allProducts.slice(start, end);
        // 初始页直接赋值，后续页累加
        this.products = this.currentPage === 1 ? newProducts : [...this.products, ...newProducts];
        // 判断是否有更多数据
        this.hasMore = end < this.allProducts.length;
      } catch (error) {
        console.error('获取商品列表失败:', error);
      } finally {
        this.loading = false;
      }
    },

    /** 启动自动播放 */
    startAutoPlay() {
      this.timer = setInterval(() => {
        this.nextSlide();
      }, 5000);
    },
    /** 停止自动播放 */
    stopAutoPlay() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    /** 切换到上一张轮播图 */
    prevSlide() {
      this.currentSlide = this.currentSlide === 0
        ? this.carouselItems.length - 1
        : this.currentSlide - 1
      this.restartAutoPlay(); // 手动切换后重置定时器
    },
    /** 切换到下一张轮播图 */
    nextSlide() {
      this.currentSlide = this.currentSlide === this.carouselItems.length - 1
        ? 0
        : this.currentSlide + 1
      this.restartAutoPlay(); // 手动切换后重置定时器
    },
    /** 重置自动播放定时器 */
    restartAutoPlay() {
      this.stopAutoPlay();
      this.startAutoPlay();
    },

    detectImageType(buffer) {
      const header = new Uint8Array(buffer.slice(0, 4));
      if (header[0] === 0xFF && header[1] === 0xD8) return 'image/jpeg';
      if (header[0] === 0x89 && header[1] === 0x50) return 'image/png';
      return 'application/octet-stream';
    },

    /**
     * 获取商品主图URL（优先isMain为true的图片，否则取第一个）
     * @param {Array} images 商品图片数组
     * @returns {string} 主图URL
     */
    getMainImageUrl(images) {
      if (!images || images.length === 0) return ''; // 处理图片数组为空的情况
      const mainImage = images.find(img => img.isMain) || images[0]; // 确保mainImage存在

      if (!mainImage.imageData) {
        console.error('Image data is missing:', mainImage);
        return '';
      }
      const mimeType = this.detectImageType(mainImage.imageData); // Use imageData instead of data
      return `data:${mimeType};base64,${mainImage.imageData}`;
    },
    /** 跳转到商品详情页 */
    navigateToDetail(productId) {
      this.$router.push(`/products/${productId}`);
    },
  }
}
</script>

<style scoped>
.home-view {
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 轮播图样式 */
.carousel-container {
  position: relative;
  margin-bottom: 40px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-item {
  flex: 0 0 100%;
  height: 400px;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 新增箭头样式 */
.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: background 0.3s;
  z-index: 2;
  /* 新增层叠顺序控制 */
}

.carousel-arrow:hover {
  background: rgba(255, 255, 255, 0.5);
}

.prev {
  left: 20px;
}

.next {
  right: 20px;
}

/* 导航点 */
.carousel-dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: transform 0.3s;
}

.dot.active {
  background: #fff;
}

.dot:hover {
  transform: scale(1.3);
}

/* 商品网格布局 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
}

.product-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-thumbnail {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 12px;
}

.price {
  font-size: 1.2em;
  font-weight: 600;
  color: #1d1d1f;
}

.merchant-info {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  font-size: 0.9em;
  color: #86868b;
}

.sales {
  color: #06c;
}
</style>