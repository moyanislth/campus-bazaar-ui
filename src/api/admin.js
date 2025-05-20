import { getAllUsers } from './user';
import { getAllProducts } from './products';

/**
 * 获取管理后台数据
 * @returns {Promise<{users: Array, products: Array}>} 返回用户和商品数据
 */
const fetchData = async () => {
  try {
    const [userRes, productRes] = await Promise.all([
      getAllUsers(),
      getAllProducts()
    ]);

    return {
      users: userRes.data,
      products: productRes.data
    };
  } catch (error) {
    throw new Error(`数据获取失败: ${error.message}`);
  }
};

export { fetchData };
