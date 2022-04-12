import {axiosGet} from "@/publicMethods/axios";
import {Select} from 'antd';

const {Option} = Select;

const getIterSelect = async () => {
  const iterData = await axiosGet("/api/verify/zentao/executions");
  const selectArray: any = [];
  if (iterData && iterData.length > 0) {
    iterData.forEach((iter: any) => {
      selectArray.push(
        <Option value={iter.execution_name}>{iter.execution_name}</Option>
      )
    });
  }
  return selectArray;
};

export {getIterSelect};


