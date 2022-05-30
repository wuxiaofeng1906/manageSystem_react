import {getInitPageData} from './datasGet';

// 解析Tabs
const analysisTabsPageInfo = async (datas: any) => {

  try {
    const tabsPageArray: any = [];
    if (datas) {
      datas.forEach((ele: any) => {
        const {ready_release} = ele;
        const panes: any = {
          title: ready_release.ready_release_name,
          content: '',
          key: ready_release.ready_release_num,
        };
        tabsPageArray.push(panes);
      });
      return {
        activeKey: tabsPageArray[0].key,
        panes: tabsPageArray,
      };
    }

    return {
      activeKey: '',
      panes: [],
    };
  } catch (e) {
    console.log(`Tab解析出错:${e}`);
    return {
      activeKey: '',
      panes: [],
    };
  }

};

// 预发布项目数据解析
const analysisPreReleaseProject = (datas: any, zentaoData: any) => {
  try {
    if (datas && datas.length > 0) {
      const project = datas[0];
      const projectArray = project.project;
      const projectIdArray: any = [];
      projectArray.forEach((ele: any) => {
        projectIdArray.push(`${ele.project_name}&${ele.project_id}`);
      });

      const returnArray = {
        pro_id: project.pro_id,
        projectId: projectIdArray,
        release_type: project.release_type,
        release_way: project.release_way,
        plan_release_time: project.plan_release_time,
        edit_user_name: project.edit_user_name,
        edit_time: project.edit_time,
        ready_release_num: project.ready_release_num,
        ignoreZentaoList: zentaoData[0] === undefined ? "" : zentaoData[0].ignore_check,
        checkListStatus: zentaoData[0] === undefined ? "" : zentaoData[0].task_status,
      };

      return returnArray;
    }

    return {};
  } catch (e) {
    console.log(`预发布项目解析错误：${e}`);
    return {};
  }
};

/*  region 升级服务数据解析 */

// ----发布项
const analysisReleaseItem = (datas: any) => {
  return datas;
};

// ----升级接口

const analysisUpInterface = (datas: any) => {
  if (datas.length === 0) {
    return [{}];
  }
  return datas;
};

// ----服务确认

const analysisServiceConfirm = (datas: any) => {
  return datas;
};

/* endregion */

/* region 数据修复解析 */

const analysisReviewData = (datas: any) => {
  if (datas.length === 0) {
    return [{}];
  }
  return datas;
};
const analysisReviewConfirm = (datas: any) => {
  return datas;
};
/* endregion */

/* region 上线分支数据解析 */
const analysisOnlineBranch = (datas: any) => {
  if (datas.length === 0) {
    return [{}];
  }

  return datas;
};

/* endregion */

/* region 对应工单数据解析 */
const analysiCorrespondOrder = (datas: any) => {
  return datas;
};

/* endregion */

const alalysisInitData = async (queryData: string = '', queryReleaseNum: string = '') => {
  try {
    const result = await getInitPageData(queryReleaseNum);

    if (result.data.length === 0 && result.message !== "") {
      return {errmessage: result.message};
    }

    if (result.data.length === 0) {
      return [];
    }

    const datas = result.data;

    if (queryData === 'pulishItem') {
      return {upService_releaseItem: analysisReleaseItem(datas[0].update_app)}; // 升级服务-发布项;
    }
    if (queryData === 'deployment_id') {
      return {deployment_id: datas[0].deployment_id}; // 一键发布ID;
    }
    if (queryData === 'pulishApi') {
      return {upService_interface: analysisUpInterface(datas[0].update_api)};
    }

    if (queryData === 'pulishConfirm') {
      return {upService_confirm: analysisServiceConfirm(datas[0].update_confirm)}; // 升级服务-服务确认;
    }

    if (queryData === 'dataReview') {
      return {reviewData_repaire: analysisReviewData(datas[0].review_data)};
    }

    if (queryData === 'dataReviewConfirm') {
      return {reviewData_confirm: analysisReviewConfirm(datas[0].review_confirm)};
    }

    if (queryData === 'onlineBranch') {
      return {onlineBranch: analysisOnlineBranch(datas[0].release_branch)};
    }

    if (queryData === 'tabPageInfo') {
      return {tabPageInfo: await analysisTabsPageInfo(datas)};
    }

    return {
      tabPageInfo: await analysisTabsPageInfo(datas),
      // 预发布项目
      preProject: analysisPreReleaseProject(datas[0].project, datas[0].zt_task_status),
      // 升级服务
      deployment_id: datas[0].deployment_id,
      upService_releaseItem: analysisReleaseItem(datas[0].update_app), // 升级服务-发布项
      upService_interface: analysisUpInterface(datas[0].update_api), // 升级服务-升级接口
      upService_confirm: analysisServiceConfirm(datas[0].update_confirm), // 升级服务-服务确认
      // 数据修复
      reviewData_repaire: analysisReviewData(datas[0].review_data), // 数据修复review
      reviewData_confirm: analysisReviewConfirm(datas[0].review_confirm), // 服务确认

      //  上线分支
      onlineBranch: analysisOnlineBranch(datas[0].release_branch),

      // 对应工单
      correspondOrder: analysiCorrespondOrder(datas[0].repair_order),
    };
  } catch (e) {
    // console.log(`数据获取解析错误:${e}`);
    return {errmessage: `数据获取解析错误:${e}`};
  }


};

export {alalysisInitData};
