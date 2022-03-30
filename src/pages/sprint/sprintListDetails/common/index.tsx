import {history} from "@@/core/history";
import {zentaoTypeRenderToNumber} from "@/publicMethods/cellRenderer";

const getProjectInfo = () => {
  let prjId: string = '';
  let prjNames: string = '';
  let prjType: string = '';
  const location = history.location.query;
  if (JSON.stringify(location) !== '{}') {
    if (location !== undefined && location.projectid !== null) {
      prjId = location.projectid.toString();
      prjNames = location.project === null ? '' : location.project.toString();
    }
    if (location !== undefined && location.type !== undefined && location.type !== null) {
      prjType = location.type.toString();
    }
  }

  return {prjId, prjNames, prjType};
}


const alayManagerData = (oradata: any, curRow: any, prjId: any) => {

  const rowDatas = curRow[0];

  // 用;拼接发布环境
  let pubEnv = "";
  if (oradata.managerEnvironment !== undefined) {
    oradata.managerEnvironment.forEach((eles: any) => {
      pubEnv = pubEnv === "" ? eles : `${pubEnv};${eles}`;
    });
  }

  const datas = {
    id: rowDatas.id,
    project: prjId,
    category: zentaoTypeRenderToNumber(oradata.managerChandaoType),
    // 以上为必填项
    pageAdjust: oradata.managerPageAdjust === "" ? null : oradata.managerPageAdjust,
    hotUpdate: oradata.managerHotUpdate === "" ? null : oradata.managerHotUpdate,
    dataUpdate: oradata.managerDataUpgrade === "" ? null : oradata.managerDataUpgrade,
    interUpdate: oradata.managerInteUpgrade === "" ? null : oradata.managerInteUpgrade,
    presetData: oradata.managerPreData === "" ? null : oradata.managerPreData,
    testCheck: oradata.managertesterVerifi === "" ? null : oradata.managertesterVerifi,
    scopeLimit: oradata.managerSuggestion,
    proposedTest: oradata.managerProTested === "" ? null : oradata.managerProTested,
    publishEnv: pubEnv,
  };

  return datas;
}
export {getProjectInfo,alayManagerData};
