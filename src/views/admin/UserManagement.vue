<template>
    <div class="user-management">
        <el-card class="filter-card">
            <el-form :inline="true">
                <el-form-item label="用户搜索">
                    <el-input v-model="searchKey" placeholder="ID/用户名" />
                </el-form-item>
                <el-form-item label="用户状态">
                    <el-select v-model="filterStatus">
                        <el-option label="全部" value="" />
                        <el-option label="待审核" value="0" />
                        <el-option label="已通过" value="1" />
                        <el-option label="已禁用" value="2" />
                    </el-select>
                </el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
            </el-form>
        </el-card>

        <el-table :data="userList" border style="width: 100%" class="mt-4">
            <el-table-column prop="id" label="用户ID" width="120" />
            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="registerTime" label="注册时间" width="180" />
            <el-table-column prop="status" label="状态" width="120">
                <template #default="{ row }">
                    <el-tag :type="statusTagType(row.status)">
                        {{ statusText(row.status) }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template #default="{ row }">
                    <el-button size="small" @click="handleReview(row)">审核</el-button>
                    <el-button size="small" type="danger" @click="handleDisable(row)">禁用</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
/**
 * 用户管理组件
 * 实现用户列表展示、状态筛选和审核功能
 */
export default {
    name: 'UserManagement',
    data() {
        return {
            searchKey: '',
            filterStatus: '',
            userList: [
                // 模拟数据
                {
                    id: 1001,
                    username: 'user1',
                    registerTime: '2024-03-01 10:00',
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
         * @param {number} status - 用户状态码
         */
        statusTagType(status) {
            const map = { 0: 'warning', 1: 'success', 2: 'danger' }
            return map[status] || ''
        },
        /**
         * 状态文本映射
         * @param {number} status - 用户状态码
         */
        statusText(status) {
            const map = { 0: '待审核', 1: '已通过', 2: '已禁用' }
            return map[status] || '未知状态'
        },
        /**
         * 处理用户审核
         * @param {Object} row - 当前用户数据
         */
        handleReview(row) {
            // TODO: 实现审核逻辑
        },
        /**
         * 处理用户禁用
         * @param {Object} row - 当前用户数据
         */
        handleDisable(row) {
            // TODO: 实现禁用逻辑
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
}
</style>