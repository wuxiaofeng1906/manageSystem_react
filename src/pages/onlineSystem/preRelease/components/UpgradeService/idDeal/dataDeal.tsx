import { alalysisInitData } from '../../../datas/dataAnalyze';

// 展示已部署ID
const showReleasedId = async (deploymentIDs: any) => {
  const showIdArray: any = [];
  if (deploymentIDs && deploymentIDs.length > 0) {
    deploymentIDs.forEach((ele: any) => {
      if (!showIdArray.includes(ele.deployment_id) && ele.deployment_id) {
        showIdArray.push(ele.deployment_id);
      }
    });
  }

  return showIdArray;
};
// 解析需要删除的数据
// const alaDelteData = (oldIDArray: any, newIDArray: any, oraID: any, selectedId: any) => {
//   // 对于那种平台有ID，运维没有ID的数据处理
//   if (oldIDArray.length === 0) {
//     if (selectedId.length === 0) {
//       return oraID[0];
//     }
//     //  排除oraData中不存在selectedId中的值。
//     for (let index = 0; index < oraID.length; index += 1) {
//       if (!selectedId.indexOf(oraID[index])) {
//         return oraID[index].toString();
//         break;
//       }
//     }
//   }
//
//   let deletedId = ''; // 一次性一般只能删除一个
//
//   // 如果被删完了
//   if (oldIDArray.length === 1 && newIDArray.length === 0) {
//     return oldIDArray[0].deployment_id;
//   }
//   for (let o_index = 0; o_index < oldIDArray.length; o_index += 1) {
//     const oldID = oldIDArray[o_index];
//     let includeFlag = false;
//     for (let index = 0; index < newIDArray.length; index += 1) {
//       const newID = newIDArray[index];
//       if (oldID.deployment_id === newID.key) {
//         includeFlag = true;
//         break;
//       } else {
//         includeFlag = false;
//       }
//     }
//
//     if (!includeFlag) {
//       deletedId = oldID.deployment_id;
//       break;
//     }
//   }
//
//   return deletedId;
// };

// 解析input框选择的ID，返回查询的id和需要呗删除的id
// const alaReleasedChanged = (oldData: any, newIDArray: any, selectedId: any) => {
//   const oldIDArray = oldData.queryId;
//   const deletedData = alaDelteData(oldIDArray, newIDArray, oldData.oraID, selectedId);
//
//   // 查询的数据
//   const queryArray: any = [];
//   if (newIDArray && newIDArray.length > 0) {
//     newIDArray.forEach((ele: any) => {
//       if (JSON.stringify(ele) !== '{}') {
//         queryArray.push({
//           deployment_id: ele.key,
//           automation_check: ele.automation_test,
//           service: ele.service.split(','),
//         });
//       }
//     });
//   }
//
//   return {queryArray, deletedData};
// };

// 检查是否勾选自动化测试
const getAutoCheckMessage = async (activeKey: string) => {
  const source: any = await alalysisInitData('deployment_id', activeKey);

  const deploymentIDs = source.deployment_id;

  if (!deploymentIDs || deploymentIDs.length === 0) {
    return '';
  }

  const noCheckArray: any = [];
  let noCheckString = '';
  deploymentIDs.forEach((ele: any) => {
    if (ele.automation_check === '2') {
      // 表示未勾选自动化用例参数
      if (!noCheckArray.includes(ele.deployment_id)) {
        noCheckArray.push(ele.deployment_id);
        noCheckString =
          noCheckString === ''
            ? `【${ele.deployment_id}】`
            : `${noCheckString}【${ele.deployment_id}】`;
      }
    }
  });

  if (noCheckArray.length === 0) {
    return '';
  }
  return `提示：构建镜像${noCheckString}未勾选自动化用例参数`;
};
export { showReleasedId, getAutoCheckMessage };
