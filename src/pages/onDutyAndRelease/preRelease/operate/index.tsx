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

export {vertifyModifyFlag};
