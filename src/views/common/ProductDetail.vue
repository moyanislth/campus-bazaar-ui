<template>
    <div class="product-detail">
        <el-card class="detail-card">
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-carousel height="400px" arrow="always">
                        <el-carousel-item v-for="(img, index) in images" :key="index">
                            <el-image :src="getImageUrl(img)" fit="contain" style="width: 100%; height: 400px"
                                @click="handleImageClick(getImageUrl(img), index)">
                                <template #error>
                                    <div>图片加载失败</div>
                                </template>
                            </el-image>
                        </el-carousel-item>
                    </el-carousel>
                </el-col>
                <el-col :span="10">
                    <h2 class="product-name">{{ product.name }}</h2>
                    <div class="price-info">
                        <span class="original-price">原价：¥{{ product.originalPrice }}</span>
                        <span class="discount-price">现价：¥{{ product.discountPrice ===
                            null ? product.originalPrice : product.discountPrice
                        }}</span>
                    </div>
                    <div class="sales-info">已售 {{ product.nob }}件</div>
                    <div class="coupon-section">
                        <h4>可用优惠券</h4>
                        <el-tag v-for="coupon in coupons" :key="coupon.id" type="success" size="medium">
                            {{ coupon.amount }}元券（满{{ coupon.threshold }}可用）
                        </el-tag>
                    </div>
                    <div class="action-buttons">
                        <el-button type="primary" size="large" @click="addToCart">加入购物车</el-button>
                    </div>
                </el-col>
            </el-row>
            <el-row class="description-section">
                <el-col :span="24">
                    <h3>商品描述</h3>
                    <p>{{ product.description }}</p>
                </el-col>
            </el-row>
        </el-card>

        <!-- 图片查看器 -->
        <el-image-viewer v-if="viewerVisible" :url-list="images.map(img => getImageUrl(img))"
            :initial-index="currentIndex" @close="closeViewer" />
    </div>
</template>

<script>
import { goodsAPI } from '@/api';
import { ElImageViewer } from 'element-plus';

export default {
    name: 'ProductDetail',
    components: {
        ElImageViewer
    },
    mounted() {
        this.initData();
    },
    data() {
        return {
            userId: -1,
            productId: -1,
            product: {}, // 初始化为空对象避免访问属性时报错
            coupons: [],
            images: [],
            viewerVisible: false,  // 控制查看器显示
            currentIndex: 0        // 当前查看的图片索引
        };
    },
    methods: {
        // 打开图片查看器
        // 打开图片查看器（修正URL处理逻辑）
        openViewer(index) {
            this.currentIndex = index;
            this.viewerVisible = true;
        },

        // 关闭图片查看器
        closeViewer() {
            this.viewerVisible = false;
        },

        async initData() {
            try {
                this.productId = this.$route.params.id;
                const res = await goodsAPI.getProductById(this.productId);
                this.product = res.data?.product || {};
                this.images = res.data?.productImages || [];
            } catch (error) {
                console.error('获取商品详情失败:', error);
                this.$message.error('加载商品详情失败');
            }
        },

        detectImageType(buffer) {
            const header = new Uint8Array(buffer.slice(0, 4));
            if (header[0] === 0xFF && header[1] === 0xD8) return 'image/jpeg';
            if (header[0] === 0x89 && header[1] === 0x50) return 'image/png';
            return 'application/octet-stream';
        },
        // 处理图片点击事件（修正点击放大逻辑）
        handleImageClick(imgUrl, index) {
            // 获取当前点击图片的索引
            this.currentIndex = index;
            // 显示图片查看器
            this.openViewer(index);
        },
        // 获取图片URL
        getImageUrl(img) {
            const mimeType = this.detectImageType(img.imageData);
            return `data:${mimeType};base64,${img.imageData}`;
        },
        async initData() {
            const productId = this.$route.params.id;
            const json = JSON.parse(localStorage.getItem('userInfo'));
            this.userId = json.userId;


            try {
                // 初始化商品信息
                const res = await goodsAPI.getProductById(productId); // 直接获取响应对象
                // 假设后端返回结构为 { data: { product, productImages } }
                this.product = res.data.product;
                this.images = res.data.productImages;

                // TODO: 初始化优惠券信息
                // this.coupons = await goodsAPI.getCouponsByProductId(productId);

            } catch (error) {
                console.error('获取商品详情失败:', error);
            }
        },

        async addToCart() {
            try {
                // 调用添加购物车API，参数需与后端接口匹配
                await goodsAPI.addToCart({ productId: this.product.id, quantity: 1 });
                this.$message.success('已加入购物车');
            } catch (error) {
                this.$message.error('添加购物车失败');
            }
        }

    }
}
</script>

<style scoped>
.product-detail {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 2rem;
}

.detail-card {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 2rem;
}

.product-name {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: #333;
}

/* 图片轮播限制最大宽度 */
.el-carousel {
    max-width: 600px;
    margin: 0 auto;
}

/* 添加鼠标悬停效果 */
.el-image:hover {
    opacity: 0.9;
    transition: opacity 0.3s;
}


.price-info {
    margin: 1rem 0;
}

.original-price {
    color: #999;
    text-decoration: line-through;
    margin-right: 1rem;
}

.discount-price {
    color: #e4393c;
    font-size: 1.6rem;
    font-weight: bold;
}

.sales-info {
    color: #666;
    margin-bottom: 1rem;
}

.coupon-section {
    margin: 1.5rem 0;
}

.coupon-section h4 {
    color: #333;
    margin-bottom: 0.5rem;
}

.action-buttons {
    margin-top: 2rem;
}

.description-section {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #eee;
}
</style>