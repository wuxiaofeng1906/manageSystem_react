// 升级服务服务确认

import axios from "axios";
import {getDutyPersonPermission, getSystemPersonPermission} from '../../../authority/permission';

const sys_accessToken = localStorage.getItem('accessId');
axios.defaults.headers.Authorization = `Bearer ${sys_accessToken}`;

const userLogins: any = localStorage.getItem('userLogins');
const usersInfo = JSON.parse(userLogins);


const upgradeServiceConfirm = async (datas: any) => {
  let errorMessage = '';
  await axios
    .post('/api/verify/release/upgrade_confirm', datas)
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

const confirmUpgradeService = async (datas: any) => {
  const authData = {
    operate: `进行服务确认`,
    method: 'post',
    path: '/api/verify/release/upgrade_confirm',
  };
  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);
  if (dutyPermission.flag || systemPermission.flag) {
    return await upgradeServiceConfirm(datas);
  }
  if (dutyPermission.errorMessage) {
    return dutyPermission.errorMessage;
  }
  return systemPermission.errorMessage;
};

export {confirmUpgradeService}
