<template>
    <div class="publish-container">
      <!-- 商品基础信息表单 -->
      <el-form :model="formData" label-width="100px">
        <el-form-item label="商品名称" required>
          <el-input v-model="formData.name" placeholder="请输入商品名称" />
        </el-form-item>
        
        <!-- 商品价格输入 -->
        <el-form-item label="销售价格" required>
          <el-input-number 
            v-model="formData.original_price" 
            :min="0" 
            :precision="2"
            controls-position="right" />
        </el-form-item>
        <!-- 商品类别 --> 
        <el-form-item label="商品类别" required>
          <el-select v-model="formData.category" placeholder="请选择商品类别">
            <el-option label="电子产品" value="electronics" />
            <el-option label="家居用品" value="home" />
            <el-option label="服装服饰" value="clothing" />
          </el-select>
        </el-form-item> 
        
        <!-- 商品库存数量 --> 
        <el-form-item label="库存数量" required>
          <el-input-number v-model="formData.stock" :min="0" controls-position="right" />
        </el-form-item>

        <!-- 图片上传组件 -->
        <el-form-item label="商品主图">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="5">
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
  
        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">
            立即发布
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  

  export default {
    data() {
      return {
        formData: {
        /** 商品名称 */
        name: '',
        /** 商品分类ID */
        category: null,
        /** 销售价格 */
        original_price: 0,
        /** 商品库存 */
        stock: 0,
        /** 商品主图列表 */
        images: [],
        /** 商品状态（立即上架/存入仓库） */
        status: 0, // 0: 待审核, 1: 已上架, 2: 已下架  
      },
      rules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在3到50个字符', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择商品分类', trigger: 'change' }
        ]
      }
    }
    },
    methods: {
      /**
       * 处理表单提交
       */
       async handleSubmit() {
       try {
         const response = await axios.get('/api/product/getAllProductsWithImg', this.formData);
         console.log('后端响应:', response.data);
         this.$message.success('商品已提交审核');
       } catch (error) {
         console.error('提交失败:', error);
         this.$message.error('提交失败，请重试');
       }
     }
   }
  }
  </script>