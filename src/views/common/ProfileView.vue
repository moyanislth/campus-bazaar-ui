<template>
  <div class="profile-view">
    <!-- 用户信息卡片 -->
    <div class="user-card">
      <div class="user-header">
        <el-avatar :size="80" :src="user.avatar" class="user-avatar" />
        <div class="user-basic">
          <h2 class="username">{{ user.username }}</h2>
          <p class="user-email">{{ user.email }}</p>
          <p>角色：{{ user.role === 1 ? '商家' : user.role === 2 ? '管理员' : '普通用户' }} | 状态：{{ user.status === 1 ? '正常' : '禁用'
          }}
          </p>
        </div>
      </div>

      <!-- 基础信息 -->
      <div class="info-section">
        <h3>基础信息</h3>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="性别">{{ user.gender === 1 ? '男' : user.gender === 2 ? '女' : '未知'
          }}</el-descriptions-item>
          <el-descriptions-item label="城市">{{ user.city }}</el-descriptions-item>
          <el-descriptions-item label="注册时间">{{ dateUtil.formatCN(user.createdAt)
          }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ user.phone }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 个人介绍 -->
      <div class="info-section">
        <h3>个人介绍</h3>
        <el-input v-model="user.introduction" type="textarea" :rows="3" placeholder="介绍一下自己..." />
      </div>

      <!-- 账户信息 -->
      <div class="info-section">
        <h3>账户信息</h3>
        <el-card class="account-card" shadow="always">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="银行账号">{{ user.bankAccount }}</el-descriptions-item>
            <el-descriptions-item label="微信号">{{ user.wechat }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
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
    <el-dialog :title="currentPaymentType" v-model="pointsDialogVisible" width="400px">
      <div class="points-payment-content">
        <el-descriptions :column="1" border>
          <el-descriptions-item :label="currentPaymentType === '积分支付' ? '当前积分' : '当前余额'">
            <span class="points-value">{{ currentPaymentType === '积分支付' ? wallet.integral : wallet.balance }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="需支付金额">
            ¥{{ paymentAmount }}
          </el-descriptions-item>
        </el-descriptions>

        <div class="payment-actions">
          <el-button @click="pointsDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handlePointsPayment()" :disabled="paymentAmount === 0">
            确认支付
          </el-button>
        </div>
      </div>
    </el-dialog>


    <div class="address-section">
      <!-- 新增地址管理 -->
      <div class="address-container">
        <div class="section-header"
          style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="font-size: 18px; color: #333;">收货地址</h3>
          <el-button type="primary" size="small" @click="openAddressEditor()"
            style="padding: 8px 16px; border-radius: 6px;">
            添加新地址
          </el-button>
        </div>

        <div class="address-list" style="display: grid; gap: 16px;">
          <div v-for="address in user.addresses" :key="address.id" class="address-card"
            :class="{ 'default-address': address.isDefault }"
            style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <div class="address-content" style="display: flex; justify-content: space-between; align-items: center;">
              <div class="address-info">
                <span class="tag" v-if="address.isDefault"
                  style="background: #409eff; color: white; padding: 2px 8px; border-radius: 4px; margin-bottom: 8px;">默认</span>
                <p style="font-size: 16px; color: #444; margin: 4px 0;">{{ address.name }}</p>
                <p style="font-size: 16px; color: #444; margin: 4px 0;">联系电话：{{ address.phone }}</p>
                <p style="font-size: 14px; color: #666; margin: 4px 0;">详细地址：{{ address.address }}</p>
              </div>
              <div class="address-actions" style="display: flex; gap: 12px;">
                <el-button link @click="openAddressEditor(address)"
                  style="color: #409eff; font-size: 14px;">编辑</el-button>
                <el-button link @click="deleteAddress(address.name)"
                  style="color: #f56c6c; font-size: 14px;">删除</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 地址编辑弹窗 -->
      <el-dialog v-model="showAddressDialog" title="地址管理" :close-on-click-modal="false"
        style="--el-dialog-width: 480px; --el-dialog-padding-primary: 24px;">
        <div class="address-form" style="display: grid; gap: 16px;">
          <div class="address-item">
            <el-input v-model="editingAddress.name" placeholder="请输入地址名称（如：家庭地址）"
              style="--el-input-border-radius: 6px; --el-input-height: 40px;">
            </el-input>
          </div>
          <div class="address-item">
            <el-input v-model="editingAddress.phone" placeholder="请输入联系人电话"
              style="--el-input-border-radius: 6px; --el-input-height: 40px;">
            </el-input>
          </div>
          <div class="address-item">
            <el-input v-model="editingAddress.address" placeholder="请输入详细收货地址"
              style="--el-input-border-radius: 6px; --el-input-height: 40px;">
            </el-input>
          </div>
          <div class="address-item">
            <el-checkbox v-model="editingAddress.isDefault" style="font-size: 14px; color: #666;">设为默认地址</el-checkbox>
          </div>
          <div class="address-item" style="margin-top: 8px;">
            <el-button type="primary" @click="saveAddress()" style="width: 100%; padding: 10px; border-radius: 6px;">
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
import { userAPI } from '@/api'
import DateUtil from '@/utils/dateUtil.js';

export default {
  name: 'ProfileView',
  inject: ['cart'],
  mounted() {
    if (this.cart) {  // 检查购物车是否存在
      this.saveToLocalStorage()
    }
    this.initData()
  },
  computed: {
    dateUtil() {
      return DateUtil; // 暴露自定义DateUtil实例到模板
    }
  },
  data() {
    return {
      currentPaymentType: '', // 当前选择的支付类型
      paymentDialogVisible: false, // 控制支付对话框显示状态
      activeTab: null,  // 移除默认激活标签
      user: {
        userId: '',
        username: '',
        email: '',
        avatar: '',
        introduction: '',  // 个人介绍字段
        bankAccount: '',
        city: '',
        createdAt: '',
        gender: null,
        phone: '',
        role: '',
        status: '',
        addresses: [

        ]
      },
      showAddressDialog: false,  // 地址编辑弹窗控制
      editingAddress: null, // 当前编辑地址
      pointsDialogVisible: false, // 新增积分弹窗控制
      wallet: {  // 钱包信息
        balance: -1,  // 余额
        integral: -1,     // 积分
      },
      paymentAmount: 0            // 支付金额
    }
  },
  methods: {
    async initData() {

      const json = JSON.parse(localStorage.getItem("userInfo"));
      const userId = json?.userId;
      if (!userId) throw new Error('用户ID未找到');

      const res = await userAPI.getUser(userId);
      this.user = res.data; // 正确赋值用户信息
      this.user.userId = userId; // 用户ID

      const user_profile = await userAPI.getUserProfile(userId);
      this.user.introduction = user_profile.data.bio; // 个人介绍
      // 处理字符串类型的地址数据（支持数组格式或单个地址）
      this.handleAddress(user_profile)
      // 地址列表
      this.user.wechat = user_profile.data.wechat; // 微信

    },
    /**
 * 处理用户地址数据，统一转换为标准格式的地址数组
 * @param {Object} user_profile 用户资料对象
 */
    handleAddress(user_profile) {
      const deliveryAddress = user_profile.data.deliveryAddress;
      console.log('原始地址数据:', deliveryAddress);

      try {
        // 初始化最终地址数组
        this.user.addresses = [];

        // 1. 处理空地址情况
        if (!deliveryAddress || deliveryAddress.trim() === '') {
          console.warn('地址数据为空');
          return;
        }

        // 2. 尝试解析为数组格式（处理非标准JSON）
        if (typeof deliveryAddress === 'string' &&
          deliveryAddress.trim().startsWith('[') &&
          deliveryAddress.trim().endsWith(']')) {

          // 特殊处理：将类似 {name=默认地址} 的格式转换为标准JSON
          const standardized = deliveryAddress
            .trim()
            // 处理键值对中的等号
            .replace(/([a-zA-Z0-9_]+)\s*=/g, '"$1":')
            // 处理无引号的键名
            .replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3')
            // 处理无引号的字符串值
            .replace(/:\s*([^"{\[\d][^,}\]\s]*)([,\]}])/g, ':"$1"$2')
            // 处理布尔值
            .replace(/:true/g, ':true')
            .replace(/:false/g, ':false');

          try {
            const parsedArray = JSON.parse(standardized);
            this.user.addresses = parsedArray.map(item => this._formatAddressItem(item));
          } catch (parseError) {
            console.error('标准解析失败，尝试替代方案:', parseError);
            // 替代方案：手动分割数组元素
            const arrayContent = deliveryAddress.trim().slice(1, -1);
            const items = arrayContent.split('},{').map(item =>
              item.startsWith('{') ? item : `{${item}}`
            );

            this.user.addresses = items.map(item => {
              try {
                const objStr = item
                  .replace(/([a-zA-Z0-9_]+)\s*=/g, '"$1":')
                  .replace(/'/g, '"');
                return this._formatAddressItem(JSON.parse(objStr));
              } catch (e) {
                console.warn('地址项解析失败:', item);
                return this._formatSingleAddress(item);
              }
            });
          }
        } else {
          // 处理单地址情况
          this.user.addresses = [this._formatSingleAddress(deliveryAddress)];
        }

        // 确保至少有一个默认地址
        this._ensureDefaultAddress();

        console.log('处理后的地址数据:', this.user.addresses);
      } catch (e) {
        console.error('地址处理发生错误:', e);
        // 出错时提供默认地址
        this.user.addresses = [this._formatSingleAddress(deliveryAddress)];
      }
    },

    /**
     * 格式化地址项为标准结构
     * @param {Object|string} item 地址项
     * @returns {Object} 标准格式地址
     */
    _formatAddressItem(item) {
      // 处理字符串形式的对象（如 "{name=张三}"）
      if (typeof item === 'string') {
        try {
          const str = item.trim();
          if (str.startsWith('{') && str.endsWith('}')) {
            const objStr = str.slice(1, -1)
              .replace(/([a-zA-Z0-9_]+)\s*=/g, '"$1":')
              .replace(/'/g, '"');
            item = JSON.parse(`{${objStr}}`);
          }
        } catch (e) {
          console.warn('地址项解析失败，使用原始字符串:', item);
          item = { address: item };
        }
      }

      return {
        name: item.name ? String(item.name) : '未命名地址',
        phone: item.phone ? String(item.phone) : (this.user.phone ? String(this.user.phone) : ''),
        address: item.address ? String(item.address) : '',
        isDefault: Boolean(item.isDefault)
      };
    },

    /**
     * 格式化单个地址项
     */
    _formatSingleAddress(addressItem) {
      if (typeof addressItem === 'object' && addressItem !== null) {
        return this._formatAddressItem(addressItem);
      }

      return {
        name: '默认地址',
        phone: this.user.phone ? String(this.user.phone) : '',
        address: String(addressItem),
        isDefault: true
      };
    },

    /**
     * 确保至少有一个默认地址
     */
    _ensureDefaultAddress() {
      if (this.user.addresses.length === 0) return;

      const hasDefault = this.user.addresses.some(addr => addr.isDefault);
      if (!hasDefault) {
        this.user.addresses[0].isDefault = true;
      }
    },
    // 显示支付对话框
    async showPaymentDialog() {
      this.paymentDialogVisible = true;

      const json = JSON.parse(localStorage.getItem("userInfo"))
      const userId = json.userId;

      const walletRes = await userAPI.getWalletInfo(userId);
      this.wallet = walletRes.data; // 正确赋值钱包信息

    },
    // 处理支付方式选择
    async handlePayment(type) {
      this.currentPaymentType = type // 设置当前支付类型
      this.pointsDialogVisible = true
      this.paymentAmount = this.cart.totalPrice

      const userId = JSON.parse(localStorage.getItem('userInfo'))?.userId;
      const res = await userAPI.pay(userId, this.currentPaymentType, this.paymentAmount)
      console.log(this.userId)
      console.log(res)
      if (res.data.code === 200) {
        this.$message.success('支付成功！')
      } else {
        this.$message.error('支付失败！')
        console.log(res.data)
      }
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
        name: null, // 默认地址名称
        phone: this.user.phone, // 自动填充用户联系电话
        address: null,
        isDefault: false // 默认非默认地址
      }
      this.showAddressDialog = true
    },

    // 保存地址（新增/编辑）
    saveAddress() {
      if (!this.editingAddress.name || !this.editingAddress.phone || !this.editingAddress.address || this.editingAddress.address === null || this.editingAddress.phone === null || this.editingAddress.name === null) {
        this.$message.warning('请填写完整地址信息');
        return;
      }

      // 处理默认地址唯一性（修正逻辑确保旧默认被取消）
      if (this.editingAddress.isDefault) {
        // 1. 先将所有地址的默认状态设为false
        this.user.addresses.forEach(addr => addr.isDefault = false);
        // 2. 再将当前地址设为默认（确保唯一性）
        this.editingAddress.isDefault = true;
      }

      // 根据地址ID查找是否已存在（使用唯一ID替代名称）
      const existingIndex = this.user.addresses.findIndex(addr => addr.id === this.editingAddress.id);
      if (existingIndex !== -1) {
        // 存在相同ID地址，执行更新（覆盖原数据）
        this.user.addresses.splice(existingIndex, 1, this.editingAddress);
      } else {
        // 不存在相同ID地址，生成唯一ID并添加新地址
        this.editingAddress.id = this.editingAddress.id || Date.now(); // 兼容编辑时已有ID的情况
        this.user.addresses.push(this.editingAddress);
      }

      this.showAddressDialog = false;
      // 默认地址自动置顶：将默认地址排在数组最前面
      this.user.addresses.sort((a, b) => b.isDefault - a.isDefault);


      // 异步保存到后端并刷新数据（确保前后端同步）
      const originalAddresses = [...this.user.addresses]; // 保存原始数据用于回滚
      userAPI.saveAddress(this.user.userId, this.user.addresses).then(async () => {
        const user_profile = await userAPI.getUserProfile(this.user.userId);
        this.handleAddress(user_profile)
        this.$message.success('地址保存成功');
      }).catch(err => {
        this.$message.error('地址保存失败：' + err.message);
        // 保存失败时回滚本地数据
        this.user.addresses = originalAddresses;
      });

      this.$message.success('地址保存成功');
    },
    /** 删除地址 */
    async deleteAddress(name) {
      userAPI.deleteAddress(this.user.userId, name).then(async () => {
        const user_profile = await userAPI.getUserProfile(this.user.userId);
        this.handleAddress(user_profile)
        this.$message.success('地址删除成功');
      })
    },
    /**
     * 执行积分支付
     */
    handlePointsPayment() {
      if (this.wallet.integral >= this.paymentAmount) {
        this.wallet.integral -= this.paymentAmount
        this.$message.success(`支付成功！剩余积分：${this.wallet.integral}`)

        // 清空购物车
        this.cart.cartItems = []
        this.cart.totalPrice = 0
        this.saveToLocalStorage()
      } else {
        this.$message.error('积分不足，支付失败')
      }
      this.pointsDialogVisible = false
    }
  },


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

/* 在style区块末尾添加 */
.points-payment-content {
padding: 20px;

.points-value {
color: #67C23A;
font-weight: bold;
font-size: 1.2em;
}

.payment-actions {
margin-top: 25px;
padding-top: 15px;
border-top: 1px solid #eee;
text-align: right;
}
}
