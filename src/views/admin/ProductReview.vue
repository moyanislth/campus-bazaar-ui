<template>
    <div class="product-review">
        <el-card class="filter-card">
            <el-form :inline="true">
                <el-form-item label="商品搜索">
                    <el-input v-model="searchKey" placeholder="商品名称/ID" />
                </el-form-item>
                <el-form-item label="审核状态">
                    <el-select v-model="filterStatus">
                        <el-option label="全部" value="" />
                        <el-option label="待审核" value="0" />
                        <el-option label="已通过" value="1" />
                        <el-option label="已驳回" value="2" />
                    </el-select>
                </el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
            </el-form>
        </el-card>

        <el-table :data="productList" border style="width: 100%" class="mt-4">
            <el-table-column prop="id" label="商品ID" width="120" />
            <el-table-column prop="title" label="商品名称" />
            <el-table-column prop="price" label="价格" width="120" />
            <el-table-column prop="status" label="审核状态" width="120">
                <template #default="{ row }">
                    <el-tag :type="statusTagType(row.status)">
                        {{ statusText(row.status) }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="220">
                <template #default="{ row }">
                    <el-button size="small" type="success" @click="handleApprove(row)">通过</el-button>
                    <el-button size="small" type="danger" @click="handleReject(row)">驳回</el-button>
                    <el-button size="small" @click="handleDetail(row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
/**
 * 商品审核组件
 * 实现待审商品列表展示和审核操作
 */
export default {
    name: 'ProductReview',
    data() {
        return {
            searchKey: '',
            filterStatus: '',
            productList: [
                // 模拟数据
                {
                    id: 2001,
                    title: '二手笔记本电脑',
                    price: 2999,
                    status: 0
                }
            ]
        }
    },
    methods: {
        /**
         * 处理搜索操作
         */
        handleSearch() {
            // TODO: 实现搜索逻辑
        },
        /**
         * 状态标签样式映射
         * @param {number} status - 审核状态码
         */
        statusTagType(status) {
            const map = { 0: 'warning', 1: 'success', 2: 'danger' }
            return map[status] || ''
        },
        /**
         * 状态文本映射
         * @param {number} status - 审核状态码
         */
        statusText(status) {
            const map = { 0: '待审核', 1: '已通过', 2: '已驳回' }
            return map[status] || '未知状态'
        },
        /**
         * 处理审核通过
         * @param {Object} row - 当前商品数据
         */
        handleApprove(row) {
            // TODO: 实现通过逻辑
        },
        /**
         * 处理审核驳回
         * @param {Object} row - 当前商品数据
         */
        handleReject(row) {
            // TODO: 实现驳回逻辑
        },
        /**
         * 查看商品详情
         * @param {Object} row - 当前商品数据
         */
        handleDetail(row) {
            // TODO: 实现详情查看
        }
    }
}
</script>

<style scoped>
.product-review {
    padding: 20px;
}

.filter-card {
    margin-bottom: 20px;
}
</style>