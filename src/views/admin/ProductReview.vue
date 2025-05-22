<template>
    <div class="product-review">
        <!-- 商品详情面板 -->
        <div class="detail-panel" v-show="showDetailPanel">
            <el-dialog v-model="showDetailPanel" :show-close="false" width="860px" modal
                custom-class="product-detail-dialog" destroy-on-close>
                <template #header>
                    <div>
                        <h3>{{ '商品详情' }}</h3>
                    </div>
                </template>
                <el-skeleton :loading="detailLoading" :rows="6" animated>
                    <div class="panel-content">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-descriptions title="基本信息" :column="1" border>
                                    <el-descriptions-item label="商品ID">{{ detailData.id || '-' }}</el-descriptions-item>
                                    <el-descriptions-item label="发布商家">{{ detailData.merchant_name || '-'
                                    }}</el-descriptions-item>
                                    <el-descriptions-item label="商品名称">{{ detailData.name || '-'
                                    }}</el-descriptions-item>
                                    <el-descriptions-item label="分类">{{ detailData.category || '-'
                                    }}</el-descriptions-item>
                                    <el-descriptions-item label="价格">¥{{ detailData.price || '-'
                                    }}</el-descriptions-item>
                                </el-descriptions>
                            </el-col>
                            <el-col :span="12">
                                <el-descriptions title="补充信息" :column="1" border>
                                    <el-descriptions-item label="库存" class="desc-item">{{ detailData.stock || '-'
                                    }}</el-descriptions-item>
                                    <el-descriptions-item label="产品情况" class="desc-item">{{ detailData.condition || '-'
                                    }}</el-descriptions-item>
                                    <el-descriptions-item label="商品描述" class="desc-item">{{ detailData.description ||
                                        '-'
                                    }}</el-descriptions-item>
                                </el-descriptions>
                            </el-col>
                        </el-row>

                        <!-- 商品图片预览 -->
                        <div class="image-preview-group" v-if="detailData.images?.length">
                            <h4>商品图片</h4>
                            <div class="preview-container">
                                <el-image v-for="(img, index) in detailData.images" :key="index" :src="img" fit="cover"
                                    class="preview-image" :preview-src-list="detailData.images" :initial-index="index"
                                    hide-on-click-modal>
                                    <template #error>
                                        <div class="image-error">
                                            图片加载失败
                                        </div>
                                    </template>
                                </el-image>
                            </div>
                        </div>
                    </div>
                </el-skeleton>
            </el-dialog>
        </div>

        <!-- 图片预览对话框 -->
        <el-dialog v-model="imageDialogVisible" width="70%" title="商品图片预览" center>
            <div class="image-preview-container">
                <el-image :src="currentImage" fit="contain" style="max-width: 100%; max-height: 70vh"
                    :preview-src-list="[currentImage]">
                    <template #error>
                        <div class="image-error">
                            图片加载失败
                        </div>
                    </template>
                </el-image>
            </div>
        </el-dialog>

        <!-- 搜索 -->
        <el-card class="filter-card">
            <el-form :inline="true" label-width="80px" class="filter-form">
                <el-row :gutter="24">
                    <el-col :xs="24" :sm="12" :md="10" :lg="7">
                        <el-form-item label="商品搜索" class="form-item-extend">
                            <el-input v-model="filterForm.searchKey" placeholder="商品名称/ID" clearable
                                @keyup.enter.native="handleSearch" style="width: 100%">
                                <template #prefix>
                                    <el-icon>
                                        <Search />
                                    </el-icon>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="10" :lg="7">
                        <el-form-item label="审核状态" class="form-item-extend">
                            <el-select v-model="filterForm.filterStatus" placeholder="全部状态" clearable
                                class="wide-dropdown" style="width: 100%" @change="handleSearch">
                                <el-option label="待审核" value="0" />
                                <el-option label="已上架" value="1" />
                                <el-option label="已下架" value="2" />
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="24" :md="8" :lg="8">
                        <div class="form-actions">
                            <el-button type="primary" icon="Search" @click="handleSearch" class="search-btn">
                                <span class="btn-text">查询</span>
                            </el-button>
                            <el-button icon="Refresh" @click="resetSearch">重置</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>

        <el-table v-loading="loading" :data="productList" border style="width: 100%" class="mt-4" stripe
            :header-cell-style="{ background: '#f8f9fa', color: '#606266' }" :cell-style="{ padding: '12px 0' }">
            <el-table-column prop="id" label="商品ID" width="" align="center" />
            <el-table-column prop="name" label="商品名称" width="" align="center" />
            <el-table-column prop="merchant_name" label="发布商家" width="" align="center" />
            <el-table-column prop="price" label="价格" width="" align="center" />
            <el-table-column prop="status" label="审核状态" width="" align="center">
                <template #default="{ row }">
                    <el-tag :type="statusTagType(row.status)" size="small">
                        {{ statusText(row.status) }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center" fixed="right">
                <template #default="{ row }">
                    <div class="action-buttons">
                        <el-button v-if="row.status === 0" type="primary" link size="small" @click="handleApprove(row)">
                            通过
                        </el-button>
                        <el-button v-if="row.status != 2" type="danger" link size="small" @click="handleReject(row)">
                            下架
                        </el-button>
                        <el-button type="info" link size="small" @click="handleDetail(row)">
                            详情
                        </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination-container">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]" :background="true" layout="total, sizes, prev, pager, next"
                :total="total" @size-change="pageSizeChange" @current-change="fetchProducts" />
        </div>
    </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue';
import { goodsAPI } from '@/api';
import { ElMessage, ElDialog } from 'element-plus'

// 状态映射常量
const STATUS_MAP = {
    0: { text: '待审核', type: 'warning' },
    1: { text: '已上架', type: 'success' },
    2: { text: '已下架', type: 'danger' }
};

/**
 * 商品审核组件 - 重构版
 * 采用与用户管理一致的UI规范和数据加载模式
 */
export default {
    name: 'ProductReview',
    components: { Search },
    data() {
        return {
            // 图片预览相关状态
            imageDialogVisible: false,
            currentImage: '',

            // 详情面板状态
            showDetailPanel: false,
            detailLoading: false,
            detailData: {
                id: '',
                name: '',
                category: '',
                originalPrice: 0.00,  // 新增原价字段
                discountPrice: 0.00,  // 新增折扣价字段
                stock: 0,
                merchantId: '',
                merchant_name: '',
                status: 0,
                isBargain: false,
                condition: '',
                description: '',
                nob: 0,
                images: []
            },

            loading: false,
            filterForm: {
                searchKey: '', // 搜索关键词
                filterStatus: '' // 审核状态
            },
            currentPage: 1,
            pageSize: 10,
            total: 0,
            // 商品列表数据
            productList: []
        }
    },
    mounted() {
        this.fetchProducts();
    },
    methods: {
        detectImageType(buffer) {
            const header = new Uint8Array(buffer.slice(0, 4));
            if (header[0] === 0xFF && header[1] === 0xD8) return 'image/jpeg';
            if (header[0] === 0x89 && header[1] === 0x50) return 'image/png';
            return 'application/octet-stream';
        },
        /** 获取商品详情 */
        async showDetail(productId) {
            this.detailLoading = true;
            try {
                // 获取商品基本信息
                const response = await goodsAPI.getProductById(productId);
                const data = response.data;
                this.detailData = {
                    id: data.id,
                    name: data.name,
                    price: data.discountPrice == null ? data.originalPrice : data.discountPrice,
                    category: data.category,
                    stock: data.stock,
                    description: data.description,
                    statusText: this.statusText(data.review_status),
                    merchantId: data.merchantId,
                    isBargain: data.isBargain,
                    condition: data.condition,
                    nob: data.nob,
                };

                await goodsAPI.getMerchantName(this.detailData.merchantId).then(res => {
                    this.detailData.merchant_name = res.data;
                })

                // 获取商品图片信息
                const imageResponse = await goodsAPI.getProductImages(productId);
                // 转换图片数据为base64 URL格式
                this.detailData.images = imageResponse.data.map(img => {
                    const mimeType = this.detectImageType(img);
                    return `data:${mimeType};base64,${img}`;
                });

                this.showDetailPanel = true;
            } catch (error) {
                console.error('获取商品详情失败:', error);
                this.$message.error('获取详情失败');
            } finally {
                this.detailLoading = false;
            }
        },
        /**
         * 格式化原始数据并执行分页逻辑
         * @param {Array} data - 父组件传递的原始用户数据
         */
        paginateData(data) {
            const formattedData = (data || []).map(item => ({
                id: item.id,
                name: item.name,
                merchant_name: item.merchantName,
                price: item.discountPrice == null ? item.originalPrice : item.discountPrice,
                status: item.status
            }))

            // 更新总数据量
            this.total = formattedData.length || 0;
            if (this.total === 0) {
                this.$message.warning('暂无数据');
            }

            // 执行分页切片（当前页数据）
            this.productList = formattedData.slice(
                (this.currentPage - 1) * this.pageSize,
                this.currentPage * this.pageSize
            );
        },
        /** 获取商品数据 */
        async fetchProducts() {
            this.loading = true
            try {
                this.searchProducts();
            } finally {
                this.loading = false
            }
        },
        /**
         * 新建组合搜索方法
         * 根据搜索关键词和状态进行联合查询
         */
        async searchProducts() {
            try {
                this.loading = true;
                const params = {
                    keyword: this.filterForm.searchKey || '',
                    status: this.filterForm.filterStatus || ''
                };
                const res = await goodsAPI.searchProducts(params);
                this.paginateData(res.data); // 调用格式化方法并更新数据
            } catch (error) {
                ElMessage.error('搜索失败：' + error.message);
            } finally {
                this.loading = false;
            }
        },
        /** 处理搜索 */
        handleSearch() {
            this.currentPage = 1;
            this.fetchProducts();
        },
        pageSizeChange() {
            this.handleSearch();
        },

        /** 重置搜索条件 */
        resetSearch() {
            this.filterForm = {
                searchKey: '',
                filterStatus: ''
            }
            this.handleSearch();
        },

        /** 状态标签样式 */
        statusTagType(status) {
            return STATUS_MAP[status]?.type || '';
        },

        /** 状态文本映射 */
        statusText(status) {
            return STATUS_MAP[status]?.text || '未知状态';
        },

        /** 审核通过 */
        async handleApprove(row) {
            try {
                await this.$confirm('确定要通过该商品吗?', '提示', {
                    type: 'warning'
                });

                // 这里应该调用API而不是修改mockData
                await goodsAPI.approveProduct(row.id);
                this.$message.success('操作成功');
                this.fetchProducts();
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('审核通过失败:', error);
                    this.$message.error('操作失败');
                }
            }
        },

        /** 审核驳回 */
        async handleReject(row) {
            try {
                await this.$confirm('确定要驳回该商品吗?', '提示', {
                    type: 'warning'
                });

                // 这里应该调用API而不是修改mockData
                await goodsAPI.rejectProduct(row.id);
                this.$message.success('操作成功');
                this.fetchProducts();
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('审核驳回失败:', error);
                    this.$message.error('操作失败');
                }
            }
        },

        /** 查看详情 */
        handleDetail(row) {
            this.showDetail(row.id);
        }
    }
}
</script>

<style scoped>
.product-review {
    padding: 20px;
    border-right: 80px solid transparent;
}

.filter-card {
    margin-bottom: 20px;
    border: none;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.el-table {
    border-radius: 8px;
    overflow: hidden;
}

.el-table__header th {
    background-color: #f8f9fa !important;
    color: #606266;
}

.pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.search-btn {
    padding: 8px 16px;
}

.action-buttons {
    display: flex;
    gap: 8px;
    justify-content: center;
}

.wide-dropdown {
    min-width: 240px !important;
}

.image-preview-group {
    margin-top: 20px;
}

.preview-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
}

.preview-image {
    width: 120px;
    height: 120px;
    border-radius: 4px;
    object-fit: cover;
    cursor: pointer;
}

.image-error {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
    color: #999;
}
</style>