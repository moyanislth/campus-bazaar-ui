import { request } from '@/utils/request';

/**
 * 获取所有用户信息接口
 * @returns {Promise} 用户信息请求结果
 */
const getAllUsers = () => {
  return request({
    method: 'get',
    url: '/api/user/getAllUser',
  })
}

/**
 * 搜索用户
 * @returns {Promise} 用户信息请求结果
 */
const searchUsers = (searchData) => {
  if (searchData.keyword === '') {
    searchData.keyword = null;
  }
  if (searchData.status === '') {
    searchData.status = null;
  }
  return request({
    method: 'post',
    url: '/api/user/searchUsers',
    data: searchData,
  })
}

/**
 * 获取特定用户信息接口
 * @returns {Promise} 用户信息请求结果
 */
const getUser = (userId) => {
  const id = userId;
  return request({
    method: 'get',
    url: '/api/user/getUserById',
    params: { id },
  })
}

/**
 * 获取用户账户信息
 * @param {String} userId 用户ID
 * @returns {Promise} 用户账户信息
 */
const getUserProfile = (userId) => {
  return request({
    method: 'get',
    url: '/api/user/getUserProfile',
    params: { userId },
  })
}

/**
 * 更新用户状态
 * @param {String} userId 用户ID
 * @returns {Promise} 审核结果
 */
const updateUserStatusUser = (userId, status) => {
  return request({
    method: 'Patch',
    url: '/api/user/updateUserStatus',
    data: { userId, status },
  })
}

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

/**
 * 获取图形验证码接口
 * @returns {Promise} 验证码请求结果
 */
const getCaptcha = () => {
  return request({
    method: 'post',
    url: '/api/verify/getcode',
    responseType: 'blob',  // blob是二进制数据类型，用于处理图片
    withCredentials: true  // 允许携带凭证
  })
}

/**
 * 校验验证码接口
 * @param {String} code 用户输入的验证码
 * @returns {Promise} 校验结果
 */
const checkCaptcha = (code, token) => {
  return request({
    method: 'get',
    url: '/api/verify/checkcode',
    params: { code },
    withCredentials: true
  })
}

/**
 * 获取用户证件信息
 * @param {number} userId - 用户ID
 * @returns {Promise} 包含状态码和图片数据的响应
 */
const getUserCredentials = async (userId) => {
  return await request({
    url: `/api/merchant/getMerchantCredentials`,
    method: 'GET',
    params: { userId },
  });
};

/**
 * 创建新钱包
 * @param {number} userId - 用户ID
 * @returns {Promise} 包含请求状态的Promise对象
 */
 const createWallet = (userId) => {
  return request({
    url: '/api/wallet/newWallet',
    method: 'post',
    params: { userId },
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

/**
 * 获取钱包详细信息
 * @param {number} userId - 用户ID
 * @returns {Promise} 包含钱包数据的Promise对象
 */
 const getWalletInfo = (userId) => {
  return request({
    url: '/api/wallet/getWalletInfo',
    method: 'get',
    params: { userId }
  })
}

/**
 * 付款接口
 * @param {number} userId - 用户ID
 * @param {string} type - 付款类型
 * @param {number} amount - 付款金额
 * @returns {Promise} 包含请求状态的Promise对象
 */
 const pay = (userId, type, amount) => {
  return request({
    url: '/api/user/pay',
    method: 'post',
    params: { userId, type, amount }
  })
 }

/**
* 保存地址信息
*/
const saveAddress = (userId, address) => {
  const addressData = { userId, address }; // 构造请求体数据
  return request({
    url: '/api/user/saveAddress',
    method: 'post',
    data: addressData // 使用data传递请求体（替代params查询参数），避免URL编码问题
  })
}

/**
* 保存地址信息
*/
const deleteAddress = (userId, name) => {
  const addressData = { userId, name }; // 构造请求体数据
  return request({
    url: '/api/user/deleteAddress',
    method: 'post',
    data: addressData // 使用data传递请求体（替代params查询参数），避免URL编码问题
  })
}


export {deleteAddress, saveAddress,getUserProfile,pay,getWalletInfo, createWallet,searchUsers, getUserCredentials, getUser, getAllUsers, register, login, getCaptcha, checkCaptcha, updateUserStatusUser };
