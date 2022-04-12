import {axiosGet} from "@/publicMethods/axios";
import {Select} from 'antd';

const {Option} = Select;

const getIterSelect = async () => {
  const iterData = await axiosGet("/api/verify/zentao/executions");
  const selectArray: any = [];
  if (iterData && iterData.length > 0) {
    iterData.forEach((iter: any) => {
      selectArray.push(
        <Option value={iter.execution_id}>{iter.execution_name}</Option>
      )
    });
  }
  return selectArray;
};

// 根据id获取名称
const getIterSelectedValue = async (iterId: any) => {
  const iterData = await axiosGet("/api/verify/zentao/executions");
  let iterName = "";
  if (iterData && iterData.length > 0) {
    for (let index = 0; index < iterData.length; index += 1) {
      const iterInfo = iterData[index];
      if (iterInfo.execution_id === iterId) {
        iterName = iterInfo.execution_name;
        break;
      }
    }
  }
  return iterName;
};
export {getIterSelect, getIterSelectedValue};


