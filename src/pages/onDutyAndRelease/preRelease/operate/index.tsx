// 验证是否可以进行表格的新增、修改和删除
import {alalysisInitData} from "../datas/dataAnalyze";

const vertifyModifyFlag = async (types: number, currentListNo: string) => {
  let returnFlag = true;

  if (types === 1 || types === 2 || types === 6) {
    // 6是一键部署ID的查询
    // 验证上线分支是否确认完成
    const datas = (await alalysisInitData('pulishConfirm', currentListNo)).upService_confirm;

    if (datas && datas.length > 0) {
      const confirmData = datas[0];
      if (confirmData.test_confirm_status === '1') {
        returnFlag = false;
      }
    }
  } else if (types === 3) {
    // 需要验证review服务中的测试是否确认
    const datas = (await alalysisInitData('dataReviewConfirm', currentListNo)).reviewData_confirm;
    if (datas && datas.length > 0) {
      const confirmData = datas[0];
      if (confirmData.confirm_status === '1') {
        returnFlag = false;
      }
    }
  }

  return returnFlag;
};

// 渲染表格行的颜色(正在修改的行)
const releaseAppChangRowColor = (allLockedArray: any, type: string, idFlag: number) => {
  const lockInfoArray = allLockedArray;
  let returnValue = { 'background-color': 'transparent' };
  if (!idFlag) {
    return returnValue;
  }
  if (lockInfoArray && lockInfoArray.length > 0) {
    for (let index = 0; index < lockInfoArray.length; index += 1) {
      const paramsArray = lockInfoArray[index].param.split('-');
      if (type === `${paramsArray[1]}-${paramsArray[2]}`) {
        // 判断是不是属于当前渲染表格的数据
        if (idFlag.toString() === paramsArray[3]) {
          // 判断有没有对应id
          returnValue = { 'background-color': '#FFF6F6' };
          break;
        }
      }
    }
  }
  return returnValue;
};


export {vertifyModifyFlag,releaseAppChangRowColor};
