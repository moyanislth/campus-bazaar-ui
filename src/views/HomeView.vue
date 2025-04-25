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
      <div v-for="product in products" :key="product.id" class="product-card">
        <!-- 商品缩略图 -->
        <img :src="product.thumbnail" alt="商品图片" class="product-thumbnail">

        <!-- 商品信息容器 -->
        <div class="product-info">
          <!-- 商品价格显示 -->
          <span class="price">¥{{ product.price }}</span>

          <!-- 商家信息容器，使用flex布局两端对齐 -->
          <div class="merchant-info">
            <!-- 商家名称 -->
            <span class="merchant">{{ product.merchant }}</span>
            <!-- 销量显示 -->
            <span class="sales">{{ product.sales }}人已购</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 首页视图组件
 * 展示平台欢迎信息和核心功能入口
 */
export default {
  name: 'HomeView',
  data() {
    return {
      currentSlide: 0,
      carouselItems: [
        // { image: 'https://source.unsplash.com/random/800x400?electronics,1' },
        { image: '/img/carousel/1.png' },
        { image: '/img/carousel/2.png' },
        { image: '/img/carousel/3.png' },
        { image: '/img/carousel/4.png' },
        { image: '/img/carousel/5.png' }
      ],
      products: Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        thumbnail: `https://source.unsplash.com/random/200x200?product-${i}`,
        price: (Math.random() * 500 + 50).toFixed(2),
        merchant: `商家${String.fromCharCode(65 + i % 5)}`,
        sales: Math.floor(Math.random() * 1000)
      }))
    }
  },
  methods: {
    /** 切换到上一张轮播图 */
    prevSlide() {
      this.currentSlide = this.currentSlide === 0
        ? this.carouselItems.length - 1
        : this.currentSlide - 1
    },
    /** 切换到下一张轮播图 */
    nextSlide() {
      this.currentSlide = this.currentSlide === this.carouselItems.length - 1
        ? 0
        : this.currentSlide + 1
    }
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