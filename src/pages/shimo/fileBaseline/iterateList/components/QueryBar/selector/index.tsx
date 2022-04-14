import {axiosGet} from "@/publicMethods/axios";

// 获取部门组
const getDeptTree = (deptData: any) => {

  const treeData: any = [];
  const filterDept = ["测试部", "产品管理部", "运维部", "研发管理部", "UED部"];
  deptData.forEach((dept: any) => {
    // 不添加测试、运维、UED和产品的组
    if (filterDept.indexOf(dept.org_name) < 0) {
      treeData.push(dept);
    }
  });

  let treeDataStr = JSON.stringify(treeData);
  treeDataStr = treeDataStr.replaceAll("org_name", "title");
  treeDataStr = treeDataStr.replaceAll("org_id", "value");
  return JSON.parse(treeDataStr);
};

// 部门组下拉框
const getDeptName = async () => {
  const deptData = await axiosGet("/api/verify/shimo/depart");
  if (deptData && deptData.length > 0) {
    return [{
      title: "全部",
      value: "",
      children: getDeptTree(deptData)
    }];
  }

  return [];
};

// 迭代名称下拉框
const getIterateName = async () => {
  const iterData = await axiosGet("/api/verify/shimo/execution");
  const treeData: any = [];
  if (iterData && iterData.length > 0) {
    iterData.forEach((iter: any) => {
      treeData.push({
        title: iter.execution_name,
        value: iter.execution_id
      })
    });
  }
  return [{
    title: "全部",
    value: "",
    children: treeData
  }];
};

// 迭代状态下拉框
const getIterateStatus = async () => {
  const iterData = await axiosGet("/api/verify/shimo/executions_status");
  const treeData: any = [];
  if (iterData && iterData.length > 0) {
    iterData.forEach((iter: any) => {
      if (iter.status_name !== "所有") {
        treeData.push({
          title: iter.status_name,
          value: iter.status
        });
      }
    });
  }
  return [{
    title: "全部",
    value: "",
    children: treeData
  }];
};

// 获取SQA人员
const getSQAName = async () => {
  const sqaData = await axiosGet("/api/verify/duty/person", {tech: 7});
  const treeData: any = []
  if (sqaData && sqaData.length > 0) {
    sqaData.forEach((sqa: any) => {
      treeData.push({
        title: sqa.user_name,
        value: sqa.user_id
      })
    });
  }
  return [{
    title: "全部",
    value: "",
    children: treeData
  }];
};

export {getIterateName, getSQAName, getDeptName, getIterateStatus};
