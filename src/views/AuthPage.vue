<template>
  <div class="auth-container">
    <!-- 卡片容器 -->
    <div class="auth-card">
      <!-- 选项卡导航 -->
      <div class="tab-nav">
        <button 
          class="tab-btn"
          :class="{ active: activeTab === 'login' }"
          @click="activeTab = 'login'"
        >
          登录
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'register' }"
          @click="activeTab = 'register'"
        >
          注册
        </button>
      </div>

      <!-- 动态表单区域 -->
      <form @submit.prevent="handleSubmit" class="auth-form">
        <!-- 手机号输入 -->
        <div class="input-group">
          <label>手机号</label>
          <input
            type="tel"
            v-model="formData.phone"
            placeholder="请输入11位手机号"
            required
          />
        </div>

        <!-- 密码输入 -->
        <div class="input-group" v-if="activeTab === 'login'">
          <label>密码</label>
          <input
            type="password"
            v-model="formData.password"
            placeholder="请输入密码"
            required
          />
        </div>

        <!-- 注册额外字段 -->
        <template v-if="activeTab === 'register'">
          <div class="input-group">
            <label>验证码</label>
            <div class="captcha-wrapper">
              <input
                type="text"
                v-model="formData.captcha"
                placeholder="6位验证码"
                required
              />
              <img src="#" alt="验证码" class="captcha-img" />
            </div>
          </div>
          
        </template>

        <button type="submit" class="submit-btn">
          {{ activeTab === 'login' ? '立即登录' : '注册账号' }}
        </button>
      </form>

      <!-- 底部导航 -->
      <div class="auth-footer">
        <template v-if="activeTab === 'login'">
          <span>新用户？</span>
          <a @click="activeTab = 'register'">立即注册</a>
        </template>
        <template v-else>
          <span>已有账号？</span>
          <a @click="activeTab = 'login'">立即登录</a>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 统一认证页面组件
 * 集成登录注册功能，采用动态表单切换模式
 */
export default {
  name: 'AuthPage',
  data() {
    return {
      activeTab: 'login',
      formData: {
        phone: '',
        password: '',
        captcha: '',
      }
    }
  },
  methods: {
    handleSubmit() {
      console.log('提交数据:', {
        mode: this.activeTab,
        ...this.formData
      })
    }
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  padding: 2.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
}

.tab-nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tab-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: transparent;
  color: #666;
  font-size: 1.1rem;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.tab-btn.active {
  color: #007AFF;
  border-bottom-color: #007AFF;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  color: #1d1d1f;
  font-size: 0.9rem;
  font-weight: 500;
}

input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

input:focus {
  border-color: #007AFF;
  outline: none;
}

.captcha-wrapper {
  display: flex;
  gap: 0.75rem;
}

.captcha-btn {
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  color: #007AFF;
  cursor: pointer;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.submit-btn:hover {
  opacity: 0.9;
}

.auth-footer {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  text-align: center;
  color: #666;
  border-top: 1px solid #eee;
}

.auth-footer a {
  color: #007AFF;
  cursor: pointer;
}

.agree-check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}
</style>