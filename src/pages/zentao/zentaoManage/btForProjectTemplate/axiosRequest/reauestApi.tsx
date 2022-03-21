import axios from 'axios';

const sys_accessToken = localStorage.getItem('accessId');
axios.defaults.headers.Authorization = `Bearer ${sys_accessToken}`;

// const userLogins: any = localStorage.getItem('userLogins');
// const usersInfo = JSON.parse(userLogins);


const getPrjManegerApi = async (excutId: number) => {

  let data: any = {};
  await axios.get('/api/verify/zentao/head', {params: {execution_id: excutId}})
    .then(function (res) {
      if (res.data.code === 200) {
        data = res.data.data;
      }
    })
    .catch(function (error) {
      console.log("指派人获取失败", error)
    });

  return data;

};


export {getPrjManegerApi}
