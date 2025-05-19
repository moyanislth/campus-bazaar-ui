<template>
    <el-container class="admin-container">
        <!-- 侧边栏 -->
        <el-aside width="200px" class="admin-sidebar">
            <div class="sidebar-header">
                <h2>管理后台</h2>
            </div>
            <el-menu router :default-active="$route.path" background-color="#304156" text-color="#bfcbd9"
                active-text-color="#409EFF">
                <el-menu-item v-for="item in adminNavItems" :key="item.path" :index="item.path"
                    :route="{ path: item.path }">
                    <span slot="title">{{ item.title }}</span>
                </el-menu-item>
            </el-menu>
        </el-aside>

        <!-- 主内容区 -->
        <el-main class="admin-main">
            <el-breadcrumb separator="/" class="breadcrumb">
                <el-breadcrumb-item :to="{ path: '/admin' }">管理首页</el-breadcrumb-item>
                <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
                    {{ item.meta.title }}
                </el-breadcrumb-item>
            </el-breadcrumb>
            <router-view :userListData="userListData" :productsData="productsData" />
        </el-main>
    </el-container>
</template>

<script>
import { userAPI } from '@/api';

/**
 * 管理后台布局组件
 * 继承MainLayout的视觉风格，采用顶部导航布局
 */
export default {
    name: 'AdminLayout',
    /**
     * 组件创建生命周期钩子
     * 初始化时加载数据
     */
    async created() {
        await this.fetchData()
    },
    computed: {
        /**
         * 计算属性：生成面包屑导航数据
         * @returns {Array} 包含当前路由元信息的匹配记录数组
         */
        breadcrumbs() {
            return this.$route.matched.filter(
                route => route.meta && route.meta.title
            )
        }
    },
    // 移除冗余的watch监听
    // 数据更新已通过props传递到子组件
    data() {
        return {
            adminNavItems: [
                { title: '仪表盘', path: '/admin' },
                { title: '用户管理', path: '/admin/users' },
                { title: '商品管理', path: '/admin/products' },
                { title: '返回前台', path: '/' }
            ],
            userListData: [],
            productsData: []
        }
    },
    methods: {
        /**
         * 获取管理后台所需基础数据
         * 包括用户列表数据（已实现）和商品数据（待实现）
         */
        async fetchData() {
            try {
                const res = await userAPI.getAllUsers();
                // 修改后（使用新数组引用）
                this.userListData = [...res.data]; // 强制触发响应式更新
            } catch (error) {
                this.$message.error('用户数据获取失败');
            }
            // TODO: 商品数据获取
        }
    }
}
</script>

<style scoped>
.admin-container {
    height: 100vh;
}

.admin-sidebar {
    background-color: #304156;

    .sidebar-header {
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;

        h2 {
            color: #fff;
            margin: 0;
        }
    }
}

.admin-main {
    .breadcrumb {
        /deep/ .el-breadcrumb__item {
            &:first-child .el-breadcrumb__inner {
                font-weight: 600;
                color: #409EFF;
            }

            .el-breadcrumb__inner {
                font-size: 14px;
                transition: color 0.2s;

                &:hover {
                    color: #66b1ff;
                }
            }
        }
    }
}
</style>