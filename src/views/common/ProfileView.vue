<template>
  <div class="profile-view">
    <!-- 用户信息卡片 -->
    <div class="user-card">
      <el-avatar :size="80" :src="user.avatar" class="user-avatar" />
      <h2 class="username">{{ user.username }}</h2>
      <p class="user-email">{{ user.email }}</p>

      <!-- 新增个人介绍 -->
      <div class="introduction-section">
        <h3>个人介绍</h3>
        <el-input v-model="user.introduction" type="textarea" :rows="3" placeholder="介绍一下自己..." />
      </div>

      <!-- 邮箱编辑 -->
      <div class="info-field">
        <h3>邮箱</h3>
        <el-input v-model="user.email" type="email" placeholder="请输入有效邮箱地址" />
      </div>

      <!-- 微信绑定 -->
      <div class="info-field">
        <h3>微信</h3>
        <el-input v-model="user.wechat" placeholder="请输入微信号" :maxlength="20" />
      </div>
      <div class="info-field">
        <h3>钱包管理</h3>
        <router-link to="/wallet">
          <el-button type="primary">
            查看钱包余额与交易记录
          </el-button>
        </router-link>
      </div>
    </div>

    <!-- 购物车展示 -->
    <div class="cart-section">
      <div>
        <h3>我的购物车</h3>
      </div>
      <el-card v-if="cart.cartItems.length">
        <router-link :to="{ name: 'ProductDetail', params: { id: item.id } }" class="cart-item"
          v-for="item in cart.cartItems" :key="item.id">
          <div class="cart-info-simple">
            <span class="product-name">{{ item.name }}</span>
            <span class="price">单价：¥{{ item.price }}</span>
            <div class="quantity-controls">
              <el-button size="small" type="primary" @click.stop.prevent="handleDecrease(item)">-</el-button>
              <span class="quantity">数量：{{ item.quantity }}</span>
              <el-button size="small" type="primary" @click.stop.prevent="handleIncrease(item)">+</el-button>
              <el-button size="small" type="danger" @click.stop.prevent="handleDelete(item)">删除</el-button>
            </div>
          </div>
        </router-link>
        <div class="total-price-section">
          <h3>总价：¥{{ cart.totalPrice }}</h3>
          <el-button type="primary" @click="showPaymentDialog()">立即支付</el-button>
        </div>
      </el-card>
      <el-card v-else style="align-content: center;">购物车为空，去挑选商品吧~</el-card>

    </div>

    <el-dialog title="选择支付方式" v-model="paymentDialogVisible" width="30%">
      <div class="payment-options" style="display: flex; gap: 15px; justify-content: center; padding: 20px;">
        <el-button type="info" @click="handlePayment('积分支付')">积分支付</el-button>
        <el-button type="success" @click="handlePayment('余额支付')">余额支付</el-button>
        <el-button type="primary" @click="handlePayment('微信支付')">微信支付</el-button>
      </div>
    </el-dialog>


    <div class="address-section">
      <!-- 新增地址管理 -->
      <div class="">
        <div class="section-header">
          <h3>收货地址</h3>
          <el-button type="primary" size="small" @click="openAddressEditor()">
            添加新地址
          </el-button>
        </div>

        <div class="address-list">
          <div v-for="address in user.addresses" :key="address.id" class="address-card"
            :class="{ 'default-address': address.isDefault }">
            <div class="address-content">
              <div class="address-info">
                <span class="tag" v-if="address.isDefault">默认</span>
                <p>{{ address.name }} {{ address.phone }}</p>
                <p>{{ address.address }}</p>
              </div>
              <div class="address-actions">
                <el-button link @click="openAddressEditor(address)">编辑</el-button>
                <el-button link @click="deleteAddress(address.id)">删除</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 地址编辑弹窗 -->
      <el-dialog v-model="showAddressDialog" title="地址管理">
        <div class="address-form">
          <div class="address-item">
            <el-input v-model="editingAddress.name" placeholder="地址名称" />
          </div>
          <div class="address-item">
            <el-input v-model="editingAddress.phone" placeholder="联系电话" />
          </div>
          <div class="address-item">
            <el-input v-model="editingAddress.address" placeholder="地址" />
          </div>
          <div class="address-item">
            <el-button type="primary" @click="saveAddress()">
              保存地址
            </el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { ElDialog } from 'element-plus'

export default {
  name: 'ProfileView',
  inject: ['cart'],
  mounted() {
    if (this.cart) {  // 检查购物车是否存在
      this.saveToLocalStorage()
    }
  },
  data() {
    return {
      paymentDialogVisible: false, // 控制支付对话框显示状态
      activeTab: null,  // 移除默认激活标签
      user: {
        username: '校园用户',
        email: 'user@campus.com',
        avatar: '/img/avatar-default.png',
        introduction: '这个人很懒，什么也没留下~',  // 新增个人介绍字段
        addresses: [  // 新增收货地址数据
          {
            id: 1,
            name: '张三',
            phone: '13800138000',
            address: 'XX大学3号宿舍楼201室',
            isDefault: true
          }
        ]
      },
      showAddressDialog: false,  // 地址编辑弹窗控制
      editingAddress: null  // 当前编辑地址
    }
  },
  methods: {
    // 显示支付对话框
    showPaymentDialog() {
      this.paymentDialogVisible = true;
      console.log('显示支付对话框')
      console.log(this.paymentDialogVisible)  // 调试用，查看购物车内容
    },
    // 处理支付方式选择
    handlePayment(type) {
      this.paymentDialogVisible = false;
      this.$message.success(`已选择${type}支付`);
    },
    /**
     * 更新购物车总价
     */
    updateTotalPrice() {
      // 计算总价时保留两位小数，避免浮点数精度问题
      this.cart.totalPrice = Math.round(this.cart.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 100) / 100;
    },
    /**
     * 保存购物车数据到localStorage
     */
    saveToLocalStorage() {
      this.updateTotalPrice();
      localStorage.setItem('campusBazaarCart', JSON.stringify(this.cart));
    },
    /**
     * 减少商品数量
     * @param {Object} item 当前商品对象
     */
    handleDecrease(item) {
      if (item.quantity <= 1) {
        this.handleDelete(item);
      }
      item.quantity--;
      this.saveToLocalStorage();
    },
    /**
     * 增加商品数量
     * @param {Object} item 当前商品对象
     */
    handleIncrease(item) {
      item.quantity++;
      this.saveToLocalStorage();
    },
    /**
     * 删除商品
     * @param {Object} item 当前商品对象
     */
    handleDelete(item) {
      const index = this.cart.cartItems.findIndex(i => i.id === item.id);
      if (index !== -1) {
        this.cart.cartItems.splice(index, 1);
        this.saveToLocalStorage();
      }
    },
    /** 打开地址编辑弹窗 */
    openAddressEditor(address = null) {
      this.editingAddress = address ? { ...address } : {
        name: '',
        phone: '',
        address: '',
        isDefault: false
      }
      this.showAddressDialog = true
    },

    /** 保存地址信息 */
    saveAddress() {
      if (this.editingAddress.id) {
        // 更新现有地址
        const index = this.user.addresses.findIndex(a => a.id === this.editingAddress.id)
        this.user.addresses.splice(index, 1, this.editingAddress)
      } else {
        // 新增地址
        this.user.addresses.push({
          ...this.editingAddress,
          id: Date.now()
        })
      }
      this.showAddressDialog = false
    },

    /** 删除地址 */
    deleteAddress(id) {
      this.user.addresses = this.user.addresses.filter(a => a.id !== id)
    }
  }

}
</script>

<style scoped>
.profile-view {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

/* 卡片通用样式 */
.user-card,
.cart-section,
.address-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.user-card {
  text-align: center;
  padding: 2rem;
}

.user-avatar {
  margin-bottom: 1rem;
}

.username {
  color: var(--text-dark);
  margin-bottom: 0.5rem;
}

.user-email {
  color: var(--text-light);
}

/* 信息字段通用样式 */
.info-field {
  margin: 1.5rem 0;
  text-align: left;
}

.info-field h3 {
  color: var(--text-dark);
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.el-input {
  width: 100%;
}

/* 分隔区域通用样式 */
.introduction-section {
  padding-top: 1.5rem;
  margin-top: 1.5rem;
  border-top: 1px solid #eee;
}

.total-price-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  margin-top: 1.5rem;
  border-top: 1px solid #eee;
}

/* 列表项通用样式 */
.item-list {
  display: grid;
  gap: 1.5rem;
}

.item-card,
.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: #f8f9fa;
  transition: background 0.2s;
  text-decoration: none;
  color: inherit;
}

.cart-item:hover,
.item-card:hover {
  background: #e9ecef;
  cursor: pointer;
}

.item-thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.item-info {
  flex: 1;
}

.item-info h3 {
  margin: 0;
  font-size: 1.1rem;
}

/* 价格通用样式 */
.price {
  color: var(--primary-color);
  font-weight: 600;
}

/* 购物车特定样式 */
.cart-info-simple {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.product-name {
  flex: 1;
  font-weight: 600;
  color: #333;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.95rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-controls .el-button {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.9rem;
}

.quantity-controls .el-button.primary {
  background: #409eff;
  border-color: #409eff;
}

.quantity-controls .el-button.danger {
  background: #f56c6c;
  border-color: #f56c6c;
}

.quantity-controls .quantity {
  color: #666;
  font-size: 0.9rem;
}

.total-price-section h3 {
  color: #222;
  margin: 0;
  text-align: right;
  font-size: 1.1rem;
  font-weight: 600;
  padding-top: 12px;

}
</style>