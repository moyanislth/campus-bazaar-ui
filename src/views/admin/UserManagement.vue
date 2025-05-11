<template>
    <div class="user-management">
        <el-card class="filter-card">
            <el-form :inline="true" label-width="80px" class="filter-form" :model="filterForm">
                <el-row :gutter="24">
                    <el-col :xs="24" :sm="12" :md="10" :lg="7">
                        <el-form-item label="搜索条件" class="form-item-extend">
                            <el-input v-model="searchKey" placeholder="用户名/手机号/ID" clearable
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
                        <el-form-item label="用户状态" class="form-item-extend">
                            <el-select v-model="filterStatus" placeholder="全部用户" clearable style="width: 100%"
                                class="wide-dropdown">
                                <el-option label=" 待审核" value="0" />
                                <el-option label="已通过" value="1" />
                                <el-option label="已禁用" value="2" />
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

        <el-table v-loading="loading" :data="userList" border style="width: 100%" class="mt-4" stripe
            :header-cell-style="{ background: '#f8f9fa', color: '#606266' }" :cell-style="{ padding: '12px 0' }">
            <el-table-column prop="id" label="用户ID" width="140" align="center" />
            <el-table-column prop="username" label="用户名" min-width="180" />
            <el-table-column prop="phone" label="手机号" width="160" align="center" />
            <el-table-column prop="registerTime" label="注册时间" width="200" align="center" sortable />
            <el-table-column prop="status" label="状态" width="140" align="center">
                <template #default="{ row }">
                    <el-tag :type="statusTagType(row.status)" size="small">
                        {{ statusText(row.status) }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="240" align="center" fixed="right">
                <template #default="{ row }">
                    <div class="action-buttons">
                        <el-button v-if="row.status === 0" type="primary" link size="small"
                            @click="handleApprove(row.id)">
                            通过
                        </el-button>
                        <el-button v-if="row.status === 1" type="danger" link size="small"
                            @click="handleDisable(row.id)">
                            禁用
                        </el-button>
                        <el-button type="info" link size="small" @click="showDetail(row)">
                            详情
                        </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination-container">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]" :background="true" layout="total, sizes, prev, pager, next"
                :total="total" @size-change="fetchUsers" @current-change="fetchUsers" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'UserManagement',
    created() {
        this.fetchUsers()
    },
    data() {
        return {
            loading: false,
            searchKey: '',
            filterStatus: '',
            currentPage: 1,
            pageSize: 10,
            total: 0,
            userList: [],
            mockData: [
                {
                    id: 1001,
                    username: '测试用户1',
                    phone: '13800138001',
                    registerTime: '2024-03-01 10:00',
                    status: 0
                },
                {
                    id: 1002,
                    username: '待审用户2',
                    phone: '13800138002',
                    registerTime: '2024-03-02 11:00',
                    status: 0
                },
                {
                    id: 1003,
                    username: '已通过用户',
                    phone: '13800138003',
                    registerTime: '2024-03-03 12:00',
                    status: 1
                },
                {
                    id: 1004,
                    username: '禁用用户',
                    phone: '13800138004',
                    registerTime: '2024-03-04 13:00',
                    status: 2
                }
            ]
        }
    },
    methods: {
        async fetchUsers() {
            this.loading = true
            try {
                // 模拟API请求延迟
                await new Promise(resolve => setTimeout(resolve, 500))

                const filteredData = this.mockData.filter(item => {
                    const searchLower = this.searchKey.toLowerCase()
                    return (
                        String(item.id).includes(this.searchKey) ||
                        item.username.toLowerCase().includes(searchLower) ||
                        item.phone.includes(this.searchKey)
                    ) && (
                            this.filterStatus === '' ||
                            String(item.status) === this.filterStatus
                        )
                })

                this.total = filteredData.length
                this.userList = filteredData.slice(
                    (this.currentPage - 1) * this.pageSize,
                    this.currentPage * this.pageSize
                )
            } finally {
                this.loading = false
            }
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.fetchUsers()
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.fetchUsers()
        },
        handleSearch() {
            this.currentPage = 1
            this.fetchUsers()
        },
        resetSearch() {
            this.searchKey = ''
            this.filterStatus = ''
            this.handleSearch()
        },
        statusTagType(status) {
            const map = { 0: 'warning', 1: 'success', 2: 'danger' }
            return map[status] || ''
        },
        statusText(status) {
            const map = { 0: '待审核', 1: '已通过', 2: '已禁用' }
            return map[status] || '未知状态'
        },
        handleApprove(id) {
            this.$confirm('确定要通过该用户吗?', '提示', {
                type: 'warning'
            }).then(() => {
                // 实际这里应该调用API
                const index = this.mockData.findIndex(user => user.id === id)
                if (index !== -1) {
                    this.mockData[index].status = 1
                }
                this.fetchUsers()
                this.$message.success('操作成功')
            })
        },
        handleDisable(id) {
            this.$confirm('确定要禁用该用户吗?', '提示', {
                type: 'warning'
            }).then(() => {
                // 实际这里应该调用API
                const index = this.mockData.findIndex(user => user.id === id)
                if (index !== -1) {
                    this.mockData[index].status = 2
                }
                this.fetchUsers()
                this.$message.success('操作成功')
            })
        },
        showDetail(row) {
            this.$alert(`用户ID: ${row.id}<br>用户名: ${row.username}<br>手机号: ${row.phone}<br>注册时间: ${row.registerTime}`,
                '用户详情', {
                dangerouslyUseHTMLString: true
            })
        }
    }
}
</script>

<style scoped>
.user-management {
    padding: 20px;

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

.el-table :deep(th.el-table__cell) {
    background-color: #f8f9fa !important;
}

.el-table :deep(.el-table__row:hover td) {
    background-color: #f5f7fa !important;
}

.pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.search-btn {
    padding: 8px 16px;
}

:deep(.el-table__inner-wrapper::before) {
    display: none;
}

.wide-dropdown {
    min-width: 240px !important;
}

.form-item-extend :deep(.el-form-item__content) {
    flex: 1;
}
</style>