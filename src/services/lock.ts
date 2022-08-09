import request from './request';
const baseUrl = '/api/verify';
const LockServices = {
  // 加锁，删锁
  async updateLockStatus(data: any, method: 'post' | 'delete') {
    return request(`${baseUrl}/release/lock`, { data, method: method });
  },
  // 获取锁定数据
  async getLockAll(page: string) {
    return request(`${baseUrl}/duty/lock`, { params: { keys: page }, method: 'get' });
  },
};

export default LockServices;
