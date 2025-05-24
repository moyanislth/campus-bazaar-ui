<template>
  <div class="wallet-view">
    <!-- 返回按钮 -->
    <el-button @click="$router.go(-1)" class="back-btn">
      <i class="el-icon-arrow-left"></i> 返回个人中心
    </el-button>

    <!-- 钱包概览 -->
    <div class="wallet-card">
      <h2>我的钱包</h2>
      <div class="balance">
        <span class="label">账户余额：</span>
        <span class="amount">￥ {{ balance }}</span>
      </div>
      <div class="integral">
        <span class="label">积分余额：</span>
        <span class="amount">   {{ integral }}</span>
      </div>
    </div>

    <!-- 交易记录 -->
    <div class="transaction-section">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="充值记录" name="recharge">
          <transaction-list :list="rechargeRecords" />
        </el-tab-pane>
        <el-tab-pane label="消费记录" name="payment">
          <transaction-list :list="paymentRecords" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {userAPI} from '@/api'
import { User } from '@element-plus/icons-vue'
/**
 * 钱包功能主视图
 * 包含余额显示、积分显示、交易记录功能
 */

 
export default {
  data() {
    return {
      activeTab: 'recharge',
      balance: 0.00,
      integral: 0,
      rechargeRecords: [],
      paymentRecords: []
    }
  },

  mounted() {
    this.fetchWalletInfo()
    this.fetchTransactionRecords()
  },
  methods: {
    // 模拟获取余额和积分
    fetchWalletInfo() {
      const json = JSON.parse(localStorage.getItem('userInfo'));
      const userId = json.userId;
      const res = userAPI.getWalletInfo(userId)
      this.balance = 1000.00;  // 示例余额
      this.integral = 500;     // 示例积分
    },

    // 模拟获取交易记录
    fetchTransactionRecords() {
      this.rechargeRecords = [
        { id: 1, type: '充值', amount: 100.00, time: '2024-08-20 14:30' },
        { id: 2, type: '充值', amount: 200.00, time: '2024-08-21 10:15' }
      ]
    }
  }

}
</script>


<style scoped>
.integral {
  background: white;
  
  box-shadow: 0 2px 8px rgb(255, 255, 255);
}

/* 样式参考现有ProfileView保持统一 */
.wallet-view {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.wallet-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.back-btn {
  margin-bottom: 2rem;
}
</style>
