<template>
    <div class="user-management">
        <!-- 搜索和筛选区域 -->
        <el-card class="filter-card">
            <el-form :inline="true" label-width="80px" class="filter-form" :model="filterForm">
                <el-row :gutter="24">
                    <el-col :xs="24" :sm="12" :md="10" :lg="7">
                        <el-form-item label="用户搜索" class="form-item-extend">
                            <el-input v-model="searchKey" placeholder="用户名称/ID" clearable
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

        <!-- 表格区域 -->
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

                        <el-button type="info" link size="small" @click="showDetail(row)">
                            详情
                        </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <div class="pagination-container">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]" :background="true" layout="total, sizes, prev, pager, next"
                :total="total" @size-change="fetchUsers" @current-change="fetchUsers" />
        </div>
    </div>
</template>

<script>
import { userAPI } from '@/api'
import { Search } from '@element-plus/icons-vue'
import DateUtil from '@/utils/dateUtil.js';

export default {
    name: 'UserManagement',
    // 组件接收的用户列表数据（父组件传递）
    props: {
        userListData: {
            type: Array,
            required: true,
            default: () => [],
            description: '父组件传递的原始用户列表数据'
        }
    },

    mounted() {
        this.fetchUsers(); // 组件挂载时加载用户数据
    },

    // 监听用户数据变化，触发重新加载
    watch: {
        userListData: {
            handler() { this.fetchUsers() },
            deep: true // 保持深度监听
        }
    },

    // 组件状态管理
    data() {
        return {
            loading: false, // 加载状态
            searchKey: '', // 搜索关键字
            filterStatus: '', // 状态筛选条件
            currentPage: 1, // 当前页码
            pageSize: 10, // 每页显示数量
            total: 0, // 总数据量
            userList: [], // 实际显示的分页数据
        }
    },

    // 业务方法
    methods: {
        /**
         * 格式化原始数据并执行分页逻辑
         * @param {Array} data - 父组件传递的原始用户数据
         */
        paginateData(data) {
            // 格式化时间字段并筛选需要展示的字段
            const formattedData = data.map(user => ({
                id: user.id,
                username: user.username,
                phone: user.phone,
                registerTime: DateUtil.formatCN(user.createdAt),
                status: user.status
            }));

            // 更新总数据量
            this.total = formattedData.length;

            // 执行分页切片（当前页数据）
            this.userList = formattedData.slice(
                (this.currentPage - 1) * this.pageSize,
                this.currentPage * this.pageSize
            );
        },

        /**
         * 加载当前页用户数据（核心分页逻辑触发）
         */
        fetchUsers() {
            this.loading = true
            try {
                this.paginateData(this.userListData) // 调用格式化方法并更新数据
            } finally {
                this.loading = false
            }
        },
        /**
         * 处理每页显示数量变化
         * @param {number} val - 新的每页显示数量
         */
        handleSizeChange(val) {
            this.pageSize = val
            this.fetchUsers()
            this.$nextTick(() => this.$refs.userTable?.doLayout?.());
        },
        /**
         * 处理当前页码变化
         * @param {number} val - 新的当前页码
         */
        handleCurrentChange(val) {
            this.currentPage = val
            this.fetchUsers()
            this.$nextTick(() => this.$refs.userTable?.doLayout?.());
        },
        /**
         * 触发搜索操作（重置页码并重新加载数据）
         */
        handleSearch() {
            this.currentPage = 1
            this.fetchUsers()
            this.$nextTick(() => this.$refs.userTable?.doLayout?.());
        },
        /**
         * 重置搜索条件并触发搜索
         */
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
        /**
         * 处理用户通过审核操作
         * @param {string} id - 需要通过审核的用户ID
         */
        handleApprove(id) {
            this.$confirm('确定要通过该用户吗?', '提示', {
                type: 'warning'
            }).then(() => {
                userAPI.passUser(id)
                this.userListData = this.userListData.map(user => {
                    if (user.id === id) {
                        user.status = 1; // 更新状态为通过
                    }
                    return user;
                })
                this.$message.success('操作成功')
                this.fetchUsers()
            })
        },

        /**
         * 显示用户详细信息
         * @param {Object} row - 当前行的用户数据对象
         */
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