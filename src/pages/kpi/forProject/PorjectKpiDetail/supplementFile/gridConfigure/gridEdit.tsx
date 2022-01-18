import {updateGridContent} from "@/pages/kpi/forProject/PorjectKpiDetail/supplementFile/data/axiosRequest";
import {message} from "antd";

// 进度指标编辑
const processCellEdited = async (params: any, projectId: string) => {

  // 有数据变化时再进行修改请求
  if (params.newValue !== params.oldValue) {
    const type = params.data?.milestone;
    const correspondingField = {
      "需求": "storyplan",
      "概设&计划": "designplan",
      "开发": "devplan",
      "测试": "testplan",
      "发布": "releaseplan",
      "项目计划": "projectplan",
    };
    const newValues = {
      "category": "progressDeviation",
      "column": "memo",
      "newValue": params.newValue,
      "project": projectId,
      "types": [correspondingField[type]]
    };

    const result = await updateGridContent(newValues);

    if (!result) {
      message.info({
        content: "修改成功！",
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    } else {
      message.error({
        content: result,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    }
  }
};

// 需求稳定性编辑
const storyStabilityCellEdited = async (params: any, projectId: string) => {

  // 有数据变化时再进行修改请求
  if ((params.newValue).toString() !== (params.oldValue).toString()) {
    const type = params.data?.stage;

    const typeValue = {"项目周期": 0, "开发": 3, "测试": 4, "发布": 5};

    let columID = "";
    if (params.column.colId === "planHours") { // 预计工时
      columID = "kpi"
    } else if (params.column.colId === "stableHours") { // 变更工时
      columID = "extra"
    }
    const newValues = {
      "category": "storyStable",
      "column": columID,
      "newValue": Number(params.newValue),
      "project": projectId,
      "types": [typeValue[type]]
    };

    const result = await updateGridContent(newValues);

    if (!result) {
      message.info({
        content: "修改成功！",
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

      return true;
    }
    message.error({
      content: result,
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
    return false;

  }

  return false;
};

// 阶段工作量
const stageWorkloadCellEdited = async (params: any, projectId: string) => {

  // 有数据变化时再进行修改请求
  if (params.newValue !== params.oldValue) {
    const type = params.data?.stage;
    const correspondingField = {
      "需求": "storyplan",
      "概设&计划": "designplan",
      "开发": "devplan",
      "测试": "testplan",
      "发布": "releaseplan",
      "合计": "",
    };

    const newValues = {
      "category": "stageWorkload",
      "column": params.column?.colId,
      "newValue": params.newValue,
      "project": projectId,
      "types": [correspondingField[type]]
    };

    const result = await updateGridContent(newValues);

    if (!result) {
      message.info({
        content: "修改成功！",
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      return true;

    }
    message.error({
      content: result,
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });

    return false;

  }

  return false;
};

// 生产率
const productRateCellEdited = async (params: any, projectId: string) => {

  if (params.newValue !== params.oldValue) {
    const newValues = {
      "category": "scaleProductivity",
      "column": params.column?.colId,
      "newValue": params.newValue,
      "project": projectId,
    };

    const result = await updateGridContent(newValues);

    if (!result) {
      message.info({
        content: "修改成功！",
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

      return true;
    }
    message.error({
      content: result,
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
    return false;

  }

  return false;
};

// 评审和缺陷
const reviewDefectCellEdited = async (params: any, projectId: string) => {
  const type = params.data?.kind;

  enum typeObject {
    "需求预审" = 1, "需求评审", "UE评审", "概设评审", "详设评审",
    "用例评审", "CodeReview", "提测演示", "开发联调", "系统测试",
    "发布测试", "UE预审", "UI预审", "UI评审"
  };

  if (params.newValue !== params.oldValue) {

    const newValues = {
      "category": "reviewDefect",
      "column": "",
      "newValue": 0,
      "project": projectId,
      "types": [typeObject[type]]
    };

    if (params.column?.colId === "reviewHour") {
      newValues.column = "extra";
      newValues.newValue = params.newValue;
    } else {
      newValues.column = "cut";
      newValues.newValue = params.newValue === "否" ? 0 : 1;
    }

    const result = await updateGridContent(newValues);

    if (!result) {
      message.info({
        content: "修改成功！",
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    } else {
      message.error({
        content: result,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    }
  }

};

// 过程质量
const pocessQualityCellEdited = async (params: any, projectId: string) => {

  const type = params.data?.kind;

  enum typeObject {
    "Bug解决时长" = 1, "Reopen率", "后端单元测试覆盖率", "Bug回归时长", "加权遗留缺陷", "加权遗留缺陷密度",
    "前端单元测试覆盖率"
  }

  if (params.newValue !== params.oldValue) {

    const newValues = {
      "category": "processQuality",
      "column": "cut",
      "newValue": params.newValue === "否" ? 0 : 1,
      "project": projectId,
      "types": [typeObject[type]]
    };

    const result = await updateGridContent(newValues);

    if (!result) {
      message.info({
        content: "修改成功！",
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    } else {
      message.error({
        content: result,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
    }
  }

};

// 服务
const serviceCellEdited = async (params: any, projectId: string) => {

  let columns = "";
  if (params.column?.colId === "succN") { // 成功发布数据
    columns = "kpi";
  } else if (params.column?.colId === "totalN") {
    columns = "extra";
  }

  if (params.newValue !== params.oldValue) {

    const newValues = {
      "category": "serviceAbout",
      "column": columns,
      "newValue": Number(params.newValue),
      "project": projectId,
      "types": [1]  // 1 - 一次发布成功率 -> 目前仅支持1的取值
    };

    const result = await updateGridContent(newValues);

    if (!result) {
      message.info({
        content: "修改成功！",
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });

      return true;
    }
    message.error({
      content: result,
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
    return false;

  }

  return false;
};
export {
  processCellEdited, storyStabilityCellEdited, stageWorkloadCellEdited, reviewDefectCellEdited,
  productRateCellEdited, pocessQualityCellEdited, serviceCellEdited
}
