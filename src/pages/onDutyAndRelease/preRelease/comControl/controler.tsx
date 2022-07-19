import {message, Select} from 'antd';
import {
  getAllProject, getAllDeptUsers, getBranchName,
  getServices, getImgEnv, getTestEnv
} from '@/publicMethods/verifyAxios';
import {
  queryReleaseType, queryReleaseWay, queryReleaseId, getOnlineDev,
  getPulishItem, getIsApiAndDatabaseUpgrade, getUpgradeApi,
  getApiService, getApiMethod, getRepaireCategory, getTechSide,
  getCheckType, getBrowserType, queryDutyNames
} from './axiosRequest';

const {Option} = Select;

/* region 预发布项目 */
// 项目名称下拉框
const loadPrjNameSelect = async () => {
  const prjNames = await getAllProject();
  const prjData: any = [];

  if (prjNames.message !== '') {
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
        <Option key={project.project_id} value={`${project.project_name}&${project.project_id}`}>
          {project.project_name}
        </Option>,
      );
    });
  }

  return prjData;
};

// 发布类型下拉框
const loadReleaseTypeSelect = async () => {
  const releaseTypes = await queryReleaseType();
  const typesData: any = [];

  if (releaseTypes.message !== '') {
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
      if (types.release_type_id !== '9') {
        typesData.push(
          <Option key={types.release_type_id} value={`${types.release_type_id}`}>
            {types.release_type_name}
          </Option>,
        );
      }
    });
  }

  return typesData;
};

// 发布方式下拉框
const loadReleaseWaySelect = async () => {
  const releaseWays = await queryReleaseWay();
  const wayData: any = [];

  if (releaseWays.message !== '') {
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
      if (ways.release_way_id !== '9') {
        wayData.push(
          <Option key={ways.release_way_id} value={`${ways.release_way_id}`}>
            {ways.release_way_name}
          </Option>,
        );
      }
    });
  }

  return wayData;
};


// 关联值班名单
const loadDutyNamesSelect = async (showEmpty: boolean = true) => {
  const dutyNames = await queryDutyNames();
  const nameOptions: any = [];

  if (dutyNames.message !== '') {
    message.error({
      content: dutyNames.message,
      duration: 1,
      style: {
        marginTop: '50vh',
      },
    });
  } else if (dutyNames.data) {
    if (showEmpty) {
      nameOptions.push(<Option key={'免'} value={'免'}>{'免'}</Option>);
    }

    const datas = dutyNames.data;
    datas.forEach((dutyInfo: any) => {
      nameOptions.push(
        <Option key={dutyInfo.person_duty_num} value={`${dutyInfo.person_duty_num}`}>
          {dutyInfo.duty_name}
        </Option>,
      );

    });
  }
  return nameOptions;
};

/* endregion */

/* region 升级服务 */

// 一键部署ID下拉框
const loadReleaseIDSelect = async (releaseNum: string) => {

    const IDs = await queryReleaseId(releaseNum);
    const idData: any = [];

    if (IDs.message !== '') {
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
        let serviceStr = '';
        serviceArray.forEach((service: any) => {
          serviceStr = serviceStr === '' ? service : `${serviceStr},${service}`;
        });
        idData.push(
          <Option
            key={ids.id}
            value={`${ids.id}`}
            automation_test={ids.automation_test}
            service={`${serviceStr}`}
          >
            {ids.id}
          </Option>,
        );
      });
    }

    return idData;
  }
;

// 上线环境
const loadOnlineEnvSelect = async (releseCluser: string = "") => {
    const envs = await getOnlineDev();
    const envData: any = [];

    if (envs.message !== '') {
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
        if (ele.online_environment_id !== '9') {
          // 如果“发布集群”选择global集群，那么下边集群就只能选择global集群；如果是选择租户集群发布，则可以选择的集群为0-7
          let optionDisable = true;
          if (releseCluser === "global" && ele.online_environment_name === "global") {
            optionDisable = false
          } else if (releseCluser === "tenant" && ele.online_environment_name !== "global") {
            optionDisable = false
          }
          envData.push(
            <Option key={ele.online_environment_id} value={`${ele.online_environment_id}`} disabled={optionDisable}>
              {ele.online_environment_name}
            </Option>,
          );
        }
      });
    }

    return envData;
  }
;

// 发布项
const loadPulishItemSelect = async () => {
    const source = await getPulishItem();
    const resultArray: any = [];

    if (source.message !== '') {
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
          <Option key={ele.release_item_id} value={`${ele.release_item_id}`}>
            {ele.release_item_name}
          </Option>,
        );
      });
    }

    return resultArray;
  }
;

// 是否接口和数据库升级
const loadIsApiAndDbUpgradeSelect = async () => {
    const source = await getIsApiAndDatabaseUpgrade();
    const resultArray: any = [];

    if (source.message !== '') {
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
        if (ele.upgrade_id !== '9') {
          resultArray.push(
            <Option key={ele.upgrade_id} value={`${ele.upgrade_id}`}>
              {ele.upgrade_item}
            </Option>,
          );
        }
      });
    }

    return resultArray;
  }
;

/* endregion */

/* region 升级接口 */

// 升级接口
const loadUpgradeApiSelect = async () => {
    const source = await getUpgradeApi();
    const resultArray: any = [];

    if (source.message !== '') {
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
        if (ele.type_id !== '9') {
          resultArray.push(
            <Option key={ele.type_id} value={`${ele.type_id}`}>
              {ele.type_name}
            </Option>,
          );
        }
      });
    }

    return resultArray;
  }
;

// 接口服务
const loadApiServiceSelect = async () => {
    const source = await getApiService();
    const resultArray: any = [];

    if (source.message !== '') {
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
          <Option key={ele} value={`${ele}`}>
            {ele}
          </Option>,
        );
      });
    }

    return resultArray;
  }
;

// 接口method
const loadApiMethodSelect = async () => {
    const source = await getApiMethod();
    const resultArray: any = [];

    if (source.message !== '') {
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
        if (ele.method_id !== '9') {
          resultArray.push(
            <Option key={ele.method_id} value={`${ele.method_id}`}>
              {ele.method_name}
            </Option>,
          );
        }
      });
    }

    return resultArray;
  }
;

/* endregion */

/* region 数据修复 */

// 修复类型select
const loadCategorySelect = async () => {
    const source = await getRepaireCategory();
    const resultArray: any = [];

    if (source.message !== '') {
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
        if (ele.repair_id !== '9') {
          resultArray.push(
            <Option key={ele.repair_id} value={`${ele.repair_id}`}>
              {ele.repair_name}
            </Option>,
          );
        }
      });
    }

    return resultArray;
  }
;

// 修复类型select
const loadCommiterSelect = async () => {
    const source = await getAllDeptUsers();
    const resultArray: any = [];

    if (source.message !== '') {
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
          <Option key={ele.user_id} value={`${ele.user_id}&${ele.user_name}`}>
            {ele.user_name}
          </Option>,
        );
      });
    }

    return resultArray;
  }
;
/* endregion */

/* region 上线分支 */

// 技术侧下拉框
const loadTechSideSelect = async () => {
    const source = await getTechSide();
    const resultArray: any = [];

    if (source.message !== '') {
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
        if (ele.technical_side_id !== '9') {
          resultArray.push(
            <Option key={ele.technical_side_id} value={`${ele.technical_side_id}`}>
              {ele.technical_side}
            </Option>,
          );
        }
      });
    }

    return resultArray;
  }
;

// 分支名称下拉框
const loadBranchNameSelect = async () => {
    const source = await getBranchName();
    const resultArray: any = [];

    if (source.message !== '') {
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
          <Option key={ele.branch_id} value={`${ele.branch_name}`}>
            {ele.branch_name}
          </Option>,
        );
      });
    }

    return resultArray;
  }
;

// 服务下拉框
const loadServiceSelect = async (branchName: any) => {
    const source = await getServices({branch: branchName});
    const resultArray: any = [];

    if (source.message !== '') {
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
          {
            title: (ele.server).toString(),
            value: (ele.server_id).toString(),
          }
        );
      });
    }

    return [
      {
        title: '全部',
        value: '全部',
        children: resultArray,
      }
    ];
  }
;

// 镜像环境下拉框
const loadImgEnvSelect = async () => {
    const source = await getImgEnv();
    const resultArray: any = [];

    if (source.message !== '') {
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
          <Option key={ele.env_id} value={`${ele.image_env}`}>
            {ele.image_env}
          </Option>,
        );
      });
    }

    return resultArray;
  }
;

// 测试环境
const loadTestEnvSelect = async () => {
    const source = await getTestEnv();
    const resultArray: any = [];

    if (source.message !== '') {
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
          <Option key={ele} value={`${ele}`}>
            {ele}
          </Option>,
        );
      });
    }

    return resultArray;
  }
;

// 检查类型下拉框
const loadCheckTypeSelect = async (type: string) => {
    // 检查类型，上线后自动化检查类型只显示UI选项，其余不显示。
    const source = await getCheckType();
    const resultArray: any = [];

    if (source.message !== '') {
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
        if (ele.check_type_id !== '9') {
          if (type === "after") {
            if (ele.check_type_name === "UI") {
              resultArray.push(
                <Option key={ele.check_type_id} value={`${ele.check_type_id}`}>
                  {ele.check_type_name}
                </Option>,
              );
            }
          } else {
            resultArray.push(
              <Option key={ele.check_type_id} value={`${ele.check_type_id}`}>
                {ele.check_type_name}
              </Option>,
            );
          }

        }
      });
    }

    return resultArray;
  }
;

// 浏览器下拉框
const loadBrowserTypeSelect = async () => {
    const source = await getBrowserType();
    const resultArray: any = [];

    if (source.message !== '') {
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
        if (ele.browser_id !== '9') {
          resultArray.push(
            <Option key={ele.browser_id} value={`${ele.browser_id}`}>
              {ele.browse_name}
            </Option>,
          );
        }
      });
    }

    return resultArray;
  }
;
/* endregion */

export
{
  loadPrjNameSelect,
  loadReleaseTypeSelect,
  loadReleaseWaySelect,
  loadReleaseIDSelect,
  loadOnlineEnvSelect,
  loadPulishItemSelect,
  loadIsApiAndDbUpgradeSelect,
  loadUpgradeApiSelect,
  loadApiServiceSelect,
  loadApiMethodSelect,
  loadCategorySelect,
  loadCommiterSelect,
  loadTechSideSelect,
  loadBranchNameSelect,
  loadServiceSelect,
  loadImgEnvSelect,
  loadTestEnvSelect,
  loadCheckTypeSelect,
  loadBrowserTypeSelect,
  loadDutyNamesSelect
}
  ;
