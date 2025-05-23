import axios from 'axios';
import { ElMessage } from 'element-plus'; 
import 'element-plus/dist/index.css';
import router from '../router';

/**
 * 创建全局axios实例
 * @property {string} baseURL - 统一接口前缀
 * @property {number} timeout - 请求超时时间（毫秒）
 */
const service = axios.create({
  baseURL: 'http://localhost:8081', // 统一接口前缀
  timeout: 5000, // 请求超时时间（毫秒）
});


// 请求拦截器
service.interceptors.request.use(
  /**
   * 请求预处理
   * @param {Object} config - 请求配置对象
   * @returns {Object} 处理后的请求配置
   */
  config => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const token = userInfo?.token;
    if (userInfo != null && token != null) {
      // Bearer令牌格式,注意Bearer要有空格
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  /**
   * 响应成功处理
   * @param {Object} response - 响应对象
   * @returns {Object} 业务数据
   */
  response => {
    const res = response.data;
  
    // 非业务响应处理
    if (typeof res.code === 'undefined') {
      console.log('response:', response); // 打印响应数据,方便调试

      if (response.data.code === 401) { // 增加认证失败判断
        localStorage.removeItem('token');
        router.push('/auth');
        return Promise.reject(new Error('请重新登录'));
      }
      return response;
    }

    // 标准业务响应处理,响应成功同时后端返回了code为200
    if (response.status === 200 && res.code === 200) {
      console.log('response.data:', res); // 打印响应数据,方便调试
      return res;
    }

    // 业务逻辑错误处理
    const errMessage = res.data || res.data?.message || '请求失败';
    ElMessage({
      message: errMessage,
      type: 'warning',
      duration: 3000
    });
    return Promise.reject(new Error(errMessage));
  },
  /**
   * 响应错误处理
   * @param {Error} error - 错误对象
   * @returns {Promise} 错误Promise
   */
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      router.push('/auth');
    }
    // 统一错误消息处理
    const errMessage = error.response?.data?.message || error.message; 
    return Promise.reject(new Error(errMessage));
  }
);

/**
 * 通用请求方法
 * @param {Object} options - 请求配置,例如: { method, url, data }
 * @returns {Promise} 请求结果
 */
function request(options) {
  return service(options);
}

export { request };