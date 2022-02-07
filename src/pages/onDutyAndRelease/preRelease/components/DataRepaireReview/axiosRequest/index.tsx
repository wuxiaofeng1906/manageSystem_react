import axios from 'axios';
import {getDutyPersonPermission, getSystemPersonPermission} from '../../../authority/permission';

const sys_accessToken = localStorage.getItem('accessId');
axios.defaults.headers.Authorization = `Bearer ${sys_accessToken}`;

const userLogins: any = localStorage.getItem('userLogins');
const usersInfo = JSON.parse(userLogins);

// 数据修复服务确认
const dataRepairConfirm = async (datas: any) => {
  let errorMessage = '';
  await axios
    .post('/api/verify/release/review_confirm_always', datas)
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

// 数据修复服务确认
const confirmDataRepairService = async (datas: any) => {
  const authData = {
    operate: `进行review服务确认`,
    method: 'post',
    path: '/api/verify/release/review_confirm_always',
  };
  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);
  if (dutyPermission.flag || systemPermission.flag) {
    return await dataRepairConfirm(datas);
  }
  if (dutyPermission.errorMessage) {
    return dutyPermission.errorMessage;
  }
  return systemPermission.errorMessage;
};

// 新增数据修复数据
const addDataRepaire = async (datas: any) => {
  let errorMessage = '';
  await axios
    .post('/api/verify/release/review_confirm', datas)
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

// 修改数据修复数据
const modifyDataRepaire = async (datas: any) => {
  let errorMessage = '';
  await axios
    .put('/api/verify/release/review_confirm', datas)
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

// 数据修复的新增和修改
const dataRepaireReview = async (kind: string, currentListNo: string, datas: any) => {
  if (!datas.repaireContent) {
    return '数据修复内容不能为空！';
  }

  if (!datas.relatedRenter) {
    return '涉及租户不能为空！';
  }

  if (!datas.types) {
    return '类型不能为空！';
  }
  if (!datas.repaireCommiter) {
    return '修复提交人不能为空！';
  }
  if (!datas.branch) {
    return '分支不能为空！';
  }

  if (!datas.EvalResult) {
    return '评审结果不能为空！';
  }

  if (!datas.repeatExecute) {
    return '是否可重复执行不能为空！';
  }

  const data = {
    user_name: usersInfo.name,
    user_id: usersInfo.userid,
    review_result: datas.EvalResult,
    is_repeat: datas.repeatExecute,
    repair_data_content: datas.repaireContent,
    related_tenant: datas.relatedRenter,
    type: datas.types,
    commit_user_id: datas.repaireCommiter.split('&')[0],
    commit_user_name: datas.repaireCommiter.split('&')[1],
    branch: datas.branch,
    ready_release_num: currentListNo,
  };

  // 开发经理、超级管理员
  const authData = {
    operate: `${kind}修复内容`,
    method: 'post',
    path: '/api/verify/release/review_confirm',
  };
  if (kind === '修改') {
    authData.method = 'put';
  }
  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);
  if (dutyPermission.flag || systemPermission.flag) {
    if (kind === '新增') {
      return await addDataRepaire(data);
    }

    // 以下是修改
    data['review_id'] = datas.reviewId;
    data['commit_id'] = datas.commitID;

    return await modifyDataRepaire(data);
  }
  if (dutyPermission.errorMessage) {
    return dutyPermission.errorMessage;
  }
  return systemPermission.errorMessage;
};

export {confirmDataRepairService, dataRepaireReview};
