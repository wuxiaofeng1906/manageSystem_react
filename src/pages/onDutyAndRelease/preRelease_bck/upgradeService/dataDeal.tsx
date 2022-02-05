import { queryReleaseId } from '@/pages/onDutyAndRelease/preRelease/supplementFile/datas/axiosApi';

// 展示已部署ID
const showReleasedId = async (releasedData: any) => {
  const showIdArray: any = [];
  const queryIdArray: any = [];

  // 查询id
  const IDs = (await queryReleaseId()).data;
  releasedData.forEach((ele: any) => {
    if (!showIdArray.includes(ele.deployment_id)) {
      showIdArray.push(ele.deployment_id);

      for (let i = 0; i < IDs.length; i += 1) {
        if (ele.deployment_id === IDs[i].id.toString()) {
          queryIdArray.push({
            deployment_id: ele.deployment_id,
            automation_check: IDs[i].automation_test,
            service: IDs[i].service,
          });
          break;
        }
      }
    }
  });

  return { showIdArray, queryIdArray };
};

const alaDelteData = (oldIDArray: any, newIDArray: any, oraID: any, selectedId: any) => {
  // 对于那种平台有ID，运维没有ID的数据处理
  if (oldIDArray.length === 0) {
    if (selectedId.length === 0) {
      return oraID[0];
    }
    //  排除oraData中不存在selectedId中的值。
    for (let index = 0; index < oraID.length; index += 1) {
      if (!selectedId.indexOf(oraID[index])) {
        return oraID[index].toString();
        break;
      }
    }
  }

  let deletedId = ''; // 一次性一般只能删除一个

  // 如果被删完了
  if (oldIDArray.length === 1 && newIDArray.length === 0) {
    return oldIDArray[0].deployment_id;
  }
  for (let o_index = 0; o_index < oldIDArray.length; o_index += 1) {
    const oldID = oldIDArray[o_index];
    let includeFlag = false;
    for (let index = 0; index < newIDArray.length; index += 1) {
      const newID = newIDArray[index];
      if (oldID.deployment_id === newID.key) {
        includeFlag = true;
        break;
      } else {
        includeFlag = false;
      }
    }

    if (!includeFlag) {
      deletedId = oldID.deployment_id;
      break;
    }
  }

  return deletedId;
};
// 解析input框选择的ID，返回查询的id和需要呗删除的id
const alaReleasedChanged = (oldData: any, newIDArray: any, selectedId: any) => {
  const oldIDArray = oldData.queryId;
  const deletedData = alaDelteData(oldIDArray, newIDArray, oldData.oraID, selectedId);

  // 查询的数据
  const queryArray: any = [];
  if (newIDArray && newIDArray.length > 0) {
    newIDArray.forEach((ele: any) => {
      if (JSON.stringify(ele) !== '{}') {
        queryArray.push({
          deployment_id: ele.key,
          automation_check: ele.automation_test,
          service: ele.service.split(','),
        });
      }
    });
  }

  return { queryArray, deletedData };
};
export { showReleasedId, alaReleasedChanged };