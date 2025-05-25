<template>
  <div class="shipping-container">
    <el-card header="待发货订单">
      <el-table :data="pendingOrders">
        <el-table-column prop="orderId" label="订单号" />
        <el-table-column prop="productName" label="商品名" />
        <el-table-column prop="createTime" label="下单时间" />
        <el-table-column label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === '已发货' ? 'success' : 'info'" effect="plain">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" @click="handleShip(scope.row)">
              发货
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>

export default {
  methods: {
    // 处理发货操作
    async handleShip(order) {
      try {
        await this.$http.post(`/orders/${order.orderId}/ship`)
        this.$message.success('发货成功')
        this.pendingOrders = this.pendingOrders.filter(
          item => item.orderId !== order.orderId
        )
      } catch (error) {
        this.$message.error('发货失败：' + error.response?.data?.message || '服务器错误')
      }
    },
    async fetchPendingOrders() {
      try {
        const res = await this.$http.get('/orders/pending')
        this.pendingOrders = res.data
      } catch (error) {
        console.error('获取订单失败:', error)
      }
    },
    mounted() {
      this.fetchPendingOrders()
    }

  },
  data() {
    return {
      pendingOrders: [
        {
          orderId: 'DD202307001',
          productId: 1,
          productName: '商品1号',
          quantity: 2,
          status: '待发货',
          createTime: '2023-07-01 14:30'
        },
        {
          orderId: 'DD202307002',
          productId: 2,
          productName: '商品2号',
          quantity: 5,
          status: '待发货',
          createTime: '2023-07-02 09:15'
        }
      ]

    }
  }
}
</script>
