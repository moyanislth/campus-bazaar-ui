<template>
    <div class="product-review">
        <el-card class="filter-card">
            <el-form :inline="true" label-width="80px" class="filter-form">
                <el-row :gutter="24">
                    <el-col :xs="24" :sm="12" :md="10" :lg="7">
                        <el-form-item label="商品搜索" class="form-item-extend">
                            <el-input v-model="searchKey" placeholder="商品名称/ID" clearable
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
                            <el-select v-model="filterStatus" placeholder="全部状态" clearable class="wide-dropdown"
                                style="width: 100%">
                                <el-option label="待审核" value="0" />
                                <el-option label="已通过" value="1" />
                                <el-option label="已驳回" value="2" />
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
            <el-table-column prop="id" label="商品ID" width="140" align="center" />
            <el-table-column prop="title" label="商品名称" min-width="180" />
            <el-table-column prop="price" label="价格" width="160" align="center" />
            <el-table-column prop="status" label="审核状态" width="140" align="center">
                <template #default="{ row }">
                    <el-tag :type="statusTagType(row.status)" size="small">
                        {{ statusText(row.status) }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="240" align="center" fixed="right">
                <template #default="{ row }">
                    <div class="action-buttons">
                        <el-button type="primary" link size="small" @click="handleApprove(row)">
                            通过
                        </el-button>
                        <el-button type="danger" link size="small" @click="handleReject(row)">
                            驳回
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
                :total="total" @size-change="fetchProducts" @current-change="fetchProducts" />
        </div>
    </div>
</template>

<script>
/**
 * 商品审核组件 - 重构版
 * 采用与用户管理一致的UI规范和数据加载模式
 */
export default {
    name: 'ProductReview',
    data() {
        return {
            loading: false,
            searchKey: '',
            filterStatus: '',
            currentPage: 1,
            pageSize: 10,
            total: 0,
            productList: [],
            mockData: [
                {
                    id: 2001,
                    title: '二手笔记本电脑',
                    price: 2999,
                    status: 0,
                    createTime: '2024-03-01 10:00'
                }
            ]
        }
    },
    created() {
        this.fetchProducts()
    },
    methods: {
        /** 获取商品数据 */
        async fetchProducts() {
            this.loading = true
            try {
                await new Promise(resolve => setTimeout(resolve, 500))

                const filteredData = this.mockData.filter(item => {
                    const searchLower = this.searchKey.toLowerCase()
                    return (
                        String(item.id).includes(this.searchKey) ||
                        item.title.toLowerCase().includes(searchLower)
                    ) && (
                            this.filterStatus === '' ||
                            String(item.status) === this.filterStatus
                        )
                })

                this.total = filteredData.length
                this.productList = filteredData.slice(
                    (this.currentPage - 1) * this.pageSize,
                    this.currentPage * this.pageSize
                )
            } finally {
                this.loading = false
            }
        },

        /** 处理搜索 */
        handleSearch() {
            this.currentPage = 1
            this.fetchProducts()
        },

        /** 重置搜索条件 */
        resetSearch() {
            this.searchKey = ''
            this.filterStatus = ''
            this.handleSearch()
        },

        /** 状态标签样式 */
        statusTagType(status) {
            const map = { 0: 'warning', 1: 'success', 2: 'danger' }
            return map[status] || ''
        },

        /** 状态文本映射 */
        statusText(status) {
            const map = { 0: '待审核', 1: '已通过', 2: '已驳回' }
            return map[status] || '未知状态'
        },

        /** 审核通过 */
        handleApprove(row) {
            this.$confirm('确定要通过该商品吗?', '提示', {
                type: 'warning'
            }).then(() => {
                const index = this.mockData.findIndex(p => p.id === row.id)
                if (index !== -1) this.mockData[index].status = 1
                this.fetchProducts()
                this.$message.success('操作成功')
            })
        },

        /** 审核驳回 */
        handleReject(row) {
            this.$confirm('确定要驳回该商品吗?', '提示', {
                type: 'warning'
            }).then(() => {
                const index = this.mockData.findIndex(p => p.id === row.id)
                if (index !== -1) this.mockData[index].status = 2
                this.fetchProducts()
                this.$message.success('操作成功')
            })
        },

        /** 查看详情 */
        handleDetail(row) {
            this.$alert(
                `商品ID: ${row.id}<br>名称: ${row.title}<br>价格: ¥${row.price}<br>提交时间: ${row.createTime}`,
                '商品详情',
                { dangerouslyUseHTMLString: true }
            )
        }
    }
}
</script>

<style scoped>
.product-review {
    padding: 20px;
    background: #fff;
}

.filter-card {
    margin-bottom: 16px;
    border: 1px solid #e4e7ed;
}

.el-table {
    border: 1px solid #e4e7ed;
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

.action-buttons {
    display: flex;
    gap: 8px;
}

.wide-dropdown {
    min-width: 240px !important;
}
</style>