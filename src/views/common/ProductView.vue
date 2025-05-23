<template>
    <div class="product-view">
        <!-- 搜索排序栏 -->
        <div class="search-bar">
            <el-input v-model="searchQuery" placeholder="搜索商品名称..." class="search-input" clearable />
            <el-button type="primary" class="search-btn" @click="loadProducts">
                立即搜索
            </el-button>
            <el-select v-model="sortBy" placeholder="排序方式" class="sort-select" @change="loadProducts">
                <el-option label="最新商品" value="newest" />
                <el-option label="销量最高" value="sales" />
                <el-option label="价格从低到高" value="price_asc" />
                <el-option label="价格从高到低" value="price_desc" />
            </el-select>
        </div>

        <!-- 商品列表 -->
        <div class="product-list">
            <div v-for="product in displayedProducts" :key="product.product.id" class="product-item">
                <img :src="getMainImageUrl(product.productImages)" class="product-image" />
                <div class="product-details">
                    <h3 class="product-name">{{ product.product.name }}</h3>
                    <div class="price-sales">
                        <span class="price">¥{{ product.product.discountPrice == null ?
                            product.product.originalPrice : product.product.discountPrice }}</span>
                        <span class="sales">已售 {{ product.product.nob }}</span>
                    </div>
                    <p class="description">{{ product.product.description }}</p>
                </div>
            </div>
            <div v-if="loading" class="loading">加载中...</div>
            <div v-if="!hasMore" class="no-more">没有更多商品了</div>
        </div>
    </div>
</template>

<script>
import { goodsAPI } from '@/api';

/**
 * 商品展示视图组件
 * 实现商品搜索、排序和无限滚动加载功能
 */
export default {
    name: 'ProductView',
    data() {
        return {
            searchQuery: '',
            sortBy: 'newest',
            currentPage: 1,
            pageSize: 10,
            totalProducts: 50,
            loading: false,
            products: [],

        }
    },
    computed: {
        displayedProducts() {

            return this.products.slice(0, this.currentPage * this.pageSize)
        },
        hasMore() {
            return this.currentPage * this.pageSize < this.products.length
        }
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll)
        this.loadProducts()
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
        /** 加载商品数据 */
        async loadProducts() {
            this.loading = true

            let filtered = await goodsAPI.userSearch(this.searchQuery, this.sortBy)
            console.log("filtered") // 输出过滤后的商品数组，用于调试和检查过滤逻辑是否正确。
            console.log(filtered) // 输出过滤后的商品数组，用于调试和检查过滤逻辑是否正确。

            this.products = filtered.data

            this.loading = false
        },

        /** 处理滚动事件 */
        handleScroll() {
            const { scrollTop, clientHeight, scrollHeight } = document.documentElement
            if (scrollTop + clientHeight >= scrollHeight - 100 && !this.loading && this.hasMore) {
                this.currentPage++
            }
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
        }

    }
}
</script>

<style scoped>
.product-view {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.search-bar {
    display: flex;
    gap: 1rem;
    margin: 2rem auto;
    /* 添加居中效果 */
    max-width: 800px;
    /* 限制搜索栏最大宽度 */
}

.search-input {
    flex: 1;
}

.sort-select {
    width: 200px;
}

.product-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.product-item {
    display: flex;
    gap: 1.5rem;
    padding: 1.5rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
}

.product-item:hover {
    transform: translateY(-3px);
}

.product-image {
    width: 200px;
    height: 200px;
    border-radius: 8px;
    object-fit: cover;
}

.product-details {
    flex: 1;
}

.price-sales {
    display: flex;
    justify-content: space-between;
    margin: 1rem 0;
}

.price {
    color: #e4393c;
    font-size: 1.4rem;
    font-weight: 600;
}

.sales {
    color: #666;
}

.description {
    color: #999;
    line-height: 1.6;
}

.loading,
.no-more {
    text-align: center;
    padding: 2rem;
    color: #666;
}
</style>
