import {updateGridContent} from '@/pages/kpi/forProject/PorjectKpiDetail/data/axiosRequest';
import {errorMessage, sucMessage} from "@/publicMethods/showMessages";

// 校验数据
const checkValueIsEffectiveNum = (Num: any) => {
  // 输入数字的地方不能为文字，不能为负数
  if (Num.toString().trim() !== '' && Number(Num).toString() === 'NaN') {
    errorMessage('请输入正确的数字！');
    return false;
  }

  if (Number(Num) < 0) {
    errorMessage('输入的数据不能为负数！');
    return false;
  }

  return true;
};
// 3 阶段工作量
const stageWorkloadCellEdited = async (params: any, projectId: string) => {
  if (params.newValue === undefined) {
    return false;
  }

  // 有数据变化时再进行修改请求
  if (params.newValue !== params.oldValue) {
    // 说明可以不为数字
    if (params.column.colId !== 'description') {
      if (!checkValueIsEffectiveNum(params.newValue)) {
        return true;
      }
    }

    const type = params.data?.stage;
    const correspondingField = {
      需求: 'storyplan',
      '概设&计划': 'designplan',
      开发: 'devplan',
      测试: 'testplan',
      发布: 'releaseplan',
      合计: '',
    };

    let inputValue = params.newValue;
    // 如果不是描述，需要转为数字
    if (params.column.colId !== 'description') {
      inputValue = Number(params.newValue) === 0 ? 999999 : Number(params.newValue);
    }
    const newValues = {
      category: 'stageWorkload',
      column: params.column?.colId,
      newValue: inputValue,
      project: projectId,
      types: [correspondingField[type]],
    };

    const result = await updateGridContent(newValues);

    if (!result) {
      sucMessage('修改成功！');
      return true;
    }
    errorMessage(result.toString());
    return false;
  }

  return false;
};

// 4 生产率
const productRateCellEdited = async (params: any, projectId: string) => {
  if (params.newValue === undefined) {
    return false;
  }

  if (params.newValue !== params.oldValue) {
    // 说明可以不为数字
    if (params.column.colId !== 'description') {
      if (!checkValueIsEffectiveNum(params.newValue)) {
        return true;
      }
    }

    let columns = params.column?.colId;
    if (columns === 'description') {
      if (params.data?.stage === '功能点') {
        columns = 'fpDescription';
      } else if (params.data?.stage === '生产率(功能点/人天）') {
        columns = 'raDescription';
      }
    }

    const newValues = {
      category: 'scaleProductivity',
      column: columns,
      newValue: params.newValue,
      project: projectId,
    };

    const result = await updateGridContent(newValues);

    if (!result) {
      sucMessage('修改成功！');
      return true;
    }
    errorMessage(result.toString());
    return false;
  }
  return false;
};

// 5.评审和缺陷
const reviewDefectCellEdited = async (params: any, projectId: string, modifyField: string) => {
  if (params.newValue === undefined) return false;

  enum typeObject {
    '需求预审' = 1, '需求评审', 'UE评审', '概设评审', '详设评审', '用例评审2',
    'codereview', '提测演示', '开发自测/联调', '系统测试', '发布测试',
    'UE预审', 'UI预审', 'UI评审',
  }

  let modifyData: any;

  // 是否裁剪是ant 组件选择的，所以跟ag-grid表格触发事件和传值方式有变化，就需要单独处理。
  if (modifyField === "cut") {
    modifyData = {
      category: 'reviewDefect',
      column: 'cut',
      newValue: params.newValue === '否' ? 0 : 1,
      project: projectId,
      types: [typeObject[params.kind]],
    };
  } else if (params.newValue !== params.oldValue) {
    const type = params.data?.kind;

    // 修改的是代码量
    if (type === 'codereview' && params.column?.colId === 'funcPoint') {
      if (!checkValueIsEffectiveNum(params.newValue)) {
        return true;
      }
      modifyData = {
        category: 'scaleProductivity',
        column: 'codes',
        newValue: params.newValue === '' ? null : Number(params.newValue),
        project: projectId,
      };
    } else if (params.column?.colId === 'reviewHour') {
      // 需要判断当发现缺陷数为0或者为空时，评审用时不能被修改
      if (!params.data?.foundDN) {
        errorMessage('发现缺陷数无值，不能修改评审用时！');
        return true;
      }
      if (!checkValueIsEffectiveNum(params.newValue)) {
        return true;
      }

      let newData = null;
      if (params.newValue !== '') {
        newData = params.newValue === '0' ? 999999 : Number(params.newValue);
      }

      let my_oldValue = params.oldValue;
      if (my_oldValue === null || my_oldValue === '' || my_oldValue === undefined) {
        my_oldValue = null;
      } else {
        my_oldValue = Number(params.oldValue);
      }
      modifyData = {
        category: 'reviewDefect',
        column: 'extra',
        oldValue: my_oldValue,
        newValue: newData,
        project: projectId,
        types: [typeObject[type]],
      };
    } else if (params.column?.colId === 'description') {
      // 修改描述
      modifyData = {
        category: 'reviewDefect',
        column: 'description',
        newValue: params.newValue,
        project: projectId,
        types: [typeObject[type]],
      };
    }
    // 因为传值原因，裁剪数据单独判断
    // else if (params.column?.colId === 'cut') {
    //   // 修改是否裁剪
    //   modifyData = {
    //     category: 'reviewDefect',
    //     column: 'cut',
    //     newValue: params.newValue === '否' ? 0 : 1,
    //     project: projectId,
    //     types: [typeObject[type]],
    //   };
    // }

  }

  if (modifyData) {
    // 调用修改接口
    const result = await updateGridContent(modifyData);
    if (!result) {
      sucMessage('修改成功！');
      return true;
    }
    errorMessage(result.toString());
    return false;
  }
  return false;
};

// 6.过程质量（修改一次通过率）
const updateTestPassValue = (params: any) => {
  const items: any = [8];
  let values = params.newValue;
  let columns = '';
  // 说明可以不为数字
  if (params.column.colId !== 'description') {
    if (!checkValueIsEffectiveNum(params.newValue)) {
      return true;
    }
  }

  // 里面要区分column，
  // 录入提测通过次数的时候：
  //   没有提测次数值的时候，提测通过次数直接录入成功，不需要任何提示。
  //   已有提测次数且提测通过次数>提测次数，弹出提示语：提测通过次数不能大于提测次数。
  // 录入提测次数时：
  //   如果提测通过次数>提测次数，弹出提示语：提测次数不能小于提测通过次数。
  if (params.column?.colId === 'kind') {
    // kind 代表度量值列-提测通过次数
    columns = 'kpi';
    values = Number(params.newValue);
    const testCount = params.data?.baseline;
    if (testCount && values > Number(testCount)) {
      errorMessage('提测通过次数不能大于提测次数！');
      return true;
    }
  } else if (params.column?.colId === 'baseline') {
    // 基线值-提测次数
    columns = 'extra';
    values = Number(params.newValue);
    const testSuccCount = params.data?.kind;
    if (Number(testSuccCount) > values) {
      errorMessage('提测次数不能小于提测通过次数！');
      return true;
    }
  } else if (params.column?.colId === 'description') {
    // 说明
    columns = 'description';
  }
  return {item: items, column: columns, value: values};
};

// 6.过程质量
const pocessQualityCellEdited = async (params: any, projectId: string, modifyField: string) => {

  if (params.newValue === undefined) return false;

  enum typeObject {
    'Bug解决时长' = 1,
    'Reopen率',
    '后端单元测试覆盖率',
    'Bug回归时长',
    '加权遗留缺陷',
    '加权遗留缺陷密度',
    '前端单元测试覆盖率',
  }

  let newValues: any;
  if (modifyField === "cut") {
    newValues = {
      category: 'processQuality',
      column: 'cut',
      newValue: params.newValue === '否' ? 0 : 1,
      project: projectId,
      types: [typeObject[params.kind]],
    }

  } else if (params.newValue !== params.oldValue) {
    let items = [];
    let columns = '';
    let values: any;

    if (params.data?.cut === '一次提测通过率') {
      // 修改一次通过率
      const data = updateTestPassValue(params);
      if (typeof data !== 'boolean') {
        items = data.item;
      }
      if (typeof data !== 'boolean') {
        columns = data?.column;
      }
      if (typeof data !== 'boolean') {
        values = data?.value;
      }
    } else {
      items.push(typeObject[params.data?.kind]);
      columns = params.column?.colId;
      values = params.newValue;
    }

    newValues = {
      category: 'processQuality',
      column: columns,
      newValue: values,
      project: projectId,
      types: items,
    };

  }

  if (newValues) {
    const result = await updateGridContent(newValues);

    if (!result) {
      sucMessage('修改成功！');
      return true;
    }
    errorMessage(result.toString());
  }
  return false;
};

// 7.服务
const serviceCellEdited = async (params: any, projectId: string) => {
  if (params.newValue === undefined) {
    return false;
  }

  if (params.newValue !== params.oldValue) {
    // 说明可以不为数字
    if (params.column.colId !== 'description') {
      if (!checkValueIsEffectiveNum(params.newValue)) {
        return true;
      }
    }
    /*
    录入成功发布次数的时候：
      已有发布次数且成功发布次数>发布次数，弹出提示语：成功发布次数不能大于发布次数。
      没有发布次数的值，发布成功次数直接录入成功，不需要任何提示。
    录入发布次数时：
      如果成功发布次数>发布次数，弹出提示语：发布次数不能小于成功发布次数。  */

    let columns = '';
    let values = params.newValue;
    if (params.column?.colId === 'succN') {
      // 成功发布列
      values = Number(params.newValue);
      columns = 'kpi';
      const totalNum = params.data?.totalN; // 表格中的发布总数
      if (totalNum) {
        // 如果总发布次数有值，需要判断
        const succNum = Number(params.newValue); // 成功的发布次数
        if (succNum > Number(totalNum)) {
          errorMessage('成功发布次数不能大于发布次数！');
          return true;
        }
      }
    } else if (params.column?.colId === 'totalN') {
      values = Number(params.newValue);
      columns = 'extra';
      const succNum = params.data?.succN; // 成功发布的数据
      if (Number(succNum) > Number(params.newValue)) {
        errorMessage('发布次数不能小于成功发布次数！');
        return true;
      }
    } else if (params.column?.colId === 'description') {
      values = params.newValue;
      columns = 'description';
    }

    const newValues = {
      category: 'serviceAbout',
      column: columns,
      newValue: values,
      project: projectId,
      types: [1], // 1 - 一次发布成功率 -> 目前仅支持1的取值
    };

    const result = await updateGridContent(newValues);

    if (!result) {
      sucMessage('修改成功！');
      return true;
    }
    errorMessage(result.toString());
    return false;
  }

  return false;
};

export {
  stageWorkloadCellEdited,
  reviewDefectCellEdited,
  productRateCellEdited,
  pocessQualityCellEdited,
  serviceCellEdited,
};
