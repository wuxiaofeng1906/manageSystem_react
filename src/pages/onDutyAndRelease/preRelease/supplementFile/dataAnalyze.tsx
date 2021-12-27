import {getInitPageData} from "./axiosApi";

const alalysisPreReleaseProject = (datas: any) => {

  const project = datas[0];
  const projectArray = project.project;
  const projectIdArray: any = [];
  projectArray.forEach((ele: any) => {
    projectIdArray.push(ele.project_id);
  })
  const returnArray = {
    projectId: projectIdArray,
    release_type: project.release_type,
    release_way: project.release_way,
    plan_release_time: project.plan_release_time,
    edit_user_name: project.edit_user_name,
    edit_time: project.edit_time,
  };

  return returnArray;
};

const alalysisInitData = async () => {

  const result = await getInitPageData();
  const datas = result.data;
  return {
    preProject: alalysisPreReleaseProject(datas[0].project),
  };

};

export {alalysisInitData};
