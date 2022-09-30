import axios from 'axios';

const sys_accessToken = localStorage.getItem('accessId');
axios.defaults.headers.Authorization = `Bearer ${sys_accessToken}`;

const userLogins: any = localStorage.getItem('userLogins');
const usersInfo = JSON.parse(userLogins);

// 获取所有加锁的数据
const getAllLockedData = async (releaseNum: string) => {
  const result: any = {
    message: '',
    data: [],
  };
  await axios
    .get('/api/verify/release/lock', { params: { ready_release_num: releaseNum } })
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

// 获取是否加锁
const getLockStatus = async (lockedId: string) => {
  console.log('判断是否锁定以及加锁', lockedId);
  const datas = {
    user_name: usersInfo.name,
    user_id: usersInfo.userid,
    param: lockedId,
  };

  const result = {
    errMessage: '',
    data: {},
  };

  await axios
    .post('/api/verify/release/lock', datas)
    .then(function (res) {
      if (res.data.code === 200) {
        result.data = res.data.data;
        console.log('判断结果', res.data.data);
        const personInfo = res.data.data;
        if (personInfo.user_name) {
          result.errMessage = `【${personInfo.user_name}】正在编辑，请稍后！`;
        }
      } else {
        result.errMessage = `错误：${res.data.msg}`;
      }
    })
    .catch(function (error) {
      result.errMessage = `异常信息:${error.toString()}`;
    });

  return result;
};

// 删除锁
const deleteLockStatus = async (lockedId: string) => {
  console.log('删除锁', lockedId);
  let errorMessage = '';

  const datas = {
    user_name: usersInfo?.name ?? '',
    user_id: usersInfo?.userid ?? '',
    param: lockedId,
  };

  await axios
    .delete('/api/verify/release/lock', { data: datas })
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

const getLockedId = (type: number, currentListNo: string, oraData: any) => {
  let currentDelData = '';
  // 被锁定的数据不能删除
  switch (type) {
    case 1:
      currentDelData = `${currentListNo}-step2-app-${oraData?.app_id}`;
      break;
    case 2:
      currentDelData = `${currentListNo}-step2-api-${oraData?.api_id}`;
      break;
    case 3:
      currentDelData = `${currentListNo}-step3-review-${oraData?.review_id}`;
      break;
    case 4:
      currentDelData = `${currentListNo}-step4-onlineBranch-${oraData?.branch_check_id}`;
      break;
    default:
      break;
  }

  return currentDelData;
};

export { getLockStatus, deleteLockStatus, getAllLockedData, getLockedId };
