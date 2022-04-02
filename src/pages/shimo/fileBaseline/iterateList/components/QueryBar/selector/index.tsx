import {axiosGet} from "@/publicMethods/axios";

// 迭代名称下拉框
const getIterateName = async () => {
  const iterData = await axiosGet("/api/verify/zentao/executions");
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

export {getIterateName, getSQAName};
