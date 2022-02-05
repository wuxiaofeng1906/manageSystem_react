import axios from 'axios';
import { getDutyPersonPermission, getSystemPersonPermission } from '../../../authority/permission';

const sys_accessToken = localStorage.getItem('accessId');
axios.defaults.headers.Authorization = `Bearer ${sys_accessToken}`;

const userLogins: any = localStorage.getItem('userLogins');
const usersInfo = JSON.parse(userLogins);

// 获取当前进度
const getCheckProcess = async (releaseNum: string) => {
  const result: any = {
    message: '',
    data: [],
  };
  await axios
    .get('/api/verify/release/progress', { params: { ready_release_num: releaseNum } })
    .then(function (res) {
      if (res.data.code === 200) {
        result.data = res.data.data;
      } else {
        result.message = `错误：${res.data.msg}`;
      }
    })
    .catch(function (error) {
      result.message = `异常信息:${error.toString()}`;
    });

  return result;
};

// 更新发布结果
const updateReleaseProcess = async (data: any) => {
  let errorMessage = '';
  await axios
    .post('/api/verify/release/progress', data)
    .then(function (res) {
      if (res.data.code !== 200) {
        errorMessage = `错误：${res.data.msg}`;
      }
    })
    .catch(function (error) {
      errorMessage = `异常信息:${error.toString()}`;
    });

  return errorMessage;
};

const saveProcessResult = async (releaseNum: string, result: string) => {
  // 验证权限(值班测试和超级管理员)
  const authData = {
    operate: '修改发布结果',
    method: 'post',
    path: '/api/verify/release/progress',
  };
  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);
  if (dutyPermission.flag || systemPermission.flag) {
    const data = {
      user_name: usersInfo.name,
      user_id: usersInfo.userid,
      ready_release_num: releaseNum,
      release_result: result,
    };
    return await updateReleaseProcess(data);
  }
  if (dutyPermission.errorMessage) {
    return dutyPermission.errorMessage;
  }
  return systemPermission.errorMessage;
};

export { saveProcessResult, getCheckProcess };
