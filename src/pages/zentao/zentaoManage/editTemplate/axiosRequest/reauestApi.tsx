import axios from 'axios';

const sys_accessToken = localStorage.getItem('accessId');
axios.defaults.headers.Authorization = `Bearer ${sys_accessToken}`;

// const userLogins: any = localStorage.getItem('userLogins');
// const usersInfo = JSON.parse(userLogins);

// 获取模板类型
const requestTempType = async () => {
  let data: any = [];
  await axios.get('/api/verify/zentao/temp_type')
    .then(function (res) {
      if (res.data.code === 200) {
        data = res.data.data;
      }
    })
    .catch(function (error) {
      console.log("模板类型获取失败", error)
    });

  return data;
};

// 获取增加类型
const requestAddType = async () => {
  let data: any = [];
  await axios.get('/api/verify/zentao/add_type')
    .then(function (res) {
      if (res.data.code === 200) {
        data = res.data.data;
      }
    })
    .catch(function (error) {
      console.log("添加类型获取失败", error)
    });

  return data;
};

// 获取指派人
const requestAssignedTo = async () => {
  let data: any = [];
  await axios.get('/api/verify/zentao/users')
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

//  优先级
const requestPriorityApi = async () => {
  let data: any = [];
  await axios.get('/api/verify/zentao/priority')
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


//  任务类型
const requestTaskTypeApi = async () => {
  let data: any = [];
  await axios.get('/api/verify/zentao/task_type')
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

//  所属端
const requestSideApi = async () => {
  let data: any = [];
  await axios.get('/api/verify/zentao/belongs')
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

//  任务来源
const requestTaskSourceApi = async () => {
  let data: any = [];
  await axios.get('/api/verify/zentao/source')
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







// 获取模板详情列表
const requestTemplateDetailsApi = async (tempID: string) => {
  let data: any = [];
  await axios.get('/api/verify/zentao/temp_detail', {params: {temp_id: tempID}})
    .then(function (res) {
      if (res.data.code === 200) {
        data = res.data.data;
      }
    })
    .catch(function (error) {
      console.log("模板详情获取失败", error)
    });

  return data;
};

// 删除模板列表
// const requestDelTempleApi = (tempId: string) => {
//
//   let returnMsg = "";
//   axios.delete('/api/verify/zentao/temp_list', {data: {temp_id: tempId}})
//     .then(function (res) {
//       if (res.data.code !== 200) {
//         returnMsg = res.data.msg;
//       }
//     })
//     .catch(function (error) {
//       returnMsg = error;
//     });
//
//   return returnMsg;
// };

export {
  requestTempType,
  requestAddType,
  requestAssignedTo,
  requestPriorityApi,
  requestTaskTypeApi,
  requestSideApi,
  requestTaskSourceApi,

  requestTemplateDetailsApi,

}
