import {excuteDistribute, saveDistribute} from '../axiosRequest';

// 执行分配
const excuteDistributeOperate = async (formData: any, performID: any) => {

  const {usersName} = formData;
  if (!usersName || usersName.length === 0) {
    return {
      message: "分配人员不能为空！",
      distributionNum: '',
    };
  }

  const userList: any = [];
  usersName.forEach((ele: any) => {
    const userID = ele.split("&");
    userList.push(userID[0]);

  });

  const datas = {
    "perform_id": Number(performID),
    "zt_user_id": userList.join()
  };

  // 执行前需要先调用保存接口
  return await excuteDistribute(datas);
};

// 保存执行参数
const saveDistributeOperate = async (formData: any, performID: number) => {

  const distributeExcuteID = formData.distributeExcute;
  if (!distributeExcuteID || distributeExcuteID.length === 0) {
    return {
      message: "分配执行ID不能为空！",
      performID: -1,
    };
  }

  const distributeExcuteTypeID = formData.distributeExcuteType;
  if (!distributeExcuteTypeID || distributeExcuteTypeID.length === 0) {
    return {
      message: "分配执行类型不能为空！",
      performID: -1,
    };
  }

  let toPerformID = "";
  distributeExcuteID.forEach((ele: any) => {
    const id = ele.split("&")[0];
    toPerformID = toPerformID === "" ? id : `${toPerformID},${id}`;
  });

  let toPerformType = "";
  distributeExcuteTypeID.forEach((ele: any) => {
    const id = ele.split("&")[0];
    toPerformType = toPerformType === "" ? id : `${toPerformType},${id}`;
  });

  let outPerformType = "";
  const excludeExcuteTypeID = formData.excludeExcuteType;
  if (excludeExcuteTypeID && excludeExcuteTypeID.length > 0) {
    excludeExcuteTypeID.forEach((ele: any) => {
      const id = ele.split("&")[0];
      outPerformType = outPerformType === "" ? id : `${outPerformType},${id}`;
    });
  }

  let outPerformID = "";
  const excludeExcuteID = formData.excludeExcute;
  if (excludeExcuteID && excludeExcuteID.length > 0) {
    excludeExcuteID.forEach((ele: any) => {
      const id = ele.split("&")[0];
      outPerformID = outPerformID === "" ? id : `${outPerformID},${id}`;
    });
  }



  const datas = {
    "position": formData.position,
    "work_days": (formData.workDay).toString(),
    "work_hours": (formData.workHours).toString(),
    "to_perform_id": toPerformID,  // 分配执行ID
    "out_perform_id": outPerformID,  // 排除执行ID
    "to_perform_type": toPerformType,// 分配类型ID
    "out_perform_type": outPerformType // 排除执行ID
  };
  if (performID !== -1) {
    datas["perform_id"] = performID;
  }

  return await saveDistribute(datas);
};


export {excuteDistributeOperate, saveDistributeOperate}
