<template>
  <div class="merchant-container">
    <!-- 侧边导航栏 -->
    <el-menu 
      :default-active="currentActive"
      class="side-menu"
      @select="handleMenuSelect">
      <el-menu-item index="1">
        <el-icon><Goods /></el-icon>
        <span>上架商品</span>
      </el-menu-item>
      <el-menu-item index="2">
        <el-icon><Box /></el-icon>
        <span>商品橱柜</span>
      </el-menu-item>
      <el-menu-item index="3">
        <el-icon><Package /></el-icon>
        <span>发货管理</span>
      </el-menu-item>
      
    </el-menu>

    <!-- 主内容区域 -->
    <div class="content-area">
      <component :is="currentView" />
    </div>
  </div>
</template>

<script>
import PublishGoods from '../../components/merchant/PublishGoods.vue';
import GoodsCabinet from '../../components/merchant/GoodsCabinet.vue';
import ShippingManagement from '../../components/merchant/ShippingManagement.vue';

/**
 * 商家主视图组件
 * 包含商品管理和橱柜展示功能
 */
export default {
  components: { PublishGoods, GoodsCabinet, ShippingManagement },
  
  data() {
    return {
      currentActive: '1',
      currentView: 'PublishGoods'
    }
  },

  methods: {
    /**
     * 处理菜单选择事件
     * @param {string} index - 选中菜单项的索引
     */
    handleMenuSelect(index) {
      this.currentActive = index;
      this.currentView = index === '1' 
        ? 'PublishGoods' 
        : 'GoodsCabinet';

        if (index === '2') {
          this.currentView = 'GoodsCabinet'; // 假设GoodsCabinet是一个新的组件
        }

        if (index === '3') {
          this.currentView = 'ShippingManagement'; // 假设ShippingManagement是一个新的组件
        }
        
    }
  }
}
</script>

<style scoped>
.merchant-container {
  display: flex;
  min-height: calc(100vh - 60px);
}

.side-menu {
  width: 200px;
  border-right: 1px solid #e6e6e6;
}

.content-area {
  flex: 1;
  padding: 20px;
}
</style>