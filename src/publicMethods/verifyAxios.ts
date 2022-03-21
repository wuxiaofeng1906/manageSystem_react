import axios from "axios";

// 此接口可以分类获取前后端以及测试的人员（参数：“1”，“2”，“3”）
const getAllUsers = async (_tech: string) => {
  const userInfo: any = {
    message: "",
    data: []
  };

  await axios.get('/api/verify/duty/person', {params: {tech: _tech}})
    .then(function (res) {

      if (res.data.code === 200) {
        userInfo.data = res.data.data;

      } else {
        userInfo.message = `错误：${res.data.msg}`;
      }

    }).catch(function (error) {
      userInfo.message = `异常信息:${error.toString()}`;
    });

  return userInfo;

};

// 此接口获取项目名
const getAllProject = async () => {
  const projectInfo = {
    message: "",
    data: []
  };

  await axios.get('/api/verify/duty/project')
    .then(function (res) {
      if (res.data.code === 200) {
        projectInfo.data = res.data.data;
      } else {
        projectInfo.message = `错误：${res.data.msg}`;
      }

    }).catch(function (error) {
      projectInfo.message = `异常信息:${error.toString()}`;
    });

  return projectInfo;

};

// 此接口获取项目类型（特性项目或者班车项目）
const getProjectType = async () => {
  const projectInfo = {
    message: "",
    data: []
  };

  await axios.get('/api/verify/duty/project_type')
    .then(function (res) {
        if (res.data.code === 200) {
          projectInfo.data = res.data.data;
        } else {
          projectInfo.message = `错误：${res.data.msg}`;
        }
      }
    ).catch(function (error) {
      projectInfo.message = `异常信息:${error.toString()}`;
    });

  return projectInfo;

};

// 获取分支
const getBranchName = async () => {
  const branchInfo = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/sonar/branch')
    .then(function (res) {

      if (res.data.code === 200) {
        branchInfo.data = res.data.data;
      } else {
        branchInfo.message = `错误：${res.data.msg}`;
      }

    }).catch(function (error) {
      branchInfo.message = `异常信息:${error.toString()}`;

    });
  return branchInfo;
};

// 获取对应环境
const getEnvironment = async () => {
  const envInfo = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/project/image_env', {params: {}})
    .then(function (res) {

      if (res.data.code === 200) {
        envInfo.data = res.data.data;
      } else {
        envInfo.message = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      envInfo.message = `异常信息:${error.toString()}`;
    });

  return envInfo;
};

// 获取负责人(里面包含了企业微信所有人)
const getPrincipal = async () => {
  const principalInfo = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/duty/project_leader', {params: {}})
    .then(function (res) {

      if (res.data.code === 200) {
        principalInfo.data = res.data.data;
      } else {
        principalInfo.message = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      principalInfo.message = `异常信息:${error.toString()}`;
    });

  return principalInfo;
};

// 获取所有人员（里面包含了企业微信所有人）
const getAllDeptUsers = async () => {
  const principalInfo = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/apply/applicant', {params: {}})
    .then(function (res) {

      if (res.data.code === 200) {
        principalInfo.data = res.data.data;
      } else {
        principalInfo.message = `错误：${res.data.msg}`;
      }
    }).catch(function (error) {
      principalInfo.message = `异常信息:${error.toString()}`;
    });

  return principalInfo;
};

// 获取服务
const getServices = async () => {
  const result = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/project/server', {params: {}})
    .then(function (res) {
      if (res.data.code === 200) {

        result.data = res.data.data;
      } else {
        result.message = `错误：${res.data.msg}`;
      }

    }).catch(function (error) {
      result.message = `异常信息:${error.toString()}`;

    });
  return result;
};

// 获取镜像环境
const getImgEnv = async () => {
  const result = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/project/image_env', {params: {}})
    .then(function (res) {
      if (res.data.code === 200) {

        result.data = res.data.data;
      } else {
        result.message = `错误：${res.data.msg}`;
      }

    }).catch(function (error) {
      result.message = `异常信息:${error.toString()}`;

    });
  return result;
}

// 获取测试环境
const getTestEnv = async () => {
  const result = {
    message: "",
    data: []
  };
  await axios.get('/api/verify/release/env', {params: {}})
    .then(function (res) {
      if (res.data.code === 200) {

        result.data = res.data.data;
      } else {
        result.message = `错误：${res.data.msg}`;
      }

    }).catch(function (error) {
      result.message = `异常信息:${error.toString()}`;

    });
  return result;
}

export {
  getAllUsers, getAllProject, getProjectType, getBranchName, getEnvironment, getPrincipal, getAllDeptUsers,
  getServices, getImgEnv,getTestEnv
};
