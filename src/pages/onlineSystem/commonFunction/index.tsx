// 调用运维接口验证集群是否ok
import PreReleaseServices from "@/services/preRelease";
import {errorModal} from "@/publicMethods/showMessages";


export const vertifyClusterStatus = async (clusters: any) => {
  const failedEnv: any = []; // 是否进行发布结果标记
  const cluterInfo = await PreReleaseServices.getClusterStatus(clusters);
  // const cluterInfo = await PreReleaseServices.getClusterStatus("cn-northwest-0,cn-northwest-1,cn-northwest-2,drill-7");
  const clusterStatusArray = cluterInfo?.data;

  if (!clusterStatusArray || clusterStatusArray.length === 0) {
    errorModal('集群状态校验', `涉及环境状态获取失败，请联系运维确认环境是否可用，再进行发布结果标记！`);
    return false;
  }

  clusterStatusArray.forEach((e: any) => {
    // 如果运维那边的状态不为成功，则不能继续标记发布结果
    if (!(e.taskStatus === "success")) {
      failedEnv.push(e.taskEnv);
    }
  });

  if (failedEnv.length) {
    errorModal('集群状态校验', `请联系运维确认【${failedEnv.join(",")}】环境是否可用，再进行发布结果标记！`);
    return false;
  }

  return true;
};
