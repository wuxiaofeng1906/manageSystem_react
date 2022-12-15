import axios from 'axios';
import {getDutyPersonPermission, getSystemPersonPermission} from '../../../authority/permission';
import dayjs from "dayjs";

const sys_accessToken = localStorage.getItem('accessId');
axios.defaults.headers.Authorization = `Bearer ${sys_accessToken}`;

const userLogins: any = localStorage.getItem('userLogins');
const usersInfo = JSON.parse(userLogins);

const getDelUpgradeItemsAuthority = async (type: number) => {
  const authData = {
    operate: '删除',
    method: 'delete',
    path: '',
  };
  switch (type) {
    case 1:
      authData.path = '/api/verify/release/upgrade_service';
      break;
    case 2:
      authData.path = '/api/verify/release/upgrade_api';
      break;
    case 3:
      authData.path = '/api/verify/release/review_confirm';
      break;
    case 4:
      authData.path = '/api/verify/release/release_branch';
      break;

    default:
      break;
  }

  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);
  if (dutyPermission.flag || systemPermission.flag) {
    return '';
  }
  if (dutyPermission.errorMessage) {
    return dutyPermission.errorMessage;
  }
  return systemPermission.errorMessage;
};

// 删除发布项数据
const delUpgradeItem = async (id: number) => {
  let errorMessage = '';

  const datas = {
    user_name: usersInfo.name,
    user_id: usersInfo.userid,
    app_id: id,
  };
  await axios
    .delete('/api/verify/release/upgrade_service', { data: datas })
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

// 删除发布接口数据
const delPulishApi = async (id: number) => {
  let errorMessage = '';

  const datas = {
    user_name: usersInfo.name,
    user_id: usersInfo.userid,
    api_id: id,
  };
  await axios
    .delete('/api/verify/release/upgrade_api', { data: datas })
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

// review 删除数据接口
const delDataReviewApi = async (id: number) => {
  let errorMessage = '';

  const datas = {
    user_name: usersInfo.name,
    user_id: usersInfo.userid,
    review_id: id,
  };
  await axios
    .delete('/api/verify/release/review_confirm', { data: datas })
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

// 删除上线分支
const delDataOnlineBranchApi = async (id: number) => {
  let errorMessage = '';

  const datas = {
    user_name: usersInfo.name,
    user_id: usersInfo.userid,
    check_num: id,
  };
  await axios
    .delete('/api/verify/release/release_branch', { data: datas })
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

// 删除数据
const delUpgradeItems = async (type: number, source: any) => {
  const authFlag = await getDelUpgradeItemsAuthority(type);

  if (authFlag) {
    return authFlag;
  }
  let delMessage = '';
  if (type === 1) {
    // 是发布项删除
    delMessage = await delUpgradeItem(source.app_id);
  } else if (type === 2) {
    // 是升级接口删除
    delMessage = await delPulishApi(source.api_id);
  } else if (type === 3) {
    // 是数据修复review
    delMessage = await delDataReviewApi(source.review_id);
  } else if (type === 4) {
    // 是上线分支删除
    delMessage = await delDataOnlineBranchApi(source.check_num);
  }

  return delMessage;
};



export {delUpgradeItems};
