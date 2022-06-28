import axios from 'axios';
import {getDutyPersonPermission, getSystemPersonPermission} from '../../../authority/permission';
import {saveBeforeAndAfterOnlineAutoCheck} from "@/pages/onDutyAndRelease/preRelease/comControl/axiosRequest";

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
    .get('/api/verify/release/progress', {params: {ready_release_num: releaseNum}})
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

// 执行上线后自动化检查功能
const executeAutoCheck = async (source: any, currentListNo: string) => {
  // 上线前后检查: 打勾是yes，没打勾是no
  let after_ignore_check = 'no';
  if (source.ignoreAfterCheck && (source.ignoreAfterCheck).length > 0) {
    after_ignore_check = 'yes'
  }

  const afterData = {
    "user_name": usersInfo.name,
    "user_id": usersInfo.userid,
    "ignore_check": after_ignore_check,
    "check_time": "after",
    "check_type": "",
    "check_result": after_ignore_check === "yes" ? "no" : "yes", // 与忽略检查的值相反
    // "test_env": sourceData.imageevn,  // 传版本检查中的镜像环境
    // "check_num": newOnlineBranchNum,
    "ready_release_num": currentListNo
  };

  const data = [];
  // 有几个检查结果，数组里面就添加几个对象
  if (after_ignore_check === "no" && (source.checkResult).length > 0) {
    (source.checkResult).forEach((ele: string) => {
      const newDt = {...afterData};
      newDt.check_type = ele.toString();
      data.push(newDt);
    });
  } else {
    data.push(afterData);
  }

  const saveRt = await saveBeforeAndAfterOnlineAutoCheck(data);

  return saveRt;
};

export {saveProcessResult, getCheckProcess, executeAutoCheck};
