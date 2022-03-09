import {getZentaoUsers, getPositions, getExcuteType, getExcution} from '../axiosRequest';
import {message, Select} from "antd";

const {Option} = Select;

// 禅道人员获取
const getZentaoUserSelect = async () => {

  const zentaoUsers = await getZentaoUsers();
  const userData: any = [];

  if (zentaoUsers.message !== '') {
    message.error({
      content: zentaoUsers.message,
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
  } else if (zentaoUsers.data) {
    const datas = zentaoUsers.data;
    datas.forEach((users: any) => {
      userData.push(
        <Option key={users.account} value={users.realname}>{users.realname}</Option>,
      );
    });
  }

  return userData;
};

// 职位获取
const getPositionSelect = async () => {

  const positions = await getPositions();
  const positionData: any = [];

  if (positions.message !== '') {
    message.error({
      content: positions.message,
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
  } else if (positions.data) {
    const datas = positions.data;
    datas.forEach((position: any) => {
      positionData.push(
        <Option key={position} value={position}>{position}</Option>,
      );
    });
  }

  return positionData;
};

// 执行类型
const getExcuteTypeSelect = async () => {

  const excuteType = await getExcuteType();
  const typeData: any = [];

  if (excuteType.message !== '') {
    message.error({
      content: excuteType.message,
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
  } else if (excuteType.data) {
    const datas = excuteType.data;
    datas.forEach((types: any) => {
      typeData.push(
        <Option key={types.execution_type} value={types.execution_type_name}>{types.execution_type_name}</Option>,
      );
    });
  }

  return typeData;
};

// 执行
const getExcutionSelect = async (excuteType: string) => {
  const excution = await getExcution(excuteType);
  const excuteData: any = [];

  if (excution.message !== '') {
    message.error({
      content: excution.message,
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
  } else if (excution.data) {
    const datas = excution.data;
    datas.forEach((types: any) => {
      excuteData.push(
        <Option key={types.execution_type} value={types.execution_type_name}>{types.execution_type_name}</Option>,
      );
    });
  }

  return excuteData;
};

export {getZentaoUserSelect, getPositionSelect, getExcuteTypeSelect,getExcutionSelect};
