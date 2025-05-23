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

    <!-- 新增地址管理 -->
    <div class="address-section">
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
</template>

<script>
export default {
  name: 'ProfileView',
  data() {
    return {
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

.user-card {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
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

.profile-tabs {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-list {
  display: grid;
  gap: 1.5rem;
}

.item-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #eee;
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

.price {
  color: var(--primary-color);
  font-weight: 600;
}

/* 新增样式 */
.introduction-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.address-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
}

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
</style>