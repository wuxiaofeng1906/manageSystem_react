import {updateGridContent} from '@/pages/kpi/forProject/PorjectKpiDetail/data/axiosRequest';
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


export {
  processCellEdited,storyStabilityCellEdited
};
