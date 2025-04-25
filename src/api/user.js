import { request } from '@/utils/request';


/**
 * 用户注册接口（支持文件上传）
 * @param {Object} userData - 用户注册数据（包含文件对象）
 * @returns {Promise} 注册结果
 */
const register = (userData) => {
  // 创建FormData对象处理混合数据
  const formData = new FormData();
  
  // 添加文本字段
  formData.append('username', userData.username);
  formData.append('password', userData.password);
  formData.append('phone', userData.phone);
  formData.append('captcha', userData.captcha);
  formData.append('role', userData.role);
  
  // 添加银行账户字段（商家用户必填）
  if (userData.role === '1') {
    formData.append('bankAccount', userData.bankAccount);
    // 添加文件字段
    formData.append('license', userData.license);
    formData.append('idCard', userData.idCard);
  }

  // 发送multipart/form-data请求
  // 修改调用方式为通用request方法
  return request({
    method: 'post',
    url: '/api/user/register',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

/**
 * 登录接口
 * @param {Object} loginData - 登录数据
 * @returns {Promise} 登录结果
 */
const login = (loginData) => {
  return request({
    method: 'post',
    url: '/api/user/login',
    data: loginData,
  })
}
export { register, login };