<template>
    <div class="dashboard-container">
        <!-- 统计卡片区域 -->
        <el-row :gutter="16" class="mb-8 vertical-stats">
            <el-col :xs="24" :sm="18" :md="12" :lg="10">
                <el-card class="stat-card" shadow="hover">
                    <div class="stat-title"><i class="el-icon-user"></i> 当前注册人数</div>
                    <div class="stat-value">{{ statsData.totalUsers }}</div>
                </el-card>
            </el-col>

            <el-col :xs="24" :sm="18" :md="12" :lg="10">
                <el-card class="stat-card" shadow="hover">
                    <div class="stat-title">待审核用户</div>
                    <div class="stat-value">{{ statsData.pendingUsers }}</div>
                </el-card>
            </el-col>

            <el-col :xs="24" :sm="18" :md="12" :lg="10">
                <el-card class="stat-card" shadow="hover">
                    <div class="stat-title">待审商品数</div>
                    <div class="stat-value">{{ statsData.pendingProducts }}</div>
                </el-card>
            </el-col>
        </el-row>

    </div>
</template>

<script>
/**
 * 管理仪表盘组件
 * 展示关键统计指标和快捷操作入口
 */
export default {
    name: 'AdminDashboard',
    created() {
        this.fetchDashboardStats()
    },
    methods: {
        /**
         * 获取仪表盘统计数据:
         * - 总用户数
         * - 待审核用户数
         * - 待审核商品数
         */
        async fetchDashboardStats() {
            try {
                const response = await this.$axios.get('/api/admin/dashboard-stats')
                this.statsData = {
                    totalUsers: response.data.total_users,
                    pendingUsers: response.data.pending_users,
                    pendingProducts: response.data.pending_products
                }
            } catch (error) {
                console.error('数据获取失败:', error)
                this.$message.error('统计数据加载失败')
            }
        }
    },
    data() {
        return {
            statsData: {
                totalUsers: 0,
                pendingUsers: 0,
                pendingProducts: 0
            }
        }
    }
}
</script>

<style scoped>
.dashboard-container {
    padding: 20px;
}

.stat-card {
    text-align: center;
    margin: 0 auto 16px;
    max-width: 400px;
    border-radius: 12px;
    transition: transform 0.2s;
}

.stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-title {
    color: #909399;
    font-size: 14px;
    letter-spacing: 1px;
}

.stat-value {
    font-size: 24px;
    margin: 12px 0;
}

.vertical-stats .el-col {
    margin-bottom: 16px;
}

.action-title {
    margin-bottom: 15px;
    font-size: 16px;
}
</style>