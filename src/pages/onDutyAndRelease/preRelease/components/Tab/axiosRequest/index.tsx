import axios from 'axios';

const sys_accessToken = localStorage.getItem('accessId');
axios.defaults.headers.Authorization = `Bearer ${sys_accessToken}`;

const userLogins: any = localStorage.getItem('userLogins');
const usersInfo = JSON.parse(userLogins);

const getNewPageNumber = async () => {
  const result: any = {
    message: '',
    data: [],
  };
  await axios
    .get('/api/verify/release/release_num', {})
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

// 删除预发布tab
const delTabsInfo = async (releaseNum: string) => {
  let errorMessage = '';

  const datas = {
    user_name: usersInfo.name,
    user_id: usersInfo.userid,
    ready_release_num: releaseNum,
  };
  await axios
    .delete('/api/verify/release/release_detail', { data: datas })
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

// 删除tab
const deleteReleaseItem = async (releaseNum: string) => {
  // 验证权限(值班测试和超级管理员)
  // const authData = {
  //   "operate": "删除发布名称",
  //   "method": "delete",
  //   "path": "/api/verify/release/release_detail"
  // };
  //
  // const dutyPermission = await getDutyPersonPermission(authData);
  // const systemPermission = await getSystemPersonPermission(authData);
  // if (dutyPermission.flag || systemPermission.flag) {
  return await delTabsInfo(releaseNum);
  // }
  // if (dutyPermission.errorMessage) {
  //   return dutyPermission.errorMessage;
  // }
  // return systemPermission.errorMessage;
};

export { getNewPageNumber, deleteReleaseItem };
