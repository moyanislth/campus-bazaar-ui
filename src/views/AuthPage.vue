<template>
  <div class="auth-container">
    <div class="auth-card">
      <!-- 选项卡导航 -->
      <div class="tab-nav">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'login' }" 
          @click="activeTab = 'login'"
        >登录</button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'register' }" 
          @click="activeTab = 'register'"
        >注册</button>
      </div>

      <!-- 登录表单 -->
      <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="auth-form">
        <div class="input-group">
          <label>手机号<span class="required">*</span></label>
          <input v-model="loginForm.phone" type="tel" placeholder="请输入11位手机号" required />
        </div>
        <div class="input-group">
          <label>密码<span class="required">*</span></label>
          <div class="password-wrapper">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              v-model="loginForm.password" 
              placeholder="请输入密码" 
              required 
            />
            <button type="button" class="eye-btn" @click="showPassword = !showPassword">
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>
        <button type="submit" class="submit-btn">登录</button>
      </form>

      <!-- 注册表单 -->
      <form v-else @submit.prevent="handleRegister" class="auth-form">
        <div class="input-group">
          <label>用户名<span class="required">*</span></label>
          <input v-model="registerForm.username" type="text" placeholder="3-10位" required />
        </div>
        <div class="input-group">
          <label>密码<span class="required">*</span></label>
          <div class="password-wrapper">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              v-model="registerForm.password" 
              placeholder="8-20位" 
              required 
            />
            <button type="button" class="eye-btn" @click="showPassword = !showPassword">
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>
        <div class="input-group">
          <label>手机号<span class="required">*</span></label>
          <input v-model="registerForm.phone" type="tel" placeholder="请输入11位手机号" required />
        </div>
        <div class="input-group">
          <label>验证码<span class="required">*</span></label>
          <div class="captcha-wrapper">
            <input v-model="registerForm.captcha" type="text" placeholder="6位验证码" required />
            <button type="button" class="captcha-btn" @click="getCaptcha">获取验证码</button>
          </div>
        </div>
        <div class="input-group">
          <label>用户类型<span class="required">*</span></label>
          <select v-model="registerForm.role" required>
            <option value="0">普通用户</option>
            <option value="1">商家用户</option>
          </select>
        </div>
        <div v-if="registerForm.role === '1'" class="business-fields">
          <div class="input-group">
            <label>银行账户<span class="required">*</span></label>
            <input v-model="registerForm.bankAccount" type="text" placeholder="请输入银行账户" required />
          </div>
          <div class="input-group">
            <label>营业执照<span class="required">*</span></label>
            <input type="file" @change="handleFileUpload('license', $event)" accept=".pdf,.jpg,.png" required />
          </div>
          <div class="input-group">
            <label>身份证件<span class="required">*</span></label>
            <input type="file" @change="handleFileUpload('idCard', $event)" accept=".jpg,.png" required />
          </div>
        </div>
        <button type="submit" class="submit-btn">注册</button>
      </form>

      <!-- 页脚导航 -->
      <div class="auth-footer">
        <span>{{ activeTab === 'login' ? '新用户？' : '已有账号？' }}</span>
        <a @click="activeTab = activeTab === 'login' ? 'register' : 'login'">
          {{ activeTab === 'login' ? '立即注册' : '立即登录' }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { userAPI } from '@/api'
export default {
  name: 'AuthPage',
  data() {
    return {
      // 当前激活的选项卡（登录/注册）
      activeTab: 'login',
      // 控制密码是否明文显示
      showPassword: false,
      // 登录表单数据结构
      loginForm: {
        phone: '',  // 用户手机号
        password: '' // 登录密码
      },
      // 注册表单数据结构
      registerForm: {
        username: '',    // 用户名（3-10位）
        password: '',    // 密码（8-20位）
        phone: '',       // 手机号（11位）
        captcha: '',     // 短信验证码（6位数字）
        role: '0',       // 用户角色 0-普通用户 1-商家用户
        bankAccount: '', // 商家银行账户（角色为1时必填）
        license: null,   // 营业执照文件对象
        idCard: null     // 身份证件文件对象
      }
    }
  },
  methods: {
    // 验证登录表单数据
    validateLogin() {
      const { phone, password } = this.loginForm
      if (!/^1[3-9]\d{9}$/.test(phone)) {
        alert('请输入有效的11位手机号')
        return false
      }
      if (!/^(?=.*[a-z])(?=.*[A-Z]).{8,20}$/.test(password)) {
        alert('密码需8-20位，包含大小写字母')
        return false
      }
      return true
    },

    // 验证注册表单数据
    validateRegister() {
      const { 
        username, 
        password, 
        phone, 
        captcha, 
        role, 
        bankAccount, 
        license, 
        idCard 
      } = this.registerForm
      
      if (!/^[a-zA-Z0-9]{3,10}$/.test(username)) {
        alert('用户名需3-10位字母或数字')
        return false
      }
      if (!/^[0-9a-zA-Z]{8,20}$/.test(password)) {
        alert('密码需8-20位字母或数字')
        return false  
      }
      // 手机号的验证逻辑: 11位数字，以1开头
      if (!/^1\d{10}$/.test(phone)) {
        alert('请输入有效的11位手机号')
        return false
      }
      if (!/^\d{6}$/.test(captcha)) {
        alert('请输入6位验证码')
        return false
      }
      if (role === '1') {
        if (!bankAccount?.trim() || !/^\d{16}$/.test(bankAccount)) {
          alert('请输入有效的16位数字银行账户');
          return false;
        }
        if (!license || !idCard) {
          alert('请上传营业执照和身份证件')
          return false
        }
      }
      return true
    },

    // 处理文件上传事件
    handleFileUpload(field, event) {
      this.registerForm[field] = event.target.files[0]
    },

    // 获取短信验证码
    getCaptcha() {
      console.log('Requesting captcha for:', this.registerForm.phone)
    },

    // 处理登录表单提交
    handleLogin() {
      if (this.validateLogin()) {
        console.log('Login data:', this.loginForm)
      }
    },

    // 处理注册表单提交
    handleRegister() {
      if (this.validateRegister()) {
        console.log('Register data:', this.registerForm)
        userAPI.register(this.registerForm).then(res => {
        console.log('Register result:', res)
      })
      }
      
    }
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.tab-nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.tab-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: none;
  font-size: 1rem;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-btn.active {
  color: #007AFF;
  border-bottom-color: #007AFF;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-size: 0.9rem;
  font-weight: 500;
}

input, select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

input:focus, select:focus {
  outline: none;
  border-color: #007AFF;
}

.password-wrapper, .captcha-wrapper {
  display: flex;
  gap: 0.5rem;
}

.eye-btn, .captcha-btn {
  padding: 0.5rem;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
}

.submit-btn {
  padding: 0.75rem;
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.submit-btn:hover {
  opacity: 0.9;
}

.business-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.auth-footer {
  margin-top: 1.5rem;
  text-align: center;
  color: #666;
}

.auth-footer a {
  color: #007AFF;
  cursor: pointer;
}

.required {
  color: #ff4d4f;
  margin-left: 0.25rem;
}
</style>