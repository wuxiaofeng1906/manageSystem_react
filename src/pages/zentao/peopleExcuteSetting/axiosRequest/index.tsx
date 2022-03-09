import axios from 'axios';

const sys_accessToken = localStorage.getItem('accessId');
axios.defaults.headers.Authorization = `Bearer ${sys_accessToken}`;

const userLogins: any = localStorage.getItem('userLogins');
const usersInfo = JSON.parse(userLogins);

// 禅道人员获取
const getZentaoUsers = async () => {
  const result: any = {
    message: '',
    data: [],
  };
  await axios
    .get('/api/verify/zentao/users')
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

// 职位
const getPositions = async () => {
  const result: any = {
    message: '',
    data: [],
  };
  await axios
    .get('/api/verify/zentao/position')
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

// 执行类型
const getExcuteType = async () => {
  const result: any = {
    message: '',
    data: [],
  };
  await axios
    .get('/api/verify/zentao/execution_type')
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

// 获取执行选项
const getExcution = async (excuteType: string) => {
  const result: any = {
    message: '',
    data: [],
  };
  await axios
    .get('/api/verify/zentao/executions', {params: {execution_type: excuteType}})
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

// 查询已经保存了的分配数据
const getDistributeDetails = async () => {
  const result: any = {
    message: '',
    data: [],
  };
  await axios
    .get('/api/verify/zentao/distribution')
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


// 执行分配
const excuteDistribute = () => {

};

// 保存分配
const saveDistribute = () => {

};
export {
  getZentaoUsers,
  getPositions,
  getExcuteType,
  getExcution,
  excuteDistribute,
  saveDistribute,
  getDistributeDetails
};
