<template>
    <div class="product-view">
        <!-- 搜索排序栏 -->
        <div class="search-bar">
            <el-input v-model="searchQuery" placeholder="搜索商品名称..." class="search-input" clearable />
            <el-select v-model="sortBy" placeholder="排序方式" class="sort-select" @change="loadProducts">
                <el-option label="最新商品" value="newest" />
                <el-option label="销量最高" value="sales" />
                <el-option label="价格从低到高" value="price_asc" />
                <el-option label="价格从高到低" value="price_desc" />
            </el-select>
        </div>

        <!-- 商品列表 -->
        <div class="product-list">
            <div v-for="product in displayedProducts" :key="product.id" class="product-item">
                <img :src="product.thumbnail" class="product-image" />
                <div class="product-details">
                    <h3 class="product-name">{{ product.name }}</h3>
                    <div class="price-sales">
                        <span class="price">¥{{ product.price }}</span>
                        <span class="sales">已售 {{ product.sales }}</span>
                    </div>
                    <p class="description">{{ product.description }}</p>
                </div>
            </div>
            <div v-if="loading" class="loading">加载中...</div>
            <div v-if="!hasMore" class="no-more">没有更多商品了</div>
        </div>
    </div>
</template>

<script>
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
            // 模拟数据生成
            mockProducts: Array.from({ length: 50 }, (_, i) => ({
                id: i + 1,
                name: `商品 ${i + 1}`,
                price: (Math.random() * 500 + 50).toFixed(2),
                sales: Math.floor(Math.random() * 1000),
                thumbnail: 'img/index.jpg',
                description: '优质校园二手商品，物美价廉',
                createdAt: Date.now() - i * 100000
            }))
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
            // 模拟API请求延迟
            await new Promise(resolve => setTimeout(resolve, 500))

            // 实际应用中应替换为API调用
            let filtered = this.mockProducts
                .filter(p => p.name.includes(this.searchQuery))
                .sort((a, b) => {
                    switch (this.sortBy) {
                        case 'sales': return b.sales - a.sales
                        case 'price_asc': return a.price - b.price
                        case 'price_desc': return b.price - a.price
                        default: return b.createdAt - a.createdAt
                    }
                })

            this.products = filtered
            this.loading = false
        },

        /** 处理滚动事件 */
        handleScroll() {
            const { scrollTop, clientHeight, scrollHeight } = document.documentElement
            if (scrollTop + clientHeight >= scrollHeight - 100 && !this.loading && this.hasMore) {
                this.currentPage++
            }
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