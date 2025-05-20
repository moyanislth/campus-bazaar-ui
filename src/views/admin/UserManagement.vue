<template>
    <div class="user-management">
        <!-- 用户详情面板 -->
        <div class="detail-panel" v-show="showDetailPanel">
            <div class="panel-header">
                <h3>{{ detailData.username || '用户详情' }}</h3>
                <el-icon class="close-icon" @click="showDetailPanel = false">
                    <Close />
                </el-icon>
            </div>
            <el-skeleton :loading="detailLoading" :rows="6" animated>
                <div class="panel-content">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-descriptions title="基本信息" :column="1" border>
                                <el-descriptions-item label="用户ID">{{ detailData.id || '-' }}</el-descriptions-item>
                                <el-descriptions-item label="用户名">{{ detailData.username || '-'
                                }}</el-descriptions-item>
                                <el-descriptions-item label="手机号">{{ detailData.phone || '-' }}</el-descriptions-item>
                                <el-descriptions-item label="电子邮箱">{{ detailData.email || '-' }}</el-descriptions-item>
                                <el-descriptions-item label="性别">{{ detailData.gender || '-' }}</el-descriptions-item>
                            </el-descriptions>
                        </el-col>
                        <el-col :span="12">
                            <el-descriptions title="账户信息" :column="1" border>
                                <el-descriptions-item label="角色类型">{{ detailData.role || '-' }}</el-descriptions-item>
                                <el-descriptions-item label="账户状态">{{ detailData.status || '-' }}</el-descriptions-item>
                                <el-descriptions-item label="所在城市">{{ detailData.city || '-' }}</el-descriptions-item>
                                <el-descriptions-item label="银行账户">{{ detailData.bankAccount || '-'
                                }}</el-descriptions-item>
                                <el-descriptions-item label="注册时间">{{ detailData.createTime || '-'
                                }}</el-descriptions-item>
                            </el-descriptions>
                        </el-col>
                    </el-row>
                </div>
            </el-skeleton>
        </div>
        <!-- 搜索和筛选区域 -->
        <el-card class="filter-card">
            <el-form :inline="true" label-width="80px" class="filter-form" :model="filterForm">
                <el-row :gutter="24">
                    <el-col :xs="24" :sm="12" :md="10" :lg="7">
                        <el-form-item label="用户搜索" class="form-item-extend">
                            <el-input v-model="filterForm.searchKey" placeholder="用户名称" clearable
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
                            <el-select v-model="filterForm.filterStatus" placeholder="全部用户" clearable
                                style="width: 100%" class="wide-dropdown">
                                <el-option label="待审核" value="0" />
                                <el-option label="已通过" value="1" />
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

                        <el-button type="info" link size="small" @click="showDetail(row.id)">
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
import { Search, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import DateUtil from '@/utils/dateUtil.js';

export default {
    name: 'UserManagement',
    components: { Search },
    mounted() {
        this.fetchUsers() // 页面加载时立即加载用户数据
    },
    // 组件状态管理
    data() {
        return {
            // 详情面板状态
            showDetailPanel: false,
            detailLoading: false,
            detailData: {
                id: '',
                username: '',
                role: '',
                status: '',
                phone: '',
                email: '',
                city: '',
                gender: '',
                bankAccount: '',
                createTime: '',

                // 当role值为1时，显示的额外字段
                license_img: '', // 新增字段：许可证图片
                id_card_img: '', // 新增字段：身份证图片
            },
            filterForm: {
                searchKey: '',
                filterStatus: ''
            },
            loading: false, // 加载状态
            currentPage: 1, // 当前页码
            pageSize: 10, // 每页显示数量
            total: 0, // 总数据量
            userList: [], // 实际显示的分页数据
        }
    },

    // 业务方法
    methods: {
        // 获取用户详情
        async showDetail(userId) {
            this.detailLoading = true;
            try {
                const response = await userAPI.getUser(userId);
                const data = response.data;
                this.detailData = {
                    id: data.id,
                    username: data.username,
                    phone: data.phone,
                    email: data.email,
                    gender: data.gender === 1 ? '男' : data.gender === 2 ? '女' : '未知',
                    role: data.role === 1 ? '商户' : data.role === 0 ? '普通用户' : data.role === 2 ? '管理员' : '未知角色',
                    status: data.status === 0 ? '待审核' : data.status === 1 ? '已通过' : data.status === 2 ? '已禁用' : '未知状态',
                    city: data.city,
                    bankAccount: data.bankAccount
                        .replace(/(\d{4})(\d+)(\d{4})/, (_, prefix, middle, suffix) => `${prefix} **** **** ${suffix}`)
                        .replace(/(\d{4})(?=\d)/g, '$1 '), // 格式化显示
                    createTime: DateUtil.formatCN(data.createdAt),
                };

                this.showDetailPanel = true;
            } catch (error) {
                ElMessage.error('详情加载失败');
            } finally {
                this.detailLoading = false;
            }
        },
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
        async fetchUsers() {
            this.loading = true
            try {
                const userListData = await userAPI.getAllUsers()
                this.paginateData(userListData.data) // 调用格式化方法并更新数据
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
            this.filterForm.searchKey = ''
            this.filterForm.filterStatus = ''
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
                    .then(() => {
                        this.fetchUsers() // 刷新数据
                    })
                this.$message.success('操作成功')
            })
        }
    }
}
</script>

<style scoped>
/* 详情面板样式 */
.detail-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 800px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    border-radius: 4px;
    z-index: 2000;

    .panel-header {
        padding: 15px 20px;
        border-bottom: 1px solid #ebeef5;
        display: flex;
        justify-content: space-between;
        align-items: center;

        h3 {
            margin: 0;
            color: #303133;
            font-size: 16px;
        }

        .close-icon {
            cursor: pointer;
            color: #909399;

            &:hover {
                color: #409eff;
            }
        }
    }

    .panel-content {
        padding: 20px;

        .detail-item {
            margin-bottom: 12px;

            label {
                color: #909399;
                margin-right: 10px;
            }
        }
    }
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.close-icon {
    cursor: pointer;
    padding: 5px;
    transition: color 0.3s;
}

.close-icon:hover {
    color: var(--el-color-primary);
}

.detail-item {
    margin-bottom: 15px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 4px;
}

detail-item label {
    color: #666;
    display: block;
    margin-bottom: 5px;
}

detail-item span {
    font-weight: 500;
    word-break: break-word;
}

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