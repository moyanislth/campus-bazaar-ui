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

                    <!-- 用户评论区域 -->
                    <div class="comments-section">
                        <h3 class="comments-title">用户评论 ({{ comments.length }})</h3>

                        <!-- 评论输入区域 -->
                        <div class="comment-input-area">
                            <el-input type="textarea" :rows="4" placeholder="请输入您的评论..." v-model="newComment"
                                class="comment-textarea" resize="none"></el-input>
                            <div class="comment-actions">
                                <el-button type="primary" @click="submitComment" :disabled="!newComment.trim()"
                                    class="submit-btn">发布评论</el-button>
                            </div>
                        </div>

                        <!-- 评论列表 -->
                        <div v-if="comments.length" class="comments-list">
                            <el-card v-for="comment in comments" :key="comment.id" class="comment-card" shadow="hover">
                                <div class="comment-header">
                                    <span class="user-name">{{ comment.userName }}</span>
                                    <span class="comment-time">{{ comment.createdAtStr }}</span>
                                </div>
                                <p class="comment-content">{{ comment.content }}</p>
                            </el-card>
                        </div>
                        <div v-else class="no-comments">
                            <el-empty description="暂无评论，快来发表你的看法吧~" :image-size="100"></el-empty>
                        </div>
                    </div>
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
            userName: '', // 存储用户名
            productId: -1,
            product: {}, // 初始化为空对象避免访问属性时报错
            coupons: [],
            images: [],
            viewerVisible: false,  // 控制查看器显示
            currentIndex: 0,       // 当前查看的图片索引
            newComment: '', // 存储新评论内容
            comments: []    // 存储所有评论
        };
    },
    methods: {
        submitComment() {
            // trim() 用于移除字符串两端的空白字符
            if (!this.newComment.trim()) return;

            const json = JSON.parse(localStorage.getItem('userInfo'));
            this.userName = json.username; // 从 localStorage 中获取用户名

            // 创建新评论对象
            const newCommentObj = {
                id: Date.now(), // 使用时间戳作为临时ID
                productId: this.productId,
                userId: this.userId,
                userName: this.userName, // 这里应该替换为实际用户名
                starRating: null,
                content: this.newComment,
                createdAt: new Date(),
                createdAtStr: new Date().toLocaleString() // 格式化当前时间
            };

            // 添加到评论列表
            this.comments.unshift(newCommentObj); // 新评论显示在最前面

            // 清空输入框
            this.newComment = '';

            // 将评论保存到服务器
            this.saveCommentToServer(newCommentObj);
        },
        saveCommentToServer(comment) {
            goodsAPI.addComment(comment)
        },
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
            this.productId = this.$route.params.id;
            const json = JSON.parse(localStorage.getItem('userInfo'));
            this.userId = json.userId;

            try {
                const [productRes, commentsRes] = await Promise.all([
                    goodsAPI.getProductById(this.productId),
                    goodsAPI.getCommentsByProductId(this.productId)
                ]);

                this.product = productRes.data?.product || {};
                this.images = productRes.data?.productImages || [];
                this.comments = commentsRes.data || []; // 初始化评论数据
                console.log(this.comments);

                // TODO: 初始化优惠券信息
                // this.coupons = await goodsAPI.getCouponsByProductId(productId);
            } catch (error) {
                console.error('获取商品详情失败:', error);
                this.$message.error('加载商品详情失败');
            }
        },

        async addToCart() {
            try {
                // 触发添加购物车事件
                this.$bus.emit('add-to-cart', {
                    id: this.product.id,
                    name: this.product.name,
                    price: this.product.discountPrice === null ? this.product.originalPrice : this.product.discountPrice,
                    quantity: 1
                });
                this.$message.success('已加入购物车');
            } catch (error) {
                this.$message.error('添加购物车失败');
            }
        }

    }
}
</script>

<style scoped>
/* 评论区域样式 */
.comments-section {
    margin-top: 40px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.comments-title {
    font-size: 18px;
    color: #333;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

/* 评论输入区域 */
.comment-input-area {
    margin-bottom: 30px;
    background: #fff;
    padding: 15px;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.comment-textarea {
    width: 100%;
    min-height: 120px;
    /* 固定高度 */
    max-height: 200px;
    margin-bottom: 15px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 10px;
    font-size: 14px;
}

.comment-textarea:focus {
    border-color: #409eff;
    outline: none;
}

.comment-actions {
    display: flex;
    justify-content: flex-end;
}

.submit-btn {
    padding: 10px 25px;
    font-size: 14px;
}

/* 评论列表样式 */
.comments-list {
    margin-top: 20px;
}

.comment-card {
    margin-bottom: 15px;
    transition: all 0.3s;
    border: none;
    border-radius: 6px;
}

.comment-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px dashed #eee;
}

.user-name {
    font-weight: 600;
    color: #333;
    font-size: 15px;
}

.comment-time {
    font-size: 12px;
    color: #999;
}

.comment-content {
    color: #555;
    line-height: 1.6;
    font-size: 14px;
    margin: 0;
    padding: 5px 0;
}

.no-comments {
    padding: 30px 0;
    text-align: center;
    color: #999;
}

/* 响应式调整 */
@media (max-width: 768px) {
    .comment-textarea {
        min-height: 100px;
    }

    .submit-btn {
        width: 100%;
    }
}

.user-name {
    font-weight: bold;
}

.user-name {
    font-weight: 600;
}



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