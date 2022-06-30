import axios from "axios";
import {Select} from "antd";
import {axiosGet, axiosPost} from "@/publicMethods/axios";
import {errorMessage} from "@/publicMethods/showMessages";
import React from "react";

const {Option} = Select;
const sys_accessToken = localStorage.getItem("accessId");
axios.defaults.headers['Authorization'] = `Bearer ${sys_accessToken}`;

// 查询列表
export const queryDevelopViews = async (pages: Number, pageSize: Number) => {
  const datas: any = [];
  const pageInfo = {
    itemCount: 0,
    pageCount: 0,
    pageSize: 0
  };

  const data = {
    name: "sonar-project-scan",
    page: pages,
    page_size: pageSize
  };
  await axios.get('/api/verify/job/build_info', {params: data})
    .then(function (res) {
      if (res.data.code === 200) {
        pageInfo.itemCount = res.data.data.count;
        pageInfo.pageCount = res.data.data.page;
        pageInfo.pageSize = res.data.data.page_size;
        let startId = res.data.data.count;
        if (pages > 1) {
          startId = res.data.data.count - ((res.data.data.page - 1) * res.data.data.page_size);
        }
        const serverDatas = res.data.data.data;
        serverDatas.forEach((ele: any, index: any) => {
          datas.push({
            NO: startId - index,
            ID: ele.number,
            taskName: ele.task_name,
            starttime: ele.start_time,
            endtime: ele.end_time,
            excUser: ele.user_name,
            excStatus: ele.result,
            excResult: ele.perform_result,
            url: ele.task_url,
            taskLog: ele.log_url,
          });
        });
      } else {
        errorMessage(`错误：${res.data.msg}`);
      }
    }).catch(function (error) {
      errorMessage(`异常信息:${error.toString()}`);
    });

  return {pageInfo, datas};

};

// 获取详细信息
export const getSonarDetails = (taskName: string, taskId: string) => {
  return axiosGet('/api/verify/job/build_info_param', {
    name: taskName,
    num: taskId
  });
};

// branchName 下拉框
export const getBranchNameCombobox = async (projectId: any) => {
  const branchOp: any = [];
  await axios.get('/api/verify/sonar/branch', {params: {pro_id: projectId}})
    .then(function (res) {
      if (res.data.code === 200) {
        const branchDatas = res.data.data;
        for (let index = 0; index < branchDatas.length; index += 1) {
          const branch = branchDatas[index].branch_name
          branchOp.push(
            <Option value={branch}>{branch}</Option>,
          );
        }
      } else {
        errorMessage(`错误：${res.data.msg}`);
      }
    }).catch(function (error) {
      errorMessage(`异常信息:${error.toString()}`);
    });

  return branchOp;
};

// 项目下拉框
export const getProjectPathCombobox = async () => {
  const pathOp: any = [];
  await axios.get('/api/verify/sonar/project', {params: {}})
    .then(function (res) {
      if (res.data.code === 200) {
        const pathDatas = res.data.data;
        for (let index = 0; index < pathDatas.length; index += 1) {
          const prjId = pathDatas[index].project_id
          const prjName = pathDatas[index].project_name
          const branch = pathDatas[index].project_path_with_namespace
          pathOp.push(
            <Option key={prjId} keyName={prjName} value={branch}>{branch}</Option>,
          );
        }
      } else {
        errorMessage(`错误：${res.data.msg}`);
      }
    }).catch(function (error) {
      errorMessage(`异常信息:${error.toString()}`);
    });
  return pathOp;
};

// 执行扫描任务
export const executeTask = async (datas: any) => {
  return await axiosPost('/api/sonar/job/build', datas)

}
