<template>
    <div class="user-management">
        <!-- 用户详情面板 -->
        <div class="detail-panel" v-show="showDetailPanel">
            <el-dialog v-model="showDetailPanel" :show-close="false" width="860px" modal
                custom-class="user-detail-dialog" destroy-on-close>
                <template #header>
                    <div>
                        <h3>{{ '用户详情' }}</h3>
                    </div>
                </template>
                <el-skeleton :loading="detailLoading" :rows="6" animated>
                    <div class="panel-content">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-descriptions title="基本信息" :column="1" border>
                                    <el-descriptions-item label="用户ID">{{ detailData.id || '-' }}</el-descriptions-item>
                                    <el-descriptions-item label="用户名">{{ detailData.username || '-'
                                    }}</el-descriptions-item>
                                    <el-descriptions-item label="手机号">{{ detailData.phone || '-'
                                    }}</el-descriptions-item>
                                    <el-descriptions-item label="电子邮箱">{{ detailData.email || '-'
                                    }}</el-descriptions-item>
                                    <el-descriptions-item label="性别">{{ detailData.gender || '-'
                                    }}</el-descriptions-item>
                                </el-descriptions>
                            </el-col>
                            <el-col :span="12">
                                <el-descriptions title="账户信息" :column="1" border>
                                    <el-descriptions-item label="角色类型">{{ detailData.role || '-' }}
                                    </el-descriptions-item>
                                    <el-descriptions-item label="账户状态">{{ detailData.status || '-' }}
                                    </el-descriptions-item>
                                    <el-descriptions-item label="所在城市">{{ detailData.city || '-' }}
                                    </el-descriptions-item>
                                    <el-descriptions-item label="银行账户">{{ detailData.bankAccount || '-' }}
                                    </el-descriptions-item>
                                    <el-descriptions-item label="注册时间">{{ detailData.createTime || '-' }}
                                    </el-descriptions-item>

                                    <!-- 商户证件信息 -->
                                    <el-descriptions-item v-if="detailData.role === '商户'" label="证件信息">
                                        <div class="cert-buttons">
                                            <el-button type="primary" link @click="viewLicenseImg">
                                                <el-icon>
                                                    <Picture />
                                                </el-icon>
                                                查看许可证
                                            </el-button>
                                            <el-button type="primary" link @click="viewIdCardImg">
                                                <el-icon>
                                                    <Picture />
                                                </el-icon>
                                                查看身份证
                                            </el-button>
                                        </div>
                                    </el-descriptions-item>

                                </el-descriptions>
                            </el-col>
                        </el-row>
                    </div>
                </el-skeleton>
            </el-dialog>
        </div>

        <el-dialog v-model="imageDialogVisible" width="70%" title="证件预览" center>
            <!-- 新增图片容器 -->
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

        <!-- 搜索和筛选区域 -->
        <el-card class="filter-card" shadow="never">
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
                                <el-option label="已封禁" value="2" />
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
        <el-table v-loading="loading" :data="userList" border style="width: 100%" class="data-table" stripe
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

                        <el-button v-if="row.status === 2" type="primary" link size="small"
                            @click="handleApprove(row.id)">
                            解封
                        </el-button>

                        <el-button v-if="row.status != 2" type="danger" link size="small" @click="handleReject(row.id)">
                            封禁
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
import { Search, Picture } from '@element-plus/icons-vue'
import { ElMessage, ElDialog } from 'element-plus'
import DateUtil from '@/utils/dateUtil.js';

export default {
    name: 'UserManagement',
    components: { Search, Picture, ElDialog },
    mounted() {
        this.fetchUsers() // 页面加载时立即加载用户数据
    },

    beforeUnmount() {
        clearTimeout(this.errorCooldown);
    },
    // 组件状态管理
    data() {
        return {
            // 图片预览对话框状态
            imageDialogVisible: false,
            currentImage: '', // 当前显示的图片路径
            // 详情面板状态
            showDetailPanel: false,
            detailLoading: false,
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

                credentials: {
                    license: '',
                    idCard: ''
                }
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
        detectImageType(buffer) {
            const header = new Uint8Array(buffer.slice(0, 4));
            if (header[0] === 0xFF && header[1] === 0xD8) return 'image/jpeg';
            if (header[0] === 0x89 && header[1] === 0x50) return 'image/png';
            return 'application/octet-stream';
        },
        // 获取商户证件信息  
        async getCredentials(userId) {

            const response = await userAPI.getUserCredentials(userId);
            const data = response.data;


            // 直接更新credentials对象
            this.detailData.credentials = {
                license: `data:image/png;base64,${data.license}`,
                idCard: `data:image/png;base64,${data.idCard}`
            }

        },
        // 预览图片方法     
        previewImage(imageUrl) {

            if (!imageUrl) {
                ElMessage.warning('图片路径无效');
                return;
            }

            this.currentImage = imageUrl; // 设置当前显示的图片路径
            this.imageDialogVisible = true; // 显示对话框
        },

        // 查看证件方法
        viewLicenseImg() {
            if (this.detailData.credentials.license) {
                this.previewImage(this.detailData.credentials.license);
            } else {
                ElMessage.warning('许可证图片不可用');
            }
        },
        viewIdCardImg() {
            if (this.detailData.credentials.idCard) {
                this.previewImage(this.detailData.credentials.idCard);
            } else {
                ElMessage.warning('身份证图片不可用');
            }
        },
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
                    status: data.status === 0 ? '待审核' : data.status === 1 ? '已通过' : data.status === 2 ? '已封禁' : '未知状态',
                    city: data.city,
                    bankAccount: data.bankAccount
                        .replace(/(\d{4})(\d+)(\d{4})/, (_, prefix, middle, suffix) => `${prefix} **** **** ${suffix}`)
                        .replace(/(\d{4})(?=\d)/g, '$1 '), // 格式化显示
                    createTime: DateUtil.formatCN(data.createdAt),
                    credentials: {
                        license: data.license,
                        idCard: data.idCard
                    }
                };

                if (this.detailData.role === '商户') {
                    try {
                        await this.getCredentials(userId); // 获取商户证件信息
                    } catch (error) {
                        console.error('获取商户证件信息失败:', error);
                        // 设置默认图片占位
                        this.detailData.credentials = { license: '', idCard: '' }; // 重置证件信息
                    }
                }

                this.showDetailPanel = true;
            } catch (error) {
                console.error('获取用户详情失败:', error);
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
                this.currentPage * this.pageSize - 1
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
        /**
         * 处理用户搜索
         * 当搜索条件和状态均为默认值时查询全部用户
         */
        async handleSearch() {
            if (!this.filterForm.searchKey && !this.filterForm.filterStatus) {
                await this.fetchUsers();
            } else {
                await this.searchUsers();
            }
        },

        /**
         * 新建组合搜索方法
         * 根据搜索关键词和状态进行联合查询
         */
        async searchUsers() {
            try {
                this.loading = true;
                const params = {
                    page: this.currentPage,
                    pageSize: this.pageSize,
                    keyword: this.filterForm.searchKey || undefined,
                    status: this.filterForm.filterStatus || undefined
                };
                const res = await userAPI.searchUsers(params);
                this.userList = res.data.list;
                this.total = res.data.total;
            } catch (error) {
                ElMessage.error('搜索失败：' + error.message);
            } finally {
                this.loading = false;
            }
        },

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
            const map = { 0: '待审核', 1: '已通过', 2: '已封禁' }
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
                userAPI.updateUserStatusUser(id, 1)
                    .then(() => {
                        this.fetchUsers() // 刷新数据
                    })
                this.$message.success('操作成功')
            })
        },
        /**
         * 处理用户封禁操作
         * @param {string} id - 需要封禁的用户ID
         */
        handleReject(id) {
            this.$confirm('确定要封禁该用户吗?', '提示', {
                type: 'warning'
            }).then(() => {
                userAPI.updateUserStatusUser(id, 2)
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
/* 用户详情对话框样式 - 现代圆角设计 */
.user-detail-dialog {
    border-radius: 12px;

    /* 对话框头部内边距清零 */
    :deep(.el-dialog__header) {
        padding: 0;
    }

    /* 对话框内容区域内边距清零 */
    :deep(.el-dialog__body) {
        padding: 0;
    }
}

/* 面板内容区域 */
.panel-content {
    padding: 24px;
    flex: 1;
    overflow-y: auto;

    /* 小屏幕高度适配 */
    @media (max-height: 600px) {
        max-height: 60vh;
    }
}

/* 标题样式 */
h3 {
    margin: 0;
    color: var(--el-text-color-primary);
    font-size: var(--el-font-size-extra-large);
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
}

/* 描述列表样式 */
.el-descriptions {
    --el-descriptions-table-border: 1px solid var(--el-border-color-lighter);

    /* 背景透明 */
    :deep(.el-descriptions__body) {
        background: transparent;
    }

    /* 标签文字样式增强 */
    .el-descriptions-item__label {
        font-weight: 450;
        letter-spacing: -0.2px;
    }
}

/* 详情项样式 */
.detail-item {
    margin-bottom: 15px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 4px;

    /* 标签样式 */
    label {
        color: #666;
        display: block;
        margin-bottom: 5px;
    }

    /* 内容样式 */
    span {
        font-weight: 500;
        word-break: break-word;
    }
}

/* 用户管理主区域 */
.user-management {
    padding: 20px;
}

/* 筛选卡片样式 */
.filter-card {
    margin-bottom: 20px;
    border: none;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

/* 表格样式 */
.el-table {
    border-radius: 8px;
    overflow: hidden;

    /* 表头样式 */
    :deep(th.el-table__cell) {
        background-color: #f8f9fa !important;
    }

    /* 行悬停效果 */
    :deep(.el-table__row:hover td) {
        background-color: #f5f7fa !important;
    }

    /* 移除内边距 */
    :deep(.el-table__inner-wrapper::before) {
        display: none;
    }
}

/* 分页容器 */
.pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

/* 表单操作按钮区域 */
.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

/* 搜索按钮 */
.search-btn {
    padding: 8px 16px;
}

/* 宽下拉菜单 */
.wide-dropdown {
    min-width: 240px !important;
}

/* 扩展表单项 */
.form-item-extend :deep(.el-form-item__content) {
    flex: 1;
}

/* 证件查看按钮样式 */
.cert-buttons {
    display: flex;
    gap: 20px;
    padding: 8px 0;

    .el-button {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transition: color 0.2s;

        &:hover {
            color: var(--el-color-primary);
        }
    }
}

/* 图片样式 */
.fixed-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
    max-height: 600px;
}

.image-preview-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 580px;

    border-radius: 8px;
    overflow: hidden;
    padding: 20px;
}

.el-dialog__body {
    padding: 0 !important;
}

.image-error {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #f56c6c;
    padding: 20px;
}
</style>