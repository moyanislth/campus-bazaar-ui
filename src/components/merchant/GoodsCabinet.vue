<template>
  <el-card class="goods-cabinet">
    <el-table :data="goodsList" style="width: 100%">
      <el-table-column prop="name" label="商品名称" width="180" />
      <el-table-column prop="category" label="商品类型" />
      <el-table-column label="价格">
        <template #default="scope">
          ￥{{ scope.row.price.toFixed(2) }}
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
  }
}
</script>
