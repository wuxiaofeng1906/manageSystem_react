import {updateGridContent} from '@/pages/kpi/forProject/PorjectKpiDetail/supplementFile/data/axiosRequest';
import {message} from 'antd';

// 校验数据
const checkValueIsEffectiveNum = (Num: any) => {
  // 输入数字的地方不能为文字，不能为负数
  if (Num.toString().trim() !== '' && Number(Num).toString() === 'NaN') {
    message.error({
      content: '请输入正确的数字！',
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
    return false;
  }

  if (Number(Num) < 0) {
    message.error({
      content: '输入的数据不能为负数！',
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
    return false;
  }

  return true;
};
// 1 进度指标编辑
const processCellEdited = async (params: any, projectId: string) => {
  // 有数据变化时再进行修改请求
  if (params.newValue !== params.oldValue) {
    const type = params.data?.milestone;
    const correspondingField = {
      需求: 'storyplan',
      '概设&计划': 'designplan',
      开发: 'devplan',
      测试: 'testplan',
      发布: 'releaseplan',
      项目计划: 'projectplan',
    };
    const newValues = {
      category: 'progressDeviation',
      column: 'description',
      newValue: params.newValue,
      project: projectId,
      types: [correspondingField[type]],
    };

    const result = await updateGridContent(newValues);

    if (!result) {
      message.info({
        content: '修改成功！',
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

// 2 需求稳定性编辑
const storyStabilityCellEdited = async (params: any, projectId: string) => {
  if (params.newValue === undefined) {
    return false;
  }
  // 有数据变化时再进行修改请求
  if (!params.oldValue || params.newValue.toString() !== params.oldValue.toString()) {
    // 说明可以不为数字
    if (params.column.colId !== 'description') {
      if (!checkValueIsEffectiveNum(params.newValue)) {
        return true;
      }

      // 修改变更工时和预计工时时： 判断，如果变更工时>预计工时，弹出异常提示：变更工时不能大于预计工时
      const rowData = params.data;

      let stableHours = Math.abs(rowData.stableHours);
      if (stableHours === 999999) {
        stableHours = 0;
      }
      if (stableHours > Math.abs(rowData.planHours)) {
        message.error({
          content: '变更工时不能大于预计工时！',
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
        return true;
      }
    }

    const type = params.data?.stage;
    const typeValue = {项目周期: 0, 开发: 3, 测试: 4, 发布: 5};

    let modifyValue = params.newValue;
    let columID = params.column.colId;
    if (params.column.colId === 'planHours') {
      // 预计工时
      columID = 'kpi';
      modifyValue = Number(params.newValue) === 0 ? 999999 : Number(params.newValue);
    } else if (params.column.colId === 'stableHours') {
      // 变更工时
      columID = 'extra';
      modifyValue = Number(params.newValue) === 0 ? 999999 : Number(params.newValue);
    }

    const newValues = {
      category: 'storyStable',
      column: columID,
      newValue: modifyValue,
      project: projectId,
      types: [typeValue[type]],
    };

    const result = await updateGridContent(newValues);

    if (!result) {
      message.info({
        content: '修改成功！',
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
      message.info({
        content: '修改成功！',
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
      message.info({
        content: '修改成功！',
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

// 5.评审和缺陷
const reviewDefectCellEdited = async (params: any, projectId: string) => {
  if (params.newValue === undefined) {
    return false;
  }

  if (params.newValue !== params.oldValue) {
    const type = params.data?.kind;
    let modifyData: any;

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
    } else {
      enum typeObject {
        '需求预审' = 1, '需求评审', 'UE评审', '概设评审', '详设评审', '用例评审2',
        'codereview', '提测演示', '开发自测/联调', '系统测试', '发布测试',
        'UE预审', 'UI预审', 'UI评审',
      }

      // 修改评审用时
      if (params.column?.colId === 'reviewHour') {
        // 需要判断当发现缺陷数为0或者为空时，评审用时不能被修改
        if (!params.data?.foundDN) {
          message.error({
            content: '发现缺陷数无值，不能修改评审用时！',
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
          return true;
        }
        if (!checkValueIsEffectiveNum(params.newValue)) {
          return true;
        }

        let newData = null;
        if (params.newValue !== '') {
          newData = params.newValue === '0' ? 999999 : Number(params.newValue);
        }

        let oldValue = params.oldValue;
        if (oldValue === null || oldValue === '' || oldValue === undefined) {
          oldValue = null;
        } else {
          oldValue = Number(params.oldValue);
        }
        modifyData = {
          category: 'reviewDefect',
          column: 'extra',
          oldValue: oldValue,
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
      } else if (params.column?.colId === 'cut') {
        // 修改是否裁剪
        modifyData = {
          category: 'reviewDefect',
          column: 'cut',
          newValue: params.newValue === '否' ? 0 : 1,
          project: projectId,
          types: [typeObject[type]],
        };
      }
    }

    const result = await updateGridContent(modifyData);

    if (!result) {
      message.info({
        content: '修改成功！',
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
      message.error({
        content: '提测通过次数不能大于提测次数！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      return true;
    }
  } else if (params.column?.colId === 'baseline') {
    // 基线值-提测次数
    columns = 'extra';
    values = Number(params.newValue);
    const testSuccCount = params.data?.kind;
    if (Number(testSuccCount) > values) {
      message.error({
        content: '提测次数不能小于提测通过次数！',
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      return true;
    }
  } else if (params.column?.colId === 'description') {
    // 说明
    columns = 'description';
  }
  return {item: items, column: columns, value: values};
};

// 6.过程质量
const pocessQualityCellEdited = async (params: any, projectId: string) => {
  if (params.newValue === undefined) {
    return false;
  }

  if (params.newValue !== params.oldValue) {
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
      // 修改是否裁剪
      enum typeObject {
        'Bug解决时长' = 1,
        'Reopen率',
        '后端单元测试覆盖率',
        'Bug回归时长',
        '加权遗留缺陷',
        '加权遗留缺陷密度',
        '前端单元测试覆盖率',
      }

      items.push(typeObject[params.data?.kind]);
      columns = params.column?.colId;
      if (columns === 'cut') {
        values = params.newValue === '否' ? 0 : 1;
      } else {
        values = params.newValue;
      }
    }

    const newValues = {
      category: 'processQuality',
      column: columns,
      newValue: values,
      project: projectId,
      types: items,
    };

    const result = await updateGridContent(newValues);

    if (!result) {
      message.info({
        content: '修改成功！',
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
          message.error({
            content: '成功发布次数不能大于发布次数！',
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
          return true;
        }
      }
    } else if (params.column?.colId === 'totalN') {
      values = Number(params.newValue);
      columns = 'extra';
      const succNum = params.data?.succN; // 成功发布的数据
      if (Number(succNum) > Number(params.newValue)) {
        message.error({
          content: '发布次数不能小于成功发布次数！',
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
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
      message.info({
        content: '修改成功！',
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
  processCellEdited,
  storyStabilityCellEdited,
  stageWorkloadCellEdited,
  reviewDefectCellEdited,
  productRateCellEdited,
  pocessQualityCellEdited,
  serviceCellEdited,
};