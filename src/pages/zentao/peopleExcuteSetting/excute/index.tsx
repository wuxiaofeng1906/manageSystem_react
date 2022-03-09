import {excuteDistribute, saveDistribute} from '../axiosRequest';

// 执行分配
const excuteDistributeOperate = async (formData: any) => {
  console.log(formData);
  const datas = {
    "perform_id": 0,
    "zt_user_id": "string"
  };

  // 执行前需要先调用保存接口
  return await excuteDistribute(datas);
};

// 保存执行参数
const saveDistributeOperate = async (formData: any) => {
  console.log(formData);
  const datas = {
    "perform_id": 0,
    "zt_user_id": "string",
    "position": "string",
    "work_days": "720",
    "work_hours": "7.0",
    "to_perform_id": "string",
    "out_perform_id": ""
  };
  return await saveDistribute(datas);
};


export {excuteDistributeOperate, saveDistributeOperate}
