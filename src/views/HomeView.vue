<template>
  <div class="home-view">
    <h2>欢迎来到校园二手市场</h2>
    <p>在这里发现优质二手商品，开启绿色校园生活</p>
  </div>
</template>

<script>
/**
 * 首页视图组件
 * 展示平台欢迎信息和核心功能入口
 */
export default {
  name: 'HomeView'
}
</script>

<style scoped>
.home-view {
  text-align: center;
  padding: 2rem;
}

h2 {
  color: var(--text-dark);
  margin-bottom: 1rem;
}

p {
  color: var(--secondary-color);
  font-size: 1.1rem;
}
</style>