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
    // testCheck: oradata.managertesterVerifi === "" ? null : oradata.managertesterVerifi,
    scopeLimit: oradata.managerSuggestion,
    proposedTest: oradata.managerProTested === "" ? null : oradata.managerProTested,
    publishEnv: pubEnv,
  };
  // 如果修改了是否需要测试验证，就要改为负值。
  if (curRow[0].testCheck !== oradata.managertesterVerifi) {
    datas["testCheck"] = oradata.managertesterVerifi === "" ? "" : `-${oradata.managertesterVerifi}`; //  为手动修改的数据
  }

  // 如果修改了是否清缓存，就要改为负值。
  if (curRow[0].clearCache !== oradata.managerClearCache) {
    datas["clearCache"] = oradata.managerClearCache === "" ? "" : `-${oradata.managerClearCache}`; //  为手动修改的数据
  }

  return datas;
}

const defaultSelectParams: any = {
  mode: "multiple",
  allowClear: true,
  placeholder: "默认选择全部",
  size: "small",
  maxTagCount: "responsive"
};

// 统计指派给、测试、解决人 人名
const getRelatedPersonName = (oraData: any) => {

  if (!oraData || oraData.length === 0) {
    return {};
  }
  const tester: any = [];
  const assigned: any = [];
  const solvedBy: any = [];

  oraData.forEach((rows: any) => {
    // 测试人员
    const test_person = rows.tester;
    if (test_person && test_person.length > 0) {
      test_person.forEach((testInfo: any) => {
        const name = testInfo.name === "" ? "NA" : testInfo.name;
        if (tester.indexOf(name) === -1) {
          tester.push(name);
        }
      });
    } else if (tester.indexOf("NA") === -1) {
      tester.push("NA");
    }

    //   指派给
    const assigned_person = rows.assignedTo;
    if (assigned_person) {
      if (assigned.indexOf(assigned_person?.name) === -1) {
        assigned.push(assigned_person?.name);
      }
    } else if (assigned.indexOf("") === -1) {
      assigned.push("");
    }


    //  解决人
    const finished_person = rows.finishedBy;
    if (finished_person && finished_person.length > 0) {
      finished_person.forEach((personInfo: any) => {
        if (solvedBy.indexOf(personInfo?.name) === -1) {
          solvedBy.push(personInfo?.name);
        }
      });
    } else if (solvedBy.indexOf("") === -1) {
      solvedBy.push("");
    }
  });

  return {tester, assigned, solvedBy};
};
export {getProjectInfo, alayManagerData, defaultSelectParams, getRelatedPersonName};
