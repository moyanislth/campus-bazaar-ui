<template>
  <el-card class="goods-cabinet">
    <el-table :data="goodsList" style="width: 100%">
      <el-table-column prop="name" label="商品名称" width="180" />
      <el-table-column prop="category" label="商品类型" />
      <el-table-column label="价格">
        <template #default="scope">
          ￥{{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="库存数量">
        <template #default="scope">
          <span :style="{ color: scope.row.stock < 10 ? 'red' : 'inherit' }">
            {{ scope.row.stock }}件
          </span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>


<script>
import { goodsAPI } from '@/api'

export default {
  data() {
    return {
      goodsList: [
        {
          id: 1,
          name: '商品1号',
          category: '电子产品',
          price: 80.0,
          stock: 15
        },
        {
          id: 2,
          name: '商品2号',
          category: '家居用品',
          price: 45.5,
          stock: 8
        },
        {
          id: 3,
          name: '商品3号',
          category: '服装服饰',
          price: 128.0,
          stock: 22
        }
      ]
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.getGoodsList()
    },
    /**
     * 查看本人所有商品
     */
    async getGoodsList() {
      const json = JSON.parse(localStorage.getItem('userInfo')) // 从本地存储中获取用户信息，假设用户信息存储在 LOCAL_STORAGE_USER_INFO 键中，并且是 JSON 格式的字符串，需要使用 JSON.parse 方法将其转换为 J
      const userId = json.userId

      try {
        const res = await goodsAPI.getGoodsList(userId) // 调用 getGoodsList 方法获取商品列表，传入用户 ID 作为参数
        console.log(res)
        this.goodsList = res.data.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          price: item.originalPrice,
          stock: item.stock
        })) // 将获取到的商品列表映射为目标格式并赋值给 goodsList 变量
      } catch (error) {
        console.error(error) // 捕获错误并打印到控制台
      }
    }
  }
}
</script>
