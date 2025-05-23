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

/**
 * 获取商品信息
 * @returns {Promise} 商品信息请求结果
 */
const getProductById = (id) => {
  return request({
    method: 'get',
    url: `/api/product/getProductById`,
    params: {
      id: id,
    }
  })
}

/**
 * 获取商品图片信息
 * @returns {Promise} 图片数组
 */
const getProductImages = (id) => {
  return request({
    method: 'get',
    url: `/api/product/getProductImages`,
    params: {
      id: id,
    }
  })
}

/**
 * 搜索商品
 * @returns {Promise} 商品信息请求结果
 */
const searchProducts = (searchData) => {
  if (searchData.keyword === '') {
    searchData.keyword = null;
  }
  if (searchData.status === '') {
    searchData.status = null;
  }
  return request({
    method: 'post',
    url: '/api/product/searchProducts',
    data: searchData,
  })
}

/**
 * 获取商户名称
 * @returns {Promise} 商户名称请求结果
 */
const getMerchantName = (merchantId) => {
  return request({
    method: 'get',
    url: '/api/merchant/getMerchantName',
    params: {
      merchantId: merchantId,
    }
  })
}

/**
 * 更新商品状态
 * @returns {Promise} 商品信息请求结果
 */
const updateProductStatus = (id, status) => {
  return request({
    method: 'patch',
    url: '/api/product/updateProductStatus',
    params: {
      id: id,
      status: status,
    }
  })
}

/**
 * 审核通过
 * @returns {Promise} 商品信息请求结果
 */
const approveProduct = (id) => {
  return updateProductStatus(id, 1);
}

/**
 * 审核不通过
 * @returns {Promise} 商品信息请求结果
 */
const rejectProduct = (id) => {
  return updateProductStatus(id, 2);
}

export { approveProduct, rejectProduct, updateProductStatus, getMerchantName, getProductImages, searchProducts, getProductById, getAllProducts };