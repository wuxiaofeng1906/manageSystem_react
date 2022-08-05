import axios from 'axios';
import { getDutyPersonPermission, getSystemPersonPermission } from '../../../authority/permission';
import dayjs from 'dayjs';
import { saveBeforeAndAfterOnlineAutoCheck } from '../../../comControl/axiosRequest';
import { isEmpty } from 'lodash';
import PreReleaseServices from '@/services/preRelease';

const sys_accessToken = localStorage.getItem('accessId');
axios.defaults.headers.Authorization = `Bearer ${sys_accessToken}`;

const userLogins: any = localStorage.getItem('userLogins');
const usersInfo = JSON.parse(userLogins);

// 获取上线分支新增时所需的checkNum
const getCheckNumForOnlineBranch = async () => {
  const result: any = {
    message: '',
    data: [],
  };
  await axios
    .get('/api/verify/release/check_num', {})
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

// 上线分支修改-表头数据解析
const alayOnlineCheckHead = (source_data: any) => {
  let f_ignore = '2';
  let b_ignore = '2';
  const testUnit = source_data.test_unit;

  // 判断是否忽略前后端检查
  if (testUnit) {
    testUnit.forEach((ele: any) => {
      if (ele.test_case_technical_side === '1') {
        // 前端
        f_ignore = ele.ignore_check;
      } else if (ele.test_case_technical_side === '2') {
        // 后端
        b_ignore = ele.ignore_check;
      }
    });
  }
  const checkHeadData = {
    branchCheckId: source_data.branch_check_id,
    checkNum: source_data.check_num,
    branchName: source_data.branch_name,
    module: source_data.technical_side,
    ignoreFrontCheck: f_ignore,
    ignoreBackendCheck: b_ignore,
  };

  return checkHeadData;
};
// 分支和版本检查
const alayVersonCheck = (source_data: any) => {
  if (!source_data.version_check || source_data.version_check.length === 0) {
    return {};
  }
  const checkData = source_data.version_check[0];

  const versonCheckData = {
    versionCheckId: checkData.version_check_id,
    checkNum: checkData.check_num,
    verson_check: checkData.backend_version_check_flag,
    server: checkData.server === null ? undefined : checkData.server.split(','),
    imageevn: checkData.image_env,
  };

  const branchCheck = {
    versionCheckId: checkData.version_check_id,
    checkNum: checkData.check_num,
    branchcheck: checkData.inclusion_check_flag,
    branch_mainBranch:
      checkData.main_branch === null ? undefined : checkData.main_branch.split(','),
    branch_teachnicalSide:
      checkData.technical_side === null ? undefined : checkData.technical_side.split(','),
    branch_mainSince: checkData.main_since,
  };

  return { versonCheckData, branchCheck };
};

// 环境一致性检查
const alayEnvironmentCheck = (source_data: any) => {
  if (!source_data.env_check || source_data.env_check.length === 0) {
    return {};
  }

  const envData = source_data.env_check[0];

  return {
    checkNum: envData.check_num,
    checkId: envData.check_id,
    ignoreCheck: envData.ignore_check,
    checkEnv: envData.check_env,
  };
};

// 自动化检查
const autoCheck = (source_data: any) => {
  const autoCheckData = source_data.automation_check;
  if (!source_data.automation_check || source_data.automation_check.length === 0) {
    return {};
  }

  const beforeOnline: any = {
    ignoreCheck: '',
    checkResult: [],
  };
  const afterOnline: any = {
    ignoreCheck: '',
    checkResult: [],
  };
  autoCheckData.forEach((ele: any) => {
    if (ele.check_time === 'before') {
      beforeOnline.ignoreCheck = ele.ignore_check;

      if (ele.check_type === 'ui' && ele.check_result === 'yes') {
        beforeOnline.checkResult.push('ui');
      } else if (ele.check_type === 'api' && ele.check_result === 'yes') {
        beforeOnline.checkResult.push('api');
      } else if (ele.check_type === 'applet' && ele.check_result === 'yes') {
        beforeOnline.checkResult.push('applet');
      }
    } else if (ele.check_time === 'before') {
      afterOnline.ignoreCheck = ele.ignore_check;

      if (ele.check_type === 'ui' && ele.check_result === 'yes') {
        afterOnline.checkResult.push('ui');
      } else if (ele.check_type === 'applet' && ele.check_result === 'yes') {
        afterOnline.checkResult.push('applet');
      }
    }
  });

  return { beforeOnline, afterOnline };
};

// 修改时获取原有数据
const getDetaisByCHeckNum = async (checkNum: string) => {
  const result: any = {
    message: '',
    data: [],
  };
  await axios
    .get('/api/verify/release/release_branch', { params: { check_num: checkNum } })
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

// 获取上线分支修改时的原始数据
const getModifiedData = async (checkNum: string) => {
  const source = await getDetaisByCHeckNum(checkNum);
  const source_data = source.data;

  return {
    checkHead: alayOnlineCheckHead(source_data),
    versonCheck: alayVersonCheck(source_data).versonCheckData,
    branchCheck: alayVersonCheck(source_data).branchCheck,
    envCheck: alayEnvironmentCheck(source_data),
    beforeOnlineCheck: autoCheck(source_data).beforeOnline,
    afterOnlineCheck: autoCheck(source_data).afterOnline,
    hotCheck: source_data.hot_update_check,
  };
};

// 上线分支头部验证
const checkOnlineHeadData = async (sourceData: any) => {
  // "branch_name": sourceData.branchName,
  //   "technical_side": sourceData.module,
  if (!sourceData.branchName) {
    return '分支名称不能为空！';
  }

  if (!sourceData.module) {
    return '技术侧不能为空！';
  }
  if (!sourceData.imageevn) {
    return '镜像环境不能为空！';
  }

  const authData = {
    operate: `保存上线分支`,
    method: 'post',
    path: '/api/verify/release/release_branch',
  };
  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);
  if (dutyPermission.flag || systemPermission.flag) {
    return '';
  }
  if (dutyPermission.errorMessage) {
    return dutyPermission.errorMessage;
  }
  return systemPermission.errorMessage;
};
// 上线分支版本检查验证
const checkOnlineVersionData = async (sourceData: any) => {
  if (sourceData.verson_check) {
    // 如果开启了版本检查，就要判断服务和镜像环境是否填写值
    if (!sourceData.server || sourceData.server.length === 0) {
      return '版本检查-服务不能为空！';
    }
  }

  if (sourceData.branchcheck) {
    // 如果开启了分支对比检查，就要判断被对比的主分支和技术侧以及起始时间是否填写值
    if (!sourceData.branch_mainBranch || sourceData.branch_mainBranch.length === 0) {
      return '分支检查-被对比的主分支不能为空！';
    }

    if (!sourceData.branch_teachnicalSide || sourceData.branch_teachnicalSide.length === 0) {
      return '分支检查-技术侧不能为空！';
    }

    if (!sourceData.branch_mainSince) {
      return '版本检查-对比起始时间不能为空！';
    }
  }

  const authData = {
    operate: `保存上线分支-版本检查设置`,
    method: 'post',
    path: '/api/verify/release/release_check_version',
  };
  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);
  if (dutyPermission.flag || systemPermission.flag) {
    return '';
  }
  if (dutyPermission.errorMessage) {
    return dutyPermission.errorMessage;
  }
  return systemPermission.errorMessage;
};

// 上线环境检查验证
const checkOnlineEnvData = async (sourceData: any) => {
  //   只有没有勾选忽略检查，后面参数才必填
  // if (sourceData.ignoreCheck === undefined || sourceData.ignoreCheck.length === 0) {
  //   if (!sourceData.checkEnv) {
  //     return '环境一致性检查中检查环境不能为空！';
  //   }
  // }

  const authData = {
    operate: `保存上线分支-环境一致性检查设置`,
    method: 'post',
    path: '/api/verify/release/check_env',
  };
  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);
  if (dutyPermission.flag || systemPermission.flag) {
    return '';
  }
  if (dutyPermission.errorMessage) {
    return dutyPermission.errorMessage;
  }
  return systemPermission.errorMessage;
};
const checkHotFreshData = async (sourceData: any) => {
  //   只有没有勾选忽略检查，后面参数才必填
  if (isEmpty(sourceData.is_ignore)) {
    if (isEmpty(sourceData.check_env)) {
      return 'step3 热更新检查中发布环境不能为空！';
    }
  }
  return '';
  //   const authData = {
  //     operate: `保存上线分支-是否可以热更新检查`,
  //     method: 'post',
  //     path: '/api/verify/release/hotupdate',
  //   };
  //   const dutyPermission = await getDutyPersonPermission(authData);
  //   const systemPermission = await getSystemPersonPermission(authData);
  //   if (dutyPermission.flag || systemPermission.flag) {
  //     return '';
  //   }
  //   if (dutyPermission.errorMessage) {
  //     return dutyPermission.errorMessage;
  //   }
  //   return systemPermission.errorMessage;
};

const checkOnlineAutoData = async () => {
  //   没有勾选忽略检查，后面参数必填。如果勾选了，后面的参数可以为空（不再做忽略检查）
  // if (sourceData.autoBeforeIgnoreCheck === undefined || sourceData.autoBeforeIgnoreCheck.length === 0) {
  //   if (sourceData.autoCheckResult === undefined || (sourceData.autoCheckResult).length === 0) {
  //     return "检查结果必须至少勾选一项！";
  //   }
  // }

  const authData = {
    operate: `保存上线分支-自动化检查`,
    method: 'post',
    path: '/api/verify/release/automation_check',
  };
  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);

  if (dutyPermission.flag || systemPermission.flag) {
    return '';
  }
  if (dutyPermission.errorMessage) {
    return dutyPermission.errorMessage;
  }
  return systemPermission.errorMessage;
};

// 线上分支设置保存
const saveOnlineBranch = async (
  type: string,
  currentListNo: string,
  newOnlineBranchNum: string,
  sourceData: any,
) => {
  let frontCheck = '2';
  if (sourceData.ignoreFrontCheck) {
    if (Array.isArray(sourceData.ignoreFrontCheck)) {
      frontCheck = sourceData.ignoreFrontCheck.length === 1 ? '1' : '2';
    } else {
      frontCheck = sourceData.ignoreFrontCheck; // 这个表示没被修改过，直接带过来的数据
    }
  }

  let backendCheck = '2';
  if (sourceData.ignoreBackendCheck) {
    if (Array.isArray(sourceData.ignoreBackendCheck)) {
      backendCheck = sourceData.ignoreBackendCheck.length === 1 ? '1' : '2';
    } else {
      backendCheck = sourceData.ignoreBackendCheck;
    }
  }
  const data = {
    check_num: newOnlineBranchNum,
    user_name: usersInfo.name,
    user_id: usersInfo.userid,
    ready_release_num: currentListNo,
    branch_name: sourceData.branchName,
    technical_side: sourceData.module,
    ignore_check_test_unit_front: frontCheck,
    ignore_check_test_unit_backend: backendCheck,
  };

  if (type === '修改') {
    data['branch_check_id'] = sourceData.branchCheckId;
  }

  let errorMessage = '';
  await axios
    .post('/api/verify/release/release_branch', data)
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

// 线上版本检查
const saveVersonCheck = async (
  type: string,
  currentListNo: string,
  newOnlineBranchNum: string,
  sourceData: any,
) => {
  const data = {
    check_num: newOnlineBranchNum,
    user_name: usersInfo.name,
    user_id: usersInfo.userid,
    backend_version_check_flag: false, // 是否开启版本检查
    inclusion_check_flag: false, // 是否开启分支检查
  };

  // 判断是否开启版本检查，如果没开启，则不传相关字段
  if (sourceData?.verson_check) {
    // true 已开启
    // 服务
    const { server } = sourceData;
    let serverStr = '';
    if (server && server.length > 0) {
      // if (server[0] === "全部") {
      //   // 需要获取所有的服务
      //   const allServices: any = (await getServices())?.data;
      //   if (allServices && allServices.length > 0) {
      //     allServices.forEach((ele: any) => {
      //       serverStr = serverStr === '' ? ele.server_id : `${serverStr},${ele.server_id}`;
      //     });
      //   }
      // } else {
      server.forEach((ele: string) => {
        serverStr = serverStr === '' ? ele : `${serverStr},${ele}`;
      });
      // }
    }

    data.backend_version_check_flag = true;
    data['server'] = serverStr;
    data['image_branch'] = sourceData.branchName; // 传分支名称
    data['image_env'] = sourceData.imageevn; // 镜像环境
  }

  if (sourceData?.branchcheck) {
    // 被对比的主分支
    const main_branch = sourceData.branch_mainBranch;
    let mainBranch = '';
    main_branch.forEach((ele: string) => {
      mainBranch = mainBranch === '' ? ele : `${mainBranch},${ele}`;
    });

    // 技术侧
    const technical_side = sourceData.branch_teachnicalSide;
    let techSide = '';
    technical_side.forEach((ele: string) => {
      techSide = techSide === '' ? ele : `${techSide},${ele}`;
    });
    data.inclusion_check_flag = true;
    data['main_branch'] = mainBranch; // 主分支
    data['technical_side'] = techSide; // 技术侧
    data['target_branch'] = sourceData.branchName; // 传分支名称
    data['main_since'] = dayjs(sourceData.branch_mainSince).format('YYYY-MM-DD'); // 时间
  }

  if (type === '修改') {
    data['version_check_id'] = sourceData.versionCheckId;
  }

  let errorMessage = '';
  await axios
    .post('/api/verify/release/release_check_version', data)
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

// 环境一致性检查
const saveEnvironmentCheck = async (
  type: string,
  currentListNo: string,
  newOnlineBranchNum: string,
  sourceData: any,
) => {
  let ignoreCheck = '2';
  if (sourceData.ignoreCheck) {
    if (Array.isArray(sourceData.ignoreCheck)) {
      ignoreCheck = sourceData.ignoreCheck.length === 1 ? '1' : '2';
    } else {
      ignoreCheck = sourceData.ignoreCheck;
    }
  }

  const data = {
    check_num: newOnlineBranchNum,
    user_name: usersInfo.name,
    user_id: usersInfo.userid,
    ignore_check: ignoreCheck,
    check_env: sourceData.checkEnv,
  };

  // if (ignore_check === "2") { // 如果没有忽略检查
  //   data["check_env"] = sourceData.checkEnv;
  // }

  if (type === '修改') {
    data['check_id'] = sourceData.envCheckId;
  }

  let errorMessage = '';
  await axios
    .post('/api/verify/release/check_env', data)
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

// 上线前自动化检查
const saveOnlineAutoCheck = async (
  type: string,
  currentListNo: string,
  newOnlineBranchNum: string,
  sourceData: any,
) => {
  // 上线前检查: 打勾是yes，没打勾是no
  let before_ignore_check = 'no';
  if (sourceData.autoBeforeIgnoreCheck) {
    if (Array.isArray(sourceData.autoBeforeIgnoreCheck)) {
      before_ignore_check = sourceData.autoBeforeIgnoreCheck.length === 1 ? 'yes' : 'no';
    } else {
      before_ignore_check = sourceData.autoBeforeIgnoreCheck;
    }
  }
  const data = [
    {
      user_name: usersInfo.name,
      user_id: usersInfo.userid,
      ignore_check: before_ignore_check,
      check_time: 'before',
      check_type: 'api',
      check_result: 'no',
      test_env: sourceData.imageevn,
      check_num: newOnlineBranchNum,
      ready_release_num: currentListNo,
    },
    {
      user_name: usersInfo.name,
      user_id: usersInfo.userid,
      ignore_check: before_ignore_check,
      check_time: 'before',
      check_type: 'ui',
      check_result: 'no',
      test_env: sourceData.imageevn,
      check_num: newOnlineBranchNum,
      ready_release_num: currentListNo,
    },
    {
      user_name: usersInfo.name,
      user_id: usersInfo.userid,
      ignore_check: before_ignore_check,
      check_time: 'before',
      check_type: 'applet',
      check_result: 'no',
      test_env: sourceData.imageevn,
      check_num: newOnlineBranchNum,
      ready_release_num: currentListNo,
    },
  ];

  if (before_ignore_check === 'no' && sourceData.autoCheckResult.length > 0) {
    sourceData.autoCheckResult.forEach((ele: string) => {
      if (ele === 'api') {
        data[0].check_result = 'yes';
      } else if (ele === 'ui') {
        data[1].check_result = 'yes';
      } else if (ele === 'applet') {
        data[2].check_result = 'yes';
      }
    });
  }
  const messageRt = await saveBeforeAndAfterOnlineAutoCheck(data);
  return messageRt;
};

// 保存上线分支的设置
const saveOnlineBranchData = async (
  type: string,
  currentListNo: string,
  newOnlineBranchNum: string,
  sourceData: any,
) => {
  //  保存分了5个接口，
  //  1.上线分支头部设置
  //  2.版本检查设置
  //  3.环境一致性检查
  //  4.是否热更
  //  5.自动化检查设置

  // 上线分支头部验证分支名称和技术侧
  const checkMsg_onlineHead = await checkOnlineHeadData(sourceData);
  if (checkMsg_onlineHead) {
    // 如果校验信息不为空，代表校验失败
    return checkMsg_onlineHead;
  }

  // 版本检查设置
  const checkMsg_versonCheck = await checkOnlineVersionData(sourceData);
  if (checkMsg_versonCheck) {
    return checkMsg_versonCheck;
  }

  // 环境一致性检查设置
  const checkMsg_envCheck = await checkOnlineEnvData(sourceData);
  if (checkMsg_envCheck) {
    return checkMsg_envCheck;
  }
  // 热更新检查
  const checkMsg_hotFreshCheck = await checkHotFreshData(sourceData);
  if (checkMsg_hotFreshCheck) {
    return checkMsg_hotFreshCheck;
  }

  // 自动化检查参数（暂时不做自动化必填参数检查）
  // const checkMsg_autoCheck = await checkOnlineAutoData(sourceData);
  // if (checkMsg_autoCheck) {
  //   return checkMsg_autoCheck;
  // }

  /* 开始调用接口进行结果保存  */

  let returnMessage = '';
  // 保存线上分支
  const onlineBranch = await saveOnlineBranch(type, currentListNo, newOnlineBranchNum, sourceData);
  if (onlineBranch !== '') {
    returnMessage = `上线分支保存失败：${onlineBranch}`;
  }

  // 保存版本检查
  const versonCheck = await saveVersonCheck(type, currentListNo, newOnlineBranchNum, sourceData);
  if (versonCheck !== '') {
    returnMessage =
      returnMessage === ''
        ? `版本检查设置保存失败：${versonCheck}`
        : `${returnMessage}；\n版本检查设置保存失败：${versonCheck}`;
  }

  // 保存环境检查
  const enviromentCheck = await saveEnvironmentCheck(
    type,
    currentListNo,
    newOnlineBranchNum,
    sourceData,
  );
  if (enviromentCheck !== '') {
    returnMessage =
      returnMessage === ''
        ? `环境一致性检查保存失败：${enviromentCheck}`
        : `${returnMessage}；\n环境一致性检查保存失败：${enviromentCheck}`;
  }

  // 热更新检查
  try {
    await PreReleaseServices.saveHotEnv({
      check_num: newOnlineBranchNum,
      user_name: usersInfo.name,
      user_id: usersInfo.userid,
      check_env: sourceData.imageevn,
      is_ignore: isEmpty(sourceData.is_ignore) ? 'no' : 'yes',
      release_env: sourceData.check_env ?? '',
    });
  } catch (e) {
    returnMessage = `热更新检查保存失败：${e}`;
  }

  // 如果有勾选信息，才进行 自动化检查接口调用
  if (
    (sourceData.autoBeforeIgnoreCheck && sourceData.autoBeforeIgnoreCheck.length > 0) ||
    (sourceData.autoCheckResult && sourceData.autoCheckResult.length > 0)
  ) {
    // 要做权限判断
    const checkMsg_autoCheck = await checkOnlineAutoData();
    if (checkMsg_autoCheck) {
      return checkMsg_autoCheck;
    }

    const onlineAutoCheck = await saveOnlineAutoCheck(
      type,
      currentListNo,
      newOnlineBranchNum,
      sourceData,
    );
    if (onlineAutoCheck !== '') {
      returnMessage =
        returnMessage === ''
          ? `自动化检查保存失败：${onlineAutoCheck}`
          : `${returnMessage}；\n自动化检查保存失败：${onlineAutoCheck}`;
    }
  }
  return returnMessage;
};

// 执行版本检查
const excuteVersionCheck = async (checkNum: string) => {
  const data = {
    user_name: usersInfo.name,
    user_id: usersInfo.userid,
    check_num: checkNum,
  };
  let errorMessage = '';
  await axios
    .post('/api/verify/release/version_check', data)
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

// 执行环境检查
const excuteEnvCheck = async (checkNum: string) => {
  const data = {
    user_name: usersInfo.name,
    user_id: usersInfo.userid,
    check_num: checkNum,
  };
  let errorMessage = '';
  await axios
    .post('/api/verify/release/env_check', data)
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

// 执行自动化检查
const excuteAutoCheck = async (checkNum: string, checkTime: string) => {
  const data = {
    user_name: usersInfo.name,
    user_id: usersInfo.userid,
    check_num: checkNum,
    check_time: checkTime,
  };
  let errorMessage = '';
  await axios
    .post('/api/verify/release/automation_check_perform', data)
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

// 执行上线分支的各类检查
const executeOnlineCheck = async (type: string, checkNum: string) => {
  switch (type) {
    case 'versionCheck':
      return await excuteVersionCheck(checkNum);
      break;

    case 'envCheck':
      return await excuteEnvCheck(checkNum);
      break;

    case 'beforeOnlineCheck':
      return await excuteAutoCheck(checkNum, '1');
      break;

    case 'afterOnlineCheck':
      return await excuteAutoCheck(checkNum, '2');
      break;

    default:
      return 'error';
      break;
  }
};

export { getCheckNumForOnlineBranch, getModifiedData, saveOnlineBranchData, executeOnlineCheck };
