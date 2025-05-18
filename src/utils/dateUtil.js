/**
 * 时间处理工具类
 */
export default class DateUtil {
    /**
     * 转换秒级时间戳为中文格式日期
     * @param {number} timestamp - 秒级时间戳
     * @returns {string} 格式化日期字符串
     */
    static formatCN(timestamp) {
        if (!timestamp) return '无记录';
        
        const date = new Date(parseInt(timestamp) * 1000);
        
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        
        return date.toLocaleString('zh-CN', options);
    }
}