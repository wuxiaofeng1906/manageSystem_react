import axios from 'axios';
import {getDutyPersonPermission, getSystemPersonPermission} from '../../../authority/permission';
import dayjs from 'dayjs';

const sys_accessToken = localStorage.getItem('accessId');
axios.defaults.headers.Authorization = `Bearer ${sys_accessToken}`;

const userLogins: any = localStorage.getItem('userLogins');
const usersInfo = JSON.parse(userLogins);

// 保存预发布项目
const savePrePulishProjects = async (params: any, listNo: string) => {

  const prjIdArray = params.projectsName;
  let projectId = '';
  prjIdArray.forEach((project: string) => {
    const proID = project.split('&')[1];
    projectId = projectId === '' ? proID : `${projectId},${proID}`;
  });

  const data = {
    user_name: usersInfo.name,
    user_id: usersInfo.userid,
    project_id_set: projectId,
    release_type: params.pulishType,
    release_way: params.pulishMethod,
    plan_release_time: dayjs(params.pulishTime).format('YYYY-MM-DD HH:mm:ss'),
    ready_release_num: listNo,
    ignore_check: params.ignoreZentaoList,
    person_duty_num: params.relateDutyName
  };

  if (params.proid) {
    data['pro_id'] = Number(params.proid);
  }

  // const hostIp = getCurrentProxy();
  // const url = `${hostIp}api/verify/duty/plan_data`;
  const result: any = {
    datas: {},
    errorMessage: '',
  };
  await axios
    .post('/api/verify/release/release_project', data)
    .then(function (res) {
      if (res.data.code === 200) {
        const timeData = res.data.data;
        if (timeData) {
          result.datas = {
            editor: usersInfo.name,
            editTime: timeData.edit_time,
          };
        }
      } else {
        result.errorMessage = `错误：${res.data.msg}`;
      }
    })
    .catch(function (error) {
      result.errorMessage = `异常信息:${error.toString()}`;
    });

  return result;
};

// 保存预发布项目
const savePreProjects = async (source: any, releaseNum: string) => {
  debugger;
  let result = {
    datas: [],
    errorMessage: '',
  };
  // 需要判断输入框不为空
  if (!source.projectsName || source.projectsName.length === 0) {
    result.errorMessage = '项目名称不能为空！';
    return result;
  }

  if (!source.pulishType) {
    result.errorMessage = '发布类型不能为空！';
    return result;
  }

  if (!source.pulishMethod) {
    result.errorMessage = '发布方式不能为空！';
    return result;
  }

  if (!source.pulishTime) {
    result.errorMessage = '发布时间不能为空！';
    return result;
  }

  // 如果只有一个emergency项目，则不需要验证是否为空
  // if (!source.relateDutyName) {
  //   result.errorMessage = '关联值班名单不能为空！';
  //   return result;
  // }

  // 验证权限(值班测试和超级管理员)
  const authData = {
    operate: '保存预发布项目',
    method: 'post',
    path: '/api/verify/release/release_project',
  };

  const dutyPermission = await getDutyPersonPermission(authData);
  const systemPermission = await getSystemPersonPermission(authData);
  if (dutyPermission.flag || systemPermission.flag) {
    result = await savePrePulishProjects(source, releaseNum);
    return result;
  }
  if (dutyPermission.errorMessage) {
    result.errorMessage = dutyPermission.errorMessage;
    return result;
  }
  result.errorMessage = systemPermission.errorMessage;
  return result;
};

export {savePreProjects};
