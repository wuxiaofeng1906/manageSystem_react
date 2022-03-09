import {excuteDistribute, saveDistribute} from '../axiosRequest';

// 执行分配
const excuteDistributeOperate = async (formData: any) => {
  await excuteDistribute();
};

// 保存执行
const saveDistributeOperate = async (formData: any) => {
  await saveDistribute();
};


export {excuteDistributeOperate, saveDistributeOperate}
