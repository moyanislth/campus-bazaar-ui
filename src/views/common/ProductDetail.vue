<template>
    <div class="product-detail">
        <el-card class="detail-card">
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-image :src="mainImageUrl" fit="contain" style="max-width: 100%; max-height: 400px"
                        :preview-src-list="[mainImageUrl]">
                        <template #error>
                            <div>图片加载失败</div>
                        </template>
                    </el-image>
                </el-col>
                <el-col :span="14">
                    <h2 class="product-name">{{ product.name }}</h2>
                    <div class="price-info">
                        <span class="original-price">原价：¥{{ product.originalPrice }}</span>
                        <span class="discount-price">现价：¥{{ product.discountPrice }}</span>
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
    </div>
</template>

<script>
import { goodsAPI } from '@/api';

export default {
    name: 'ProductDetail',
    data() {
        return {
            product: {},
            coupons: [],
            mainImageUrl: ''
        };
    },
    async created() {
        const productId = this.$route.params.id;
        try {
            const res = await goodsAPI.getProductById(productId);
            this.product = res.data;
            // 假设获取优惠券的API，实际需根据后端接口调整
            this.coupons = await goodsAPI.getCouponsByProductId(productId);
            // 处理主图
            if (this.product.productImages && this.product.productImages.length > 0) {
                const mainImage = this.product.productImages.find(img => img.isMain) || this.product.productImages[0];
                const mimeType = this.detectImageType(mainImage.imageData);
                this.mainImageUrl = `data:${mimeType};base64,${mainImage.imageData}`;
            }
        } catch (error) {
            console.error('获取商品详情失败:', error);
        }
    },
    methods: {
        detectImageType(buffer) {
            const header = new Uint8Array(buffer.slice(0, 4));
            if (header[0] === 0xFF && header[1] === 0xD8) return 'image/jpeg';
            if (header[0] === 0x89 && header[1] === 0x50) return 'image/png';
            return 'application/octet-stream';
        },
        async addToCart() {
            try {
                // 假设添加购物车的API，实际需根据后端接口调整
                await goodsAPI.addToCart({ productId: this.product.id, quantity: 1 });
                this.$message.success('已加入购物车');
            } catch (error) {
                this.$message.error('添加购物车失败');
            }
        }
    }
};
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