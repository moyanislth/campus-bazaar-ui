import { request } from '@/utils/request';

/**
 * 获取所有商品信息接口
 * @returns {Promise} 用户信息请求结果
 */
const getAllProducts = () => {
  return request({
    method: 'get',
    url: '/api/product/getAllProducts',
  })
}



export { getAllProducts };