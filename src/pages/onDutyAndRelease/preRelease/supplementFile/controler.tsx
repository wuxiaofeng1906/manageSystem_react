import {message, Select} from "antd";
import {getAllProject} from "@/publicMethods/verifyAxios";
import {
  queryReleaseType, queryReleaseWay, queryReleaseId, getOnlineDev, getPulishItem,
  getIsApiAndDatabaseUpgrade
} from "./axiosApi";

const {Option} = Select;


/* region 预发布项目 */
// 项目名称下拉框
const loadPrjNameSelect = async () => {
  const prjNames = await getAllProject();
  const prjData: any = [];

  if (prjNames.message !== "") {
    message.error({
      content: prjNames.message,
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
  } else if (prjNames.data) {
    const datas = prjNames.data;
    datas.forEach((project: any) => {
      prjData.push(
        <Option key={project.project_id} value={`${project.project_id}`}>{project.project_name}</Option>);
    });
  }

  return prjData;

};

// 发布类型下拉框
const loadReleaseTypeSelect = async () => {

  const releaseTypes = await queryReleaseType();
  const typesData: any = [];

  if (releaseTypes.message !== "") {
    message.error({
      content: releaseTypes.message,
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
  } else if (releaseTypes.data) {
    const datas = releaseTypes.data;
    datas.forEach((types: any) => {
      typesData.push(
        <Option key={types.release_type_id} value={`${types.release_type_id}`}>{types.release_type_name}</Option>);
    });
  }

  return typesData;
};

// 发布类型下拉框
const loadReleaseWaySelect = async () => {

  const releaseWays = await queryReleaseWay();
  const wayData: any = [];

  if (releaseWays.message !== "") {
    message.error({
      content: releaseWays.message,
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
  } else if (releaseWays.data) {
    const datas = releaseWays.data;
    datas.forEach((ways: any) => {
      wayData.push(
        <Option key={ways.release_way_id} value={`${ways.release_way_id}`}>{ways.release_way_name}</Option>);
    });
  }

  return wayData;
};


/* endregion */

/* region 升级服务 */

// 一键部署ID下拉框
const loadReleaseIDSelect = async () => {
  const IDs = await queryReleaseId();
  const idData: any = [];

  if (IDs.message !== "") {
    message.error({
      content: IDs.message,
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
  } else if (IDs.data) {
    const datas = IDs.data;
    datas.forEach((ids: any) => {
      const serviceArray = ids.service;
      let serviceStr = "";
      serviceArray.forEach((service: any) => {
        serviceStr = serviceStr === "" ? service : `${serviceStr},${service}`;
      });
      idData.push(
        <Option key={ids.id} value={`${ids.id}`} automation_test={`${ids.automation_test}`}
                service={`${serviceStr}`}>{ids.id}</Option>);
    });
  }

  return idData;

};

// 上线环境
const loadOnlineEnvSelect = async () => {
  const envs = await getOnlineDev();
  const envData: any = [];

  if (envs.message !== "") {
    message.error({
      content: envs.message,
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
  } else if (envs.data) {
    const datas = envs.data;
    datas.forEach((ele: any) => {
      envData.push(
        <Option key={ele.online_environment_id}
                value={`${ele.online_environment_id}`}>{ele.online_environment_name}</Option>);

    });
  }

  return envData;

};

// 发布项
const loadPulishItemSelect = async () => {
  const source = await getPulishItem();
  const resultArray: any = [];

  if (source.message !== "") {
    message.error({
      content: source.message,
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
  } else if (source.data) {
    const datas = source.data;
    datas.forEach((ele: any) => {
      resultArray.push(
        <Option key={ele.release_item_id}
                value={`${ele.release_item_id}`}>{ele.release_item_name}</Option>);

    });
  }

  return resultArray;

};

const loadIsApiAndDbUpgradeSelect = async () => {

  const source = await getIsApiAndDatabaseUpgrade();
  const resultArray: any = [];

  if (source.message !== "") {
    message.error({
      content: source.message,
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
  } else if (source.data) {
    const datas = source.data;
    datas.forEach((ele: any) => {
      resultArray.push(
        <Option key={ele.upgrade_id}
                value={`${ele.upgrade_id}`}>{ele.upgrade_item}</Option>);

    });
  }

  return resultArray;


};

/* endregion */

export {
  loadPrjNameSelect, loadReleaseTypeSelect, loadReleaseWaySelect, loadReleaseIDSelect, loadOnlineEnvSelect,
  loadPulishItemSelect, loadIsApiAndDbUpgradeSelect

};
