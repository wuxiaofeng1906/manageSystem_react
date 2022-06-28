// 发布类型
import axios from 'axios';

const queryReleaseType = async () => {
  const result: any = {
    message: '',
    data: [],
  };
  await axios
    .get('/api/verify/release/release_type', {})
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

// 发布方式
const queryReleaseWay = async () => {
  const result: any = {
    message: '',
    data: [],
  };
  await axios
    .get('/api/verify/release/release_way', {})
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

// 发布方式
const queryDutyNames = async () => {
  const result: any = {
    message: '',
    data: [],
  };
  await axios
    .get('/api/verify/release/duty', {})
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

// 一键部署Id
const queryReleaseId = async () => {
  const result: any = {
    message: '',
    data: [],
  };
  await axios
    .get('/api/verify/release/deployment_id', {})
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

// 获取上线环境
const getOnlineDev = async () => {
  const result: any = {
    message: '',
    data: [],
  };
  await axios
    .get('/api/verify/release/online_environment', {})
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

// 获取发布项
const getPulishItem = async () => {
  const result: any = {
    message: '',
    data: [],
  };
  await axios
    .get('/api/verify/release/release_item', {})
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

// 获取是否涉及接口和数据库升级
const getIsApiAndDatabaseUpgrade = async () => {
  const result: any = {
    message: '',
    data: [],
  };
  await axios
    .get('/api/verify/release/api_database_upgrade', {})
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

// 升级接口
const getUpgradeApi = async () => {
  const result: any = {
    message: '',
    data: [],
  };
  await axios
    .get('/api/verify/release/upgrade_api', {})
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

//  接口服务
const getApiService = async () => {
  const result: any = {
    message: '',
    data: [],
  };
  await axios
    .get('/api/verify/release/api_service', {})
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

//  接口method
const getApiMethod = async () => {
  const result: any = {
    message: '',
    data: [],
  };
  await axios
    .get('/api/verify/release/method', {})
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

// 修复类别
const getRepaireCategory = async () => {
  const result: any = {
    message: '',
    data: [],
  };
  await axios
    .get('/api/verify/release/repair_type', {})
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

// 技术侧
const getTechSide = async () => {
  const result: any = {
    message: '',
    data: [],
  };
  await axios
    .get('/api/verify/release/technical_side', {})
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

// 获取检查类型
const getCheckType = async () => {
  const result: any = {
    message: '',
    data: [],
  };
  await axios
    .get('/api/verify/release/check_type', {})
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

// 获取浏览器类型
const getBrowserType = async () => {
  const result: any = {
    message: '',
    data: [],
  };
  await axios
    .get('/api/verify/release/browser', {})
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


const saveBeforeAndAfterOnlineAutoCheck = async (data: any) => {
  let errorMessage = '';
  await axios
    .post('/api/verify/release/automation_check', data)
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
export {
  queryReleaseType,
  queryReleaseWay,
  queryReleaseId,
  getOnlineDev,
  getPulishItem,
  getIsApiAndDatabaseUpgrade,
  getUpgradeApi,
  getApiService,
  getApiMethod,
  getRepaireCategory,
  getTechSide,
  getCheckType,
  getBrowserType,
  queryDutyNames,
  saveBeforeAndAfterOnlineAutoCheck
};
