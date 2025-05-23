<template>
    <img src="/public/404.jpg" alt="404 NOT FOUND">
    <div>
        <p>
            页面将在<span>{{ time }}</span>秒后自动跳转首页，<br>
            您也可以点击这里跳转<a href="/">首页</a>
        </p>
    </div>
</template>

<script>


export default {
    name: '',
    components: {

    },
    // 定义属性
    data() {
        return {
            time: '10',
            time_end: null
        }
    },
    // 计算属性，会监听依赖属性值随之变化
    computed: {},
    // 监控data中的数据变化
    watch: {},
    // 方法集合
    methods: {
        GoIndex() {
            let _t = 9
            this.time_end = setInterval(() => {
                if (_t !== 0) {
                    this.time = _t--;
                } else {
                    this.$router.replace('/')
                    clearTimeout(this.time_end)
                    this.time_end = null
                }
            }, 1000)
        }
    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() {
        this.GoIndex()
    },
    // 生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    beforeCreate() { }, // 生命周期 - 创建之前
    beforeMount() { }, // 生命周期 - 挂载之前
    beforeUpdate() { }, // 生命周期 - 更新之前
    updated() { }, // 生命周期 - 更新之后
    beforeDestroy() { }, // 生命周期 - 销毁之前
    destroyed() {
        clearTimeout(this.time_end)
        this.time_end = null
    }, // 生命周期 - 销毁完成
    activated() { }, // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>

<style scoped>
/* 整体容器样式 */
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    padding: 2rem 1rem;
}

/* 404图片样式 */
img {
    max-width: 50%;
    /* 调整为较小的宽度 */
    height: auto;
    margin: 0 auto 2rem;
    /* 水平居中 */
}

/* 提示文字样式 */
p {
    font-size: 1.1rem;
    color: #333;
    text-align: center;
    line-height: 1.6;
}

/* 倒计时数字强调 */
span {
    color: #ff4d4f;
    font-weight: bold;
}

/* 首页链接样式 */
a {
    color: #1890ff;
    text-decoration: none;
    margin-left: 0.3rem;
}

/* 小屏幕响应式调整 */
@media (max-width: 768px) {
    img {
        max-width: 90%;
    }

    p {
        font-size: 1rem;
    }
}
</style>
