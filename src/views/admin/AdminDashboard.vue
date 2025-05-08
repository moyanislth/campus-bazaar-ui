<template>
    <div class="dashboard-container">
        <!-- 统计卡片区域 -->
        <el-row :gutter="20" class="mb-8">
            <el-col :span="6">
                <el-card class="stat-card" shadow="hover">
                    <div class="stat-title">注册用户</div>
                    <div class="stat-value">1,234</div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="stat-card" shadow="hover">
                    <div class="stat-title">待审商品</div>
                    <div class="stat-value">56</div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="stat-card" shadow="hover">
                    <div class="stat-title">今日交易</div>
                    <div class="stat-value">¥12,345</div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 快捷操作入口 -->
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card class="quick-action" shadow="hover">
                    <div class="action-title">用户管理</div>
                    <el-button type="primary" @click="$router.push('/admin/users')">立即前往</el-button>
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
    name: 'AdminDashboard'
}
</script>

<style scoped>
.dashboard-container {
    padding: 20px;
}

.stat-card {
    text-align: center;
}

.stat-title {
    color: #666;
    font-size: 14px;
}

.stat-value {
    font-size: 24px;
    margin-top: 10px;
}

.quick-action {
    text-align: center;
}

.action-title {
    margin-bottom: 15px;
    font-size: 16px;
}
</style>