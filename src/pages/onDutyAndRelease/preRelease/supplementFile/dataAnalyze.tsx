import {getInitPageData} from "./axiosApi";

// 预发布项目数据解析
const analysisPreReleaseProject = (datas: any) => {

  const project = datas[0];
  const projectArray = project.project;
  const projectIdArray: any = [];
  projectArray.forEach((ele: any) => {
    projectIdArray.push(ele.project_id);
  })
  const returnArray = {
    pro_id: project.pro_id,
    projectId: projectIdArray,
    release_type: project.release_type,
    release_way: project.release_way,
    plan_release_time: project.plan_release_time,
    edit_user_name: project.edit_user_name,
    edit_time: project.edit_time,
    ready_release_num: project.ready_release_num
  };

  return returnArray;
};

/*  region 升级服务数据解析 */

// ----发布项
const analysisReleaseItem = (datas: any) => {

  return datas;

};

// ----升级接口

const analysisUpInterface = (datas: any) => {

  return datas;

};

// ----服务确认

const analysisServiceConfirm = (datas: any) => {

  return datas;

};

/* endregion */


/* region 数据修复解析 */

const analysisReviewData = (datas: any) => {
  return datas;
};
const analysisReviewConfirm = (datas: any) => {
  return datas;
}
/* endregion */


/* region 上线分支数据解析 */
const analysisOnlineBranch = (datas: any) => {

  return datas;
};

/* endregion */


/* region 对应工单数据解析 */
const analysiCorrespondOrder = (datas: any) => {

  return datas;
};

/* endregion */

const alalysisInitData = async () => {

  const result = await getInitPageData();
  const datas = result.data;
  return {
    // 预发布项目
    preProject: analysisPreReleaseProject(datas[0].project),
    // 升级服务
    upService_releaseItem: analysisReleaseItem(datas[0].update_app), // 升级服务-发布项
    upService_interface: analysisUpInterface(datas[0].update_api), // 升级服务-升级接口
    upService_confirm: analysisServiceConfirm(datas[0].update_confirm), // 升级服务-服务确认
    // 数据修复
    reviewData_repaire: analysisReviewData(datas[0].review_data),  // 数据修复review
    reviewData_confirm: analysisReviewConfirm(datas[0].review_confirm), // 服务确认

    //  上线分支
    onlineBranch: analysisOnlineBranch(datas[0].release_branch),

    // 对应工单
    correspondOrder: analysiCorrespondOrder(datas[0].repair_order)

  };

};

export {alalysisInitData};