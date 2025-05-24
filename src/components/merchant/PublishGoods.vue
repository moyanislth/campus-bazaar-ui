<template>
    <div class="publish-container">
      <!-- 商品基础信息表单 -->
      <el-form :model="formData" label-width="100px">
        <el-form-item label="商品名称" required>
          <el-input v-model="formData.name" placeholder="请输入商品名称" />
        </el-form-item>
        
        <!-- 商品价格输入 -->
        <el-form-item label="销售价格">
          <el-input-number 
            v-model="formData.price" 
            :min="0" 
            :precision="2"
            controls-position="right" />
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
  export default {
    data() {
      return {
        formData: {
          name: '',
          price: 0,
          images: []
        }
      }
    },
    methods: {
      /**
       * 处理表单提交
       */
      handleSubmit() {
        console.log('提交商品数据:', this.formData)
        this.$message.success('商品已提交审核')
      }
    }
  }
  </script>