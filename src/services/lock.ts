import request from './request';
const baseUrl = '/api/verify';
// 加锁，删锁
const LockServices = {
  async lockStatus(data: any, method: 'post' | 'delete') {
    return request(`${baseUrl}/release/lock`, { data, method: method });
  },
};
export default LockServices;
