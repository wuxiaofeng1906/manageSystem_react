import axios from 'axios';

const sys_accessToken = localStorage.getItem('accessId');
axios.defaults.headers.Authorization = `Bearer ${sys_accessToken}`;

// const userLogins: any = localStorage.getItem('userLogins');
// const usersInfo = JSON.parse(userLogins);

// 获取模板列表
const requestTemplateListApi = async () => {
  let data: any = [];
  await axios.get('/api/verify/zentao/temp_list')
    .then(function (res) {
      if (res.data.code === 200) {
        data = res.data.data;
      }
    })
    .catch(function (error) {
      console.log("数据获取失败", error)
    });

  return data;
};

// 删除模板列表
const requestDelTempleApi = (tempId: string) => {

  let returnMsg = "";
  axios.delete('/api/verify/zentao/temp_list', {data: {temp_id: tempId}})
    .then(function (res) {
      if (res.data.code !== 200) {
        returnMsg = res.data.msg;
      }
    })
    .catch(function (error) {
      returnMsg = error;
    });

  return returnMsg;
};

export {
  requestTemplateListApi, requestDelTempleApi
}
