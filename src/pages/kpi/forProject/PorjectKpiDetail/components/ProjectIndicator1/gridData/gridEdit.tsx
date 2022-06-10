import {errorMessage, sucMessage} from "@/publicMethods/showMessages";
import {axiosPut} from "@/publicMethods/axios";
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
// 项目质量:修改代码量和描述
export const processQualityCellEdited = async (params: any, projectId: string) => {
  // 有数据变化时再进行修改请求
  if (params.newValue !== undefined && params.newValue !== params.oldValue) {

    let cuTech = "";
    if (params.data?.tech === "前端") {
      cuTech = "1"
    } else if (params.data?.tech === "后端") {
      cuTech = "2"
    }

    let newValues: any;
    // 如果是代码字段，则需要判断是否为数字
    if (params.column.colId === 'code_count') {
      if (checkValueIsEffectiveNum(params.newValue)) {
        newValues = {
          "execution": projectId, // 禅道执行ID
          "pkName": "quality", // 指标名称 - 项目质量
          "itmeName": "codes", // 指标项名称 - 代码量
          "tech": cuTech, // 技术侧: 1-前端, 2-后端
          "newValue": Number(params.newValue), // 新修改值
          "method": "POST" // POST-修改, DELETE-删除
        }
      }

    } else if (params.column.colId !== 'description') {
      // newValues = {
      //   "execution": projectId, // 禅道执行ID
      //   "pkName": "quality", // 指标名称 - 项目质量
      //   "itmeName": "codes", // 指标项名称 - 代码量
      //   "tech": "2", // 技术侧: 1-前端, 2-后端
      //   "newValue": 19999, // 新修改值
      //   "method": "POST" // POST-修改, DELETE-删除
      // }
    }


    if (newValues) {
      const result = await axiosPut('/api/project/kpi/iter/one', newValues);
      if (result.ok) {
        sucMessage("代码量修改成功！");
      } else {
        errorMessage("代码量修改失败！");
      }
    }
  }
};


