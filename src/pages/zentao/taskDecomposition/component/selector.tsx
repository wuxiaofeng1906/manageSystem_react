import {axiosGet} from "@/publicMethods/axios";
import {Select, message} from "antd";

const {Option} = Select;
// 所属执行下拉框
const zentaoExcutionSelect = async () => {

  return []
};

// 禅道需求下拉框
const zentaoStorySelect = async () => {
  return []
  // const excuteType = await getExcuteType();
  // const childType: any = [];
  //
  // if (excuteType.message !== '') {
  //   message.error({
  //     content: excuteType.message,
  //     duration: 1,
  //     style: {
  //       marginTop: '50vh',
  //     },
  //   });
  // } else if (excuteType.data) {
  //   const datas = excuteType.data;
  //   datas.forEach((types: any) => {
  //     childType.push({
  //       title: types.execution_type_name,
  //       value: `${types.execution_type}&${types.execution_type_name}`,
  //       key: types.execution_type,
  //     })
  //   });
  // }
  //
  // let typeData: any = [
  //   {
  //     title: '全部',
  //     value: 'all&全部',
  //     key: 'all&全部',
  //     children: childType
  //   }];
  //
  // if (type === "exclude") {
  //   typeData = [{
  //     title: "空",
  //     value: `''&空`,
  //     key: `''&空`,
  //   }, {
  //     title: '全部',
  //     value: 'all&全部',
  //     key: 'all&全部',
  //     children: childType
  //   }];
  //
  // }
  //
  //
  // return typeData;

};

// 指派给和由谁创建下拉框
const zentaoDevCenterSelect = async () => {
  return []
};

export {zentaoExcutionSelect, zentaoStorySelect, zentaoDevCenterSelect};
