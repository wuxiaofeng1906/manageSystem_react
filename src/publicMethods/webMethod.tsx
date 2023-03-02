// 当前登录是否为测试服务器
export const isTestService = () => {
  const url = window.location.host;
  if (url !== 'rd.q7link.com:8000') {
    return true;
  }
  return false;
}
