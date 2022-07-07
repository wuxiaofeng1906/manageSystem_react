import axios from 'axios';
import {getDutyPersonPermission, getSystemPersonPermission} from '../../../authority/permission';
import {queryReleaseId} from "@/pages/onDutyAndRelease/preRelease/comControl/axiosRequest";

const sys_accessToken = localStorage.getItem('accessId');
axios.defaults.headers.Authorization = `Bearer ${sys_accessToken}`;

const userLogins: any = localStorage.getItem('userLogins');
const usersInfo = JSON.parse(userLogins);


// 一键部署ID之升级接口数据获取
const queryServiceByID = async (params: string) => {
  const result: any = {
    message: '',
    data: [],
  };

  await axios
    .post('/api/verify/release/env_branch', params)
    .then(function (res) {
      if (res.data.code === 200) {
        result.data = []; // 无用代码，没有删除
      } else {
        result.message = `错误：${res.data.msg}`;
      }
    })
    .catch(function (error) {
      result.message = `异常信息:${error.toString()}`;
    });

  return result;
};

// 点击查询
const inquireService = async (releasedIDArray: any, currentListNo: string) => {
  if (!releasedIDArray || releasedIDArray.length === 0) {
    return {
      message: '一键部署ID不能为空！',
      datas: [],
    };
  }
  //
  // if (sorce.oraID.length > 0 && sorce.queryId.length <= 0) {
  //   return {
  //     message: 'ID已不存在运维平台！',
  //     datas: [],
  //   };
  // }

  const allIdsArray = (await queryReleaseId(currentListNo)).data;
  const paramsData: any = [];
  releasedIDArray.forEach((ele: any) => {
    allIdsArray.forEach((id_str: any) => {
      if (ele === (id_str.id).toString()) {
        paramsData.push({
          "deployment_id": ele,
          "automation_check": id_str.automation_test,
          "service": id_str.service,
          "ready_release_num": currentListNo
        });
      }
    });
  });

  // 验证权限
  const authData = {
    operate: '查询一键部署ID',
    method: 'post',
    path: '/api/verify/release/env_branch',
  };

  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);
  if (dutyPermission.flag || systemPermission.flag) {
    const result = await queryServiceByID(paramsData);
    return result;
  }
  if (dutyPermission.errorMessage) {
    return {
      message: dutyPermission.errorMessage,
      datas: [],
    };
  }

  return {
    message: systemPermission.errorMessage,
    datas: [],
  };
};

// 修改发布项
const saveUpgradeItem = async (params: any) => {
  let errorMessage = '';
  await axios
    .post('/api/verify/release/upgrade_service', params)
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

// 发布项的修改
const upgradePulishItem = async (formData: any, currentListNo: string) => {
  if (!formData.onlineEnv) {
    return '上线环境不能为空！';
  }
  if (!formData.pulishItem) {
    return '发布项不能为空！';
  }
  if (!formData.application) {
    return '应用不能为空！';
  }
  if (!formData.branchAndEnv) {
    return '分支和环境不能为空！';
  }
  if (!formData.interAndDbUpgrade) {
    return '是否涉及接口和数据库升级不能为空！';
  }

  if (!formData.hotUpdate) {
    return '是否支持热更新不能为空！';
  }

  let onlineEnvStr = '';
  formData.onlineEnv.forEach((ele: any) => {
    onlineEnvStr = onlineEnvStr === '' ? ele : `${onlineEnvStr},${ele}`;
  });

  const datas = {
    app_id: formData.appId,
    automation_check: formData.automationTest,
    deployment_id: formData.deploymentId,
    ready_release_num: currentListNo,
    user_name: usersInfo.name,
    user_id: usersInfo.userid,
    online_environment: onlineEnvStr,
    release_item: formData.pulishItem,
    app: formData.application,
    is_upgrade_api_database: formData.interAndDbUpgrade,
    hot_update: formData.hotUpdate,
    branch_environment: formData.branchAndEnv,
    instructions: formData.description,
    remarks: formData.remark,
  };

  // 该周前端值班人、后端值班人、测试值班人、流程：杨期成、超级管理员
  const authData = {
    operate: '修改发布项',
    method: 'post',
    path: '/api/verify/release/upgrade_service',
  };
  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);
  if (dutyPermission.flag || systemPermission.flag) {
    // 需要验证必填项
    return await saveUpgradeItem(datas);
  }
  if (dutyPermission.errorMessage) {
    return dutyPermission.errorMessage;
  }
  return systemPermission.errorMessage;
};

// 保存发布接口
const savePulishApi = async (params: any) => {
  let errorMessage = '';
  await axios
    .post('/api/verify/release/upgrade_api', params)
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

// 发布接口保存
const addPulishApi = async (formData: any, currentListNo: string, type: string) => {
  if (!formData.onlineEnv) {
    return '上线环境不能为空';
  }

  if (!formData.upInterface) {
    return '升级接口不能为空';
  }
  if (!formData.interService) {
    return '接口服务不能为空';
  }

  if (!formData.renter) {
    return '涉及租户不能为空';
  }

  if (!formData.method) {
    return '接口Method不能为空';
  }

  if (!formData.URL) {
    return '接口URL不能为空';
  }

  // if (!formData.hotUpdate) {
  //   return '是否热更新不能为空';
  // }

  let onlineEnvStr = '';
  formData.onlineEnv.forEach((ele: any) => {
    onlineEnvStr = onlineEnvStr === '' ? ele : `${onlineEnvStr},${ele}`;
  });

  const datas = {
    user_name: usersInfo.name,
    user_id: usersInfo.userid,
    online_environment: onlineEnvStr,
    update_api: formData.upInterface,
    api_service: formData.interService,
    api_url: formData.URL,
    api_method: formData.method,
    hot_update: "2",
    related_tenant: formData.renter,
    remarks: formData.remark,
    ready_release_num: currentListNo,
  };

  if (type === '修改') {
    datas['api_id'] = formData.apiId;
  }

  // 该周前端值班人、后端值班人、测试值班人、流程：杨期成、超级管理员
  const authData = {
    operate: `${type}发布接口`,
    method: 'post',
    path: '/api/verify/release/upgrade_api',
  };
  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);
  if (dutyPermission.flag || systemPermission.flag) {
    return await savePulishApi(datas);
  }
  if (dutyPermission.errorMessage) {
    return dutyPermission.errorMessage;
  }
  return systemPermission.errorMessage;
};

// 删除接口
const deleteReleasedId = async (ready_release_num: string, deployment_id: string) => {
  let errorMessage = '';

  const datas = {
    user_name: usersInfo.name,
    user_id: usersInfo.userid,
    deployment_id: deployment_id,
    ready_release_num: ready_release_num,
  };

  await axios
    .delete('/api/verify/release/upgrade_service_deployment', {data: datas})
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

// 删除一键发布ID
const deleteReleasedID = async (deployment_id: string, ready_release_num: string) => {
  // 验证权限(值班测试和超级管理员)
  const authData = {
    operate: '删除一键部署ID',
    method: 'delete',
    path: '/api/verify/release/upgrade_service_deployment',
  };

  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);
  if (dutyPermission.flag || systemPermission.flag) {
    return deleteReleasedId(deployment_id, ready_release_num);
  }
  if (dutyPermission.errorMessage) {
    return dutyPermission.errorMessage;
  }
  return systemPermission.errorMessage;
};

export {inquireService, upgradePulishItem, addPulishApi, deleteReleasedID};
