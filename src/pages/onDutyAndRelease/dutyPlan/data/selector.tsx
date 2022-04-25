// 值班人员选择框
import {
  getAllProject,
  getAllUsers,
  getAllDeptUsers,
  getBranchName,
  getEnvironment,
  getProjectType
} from "@/publicMethods/verifyAxios";
import {message, Select} from "antd";
import React from "react";

const {Option} = Select;

const loadUserSelect = async (teach: string) => {

  const teachData: any = [<Option key={""} value={`""&免`}>免</Option>];
  const userInfo = await getAllUsers(teach);

  if (userInfo.message !== "") {
    message.error({
      content: userInfo.message,
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
  } else if (userInfo.data) {
    const {data} = userInfo;
    data.forEach((user: any) => {
      teachData.push(
        <Option key={user.user_id} value={`${user.user_id}&${user.user_name}`}>{user.user_name}</Option>);
    });
  }
  return teachData;
};

// 获取企业微信所有人
const loadAllUserSelect = async () => {

  const teachData: any = [<Option key={""} value={`""&免`}>免</Option>];
  const userInfo = await getAllDeptUsers();

  if (userInfo.message !== "") {
    message.error({
      content: userInfo.message,
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
  } else if (userInfo.data) {
    const {data} = userInfo;
    data.forEach((user: any) => {
      teachData.push(
        <Option key={user.user_id} value={`${user.user_id}&${user.user_name}`}>{user.user_name}</Option>);
    });
  }
  return teachData;
};

// 项目名称选择框
const loadPrjNameSelect = async () => {
  const prjNames = await getAllProject();
  const prjData: any = [];

  if (prjNames.message !== "") {
    message.error({
      content: prjNames.message,
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
  } else if (prjNames.data) {
    const datas = prjNames.data;
    datas.forEach((project: any) => {
      prjData.push(
        <Option key={project.project_id}
                value={`${project.project_id}&${project.project_name}`}>{project.project_name}</Option>);
    });
  }

  return prjData;

};

// 项目类型选择框
const loadPrjTypeSelect = async () => {
  const prjNames = await getProjectType();
  const prjData: any = [];

  if (prjNames.message !== "") {
    message.error({
      content: prjNames.message,
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
  } else if (prjNames.data) {
    const datas = prjNames.data;
    datas.forEach((project: any) => {
      prjData.push(
        <Option key={project.project_type} value={project.project_type}>{project.project_type_name}</Option>);
    });
  }

  return prjData;

};

// 分支选择框
const loadBanchSelect = async () => {

  const branchInfo = await getBranchName();
  const branchData: any = [];

  if (branchInfo.message !== "") {
    message.error({
      content: branchInfo.message,
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
  } else if (branchInfo.data) {
    const datas = branchInfo.data;
    datas.forEach((branch: any) => {
      branchData.push(
        <Option key={branch.branch_id} value={branch.branch_name}>{branch.branch_name}</Option>);
    });
  }

  return branchData;

};

// 发布环境选择框
const loadEnvironmentSelect = async () => {
  const envData = await getEnvironment();
  const environmentData: any = [];

  if (envData.message !== "") {
    message.error({
      content: envData.message,
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
  } else if (envData.data) {
    const datas = envData.data;
    datas.forEach((env: any) => {
      environmentData.push(
        <Option key={env.env_id} value={env.image_env}>{env.image_env}</Option>);
    });
  }

  return environmentData;

};


export {
  loadUserSelect, loadPrjNameSelect, loadPrjTypeSelect, loadBanchSelect, loadEnvironmentSelect,
  loadAllUserSelect
}
