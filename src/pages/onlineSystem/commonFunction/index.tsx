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


// 设置 Tab 标签页的缓存
export const setTabsLocalStorage = (currentPage: any, type: string = "add") => {

  const old_onlineSystem_tab = JSON.parse(localStorage.getItem("onlineSystem_tab") as string);

  // 去除指定的缓存数据
  if (type === "delete") {
    const newPage = old_onlineSystem_tab.filter((item: any) => item.release_num !== currentPage.release_num);
    localStorage.setItem("onlineSystem_tab", JSON.stringify(newPage));
    return;
  }
  // 添加缓存-需要去重(保存最新的一次点击数据)
  if (old_onlineSystem_tab && old_onlineSystem_tab.length) {
    // 用的替换（只能替换，不能判重）
    let exitFlag = false;
    const newPage: any = [];
    old_onlineSystem_tab.map((item: any) => {
      if (item.release_num === currentPage.release_num) {
        newPage.push(currentPage);
        exitFlag = true;
      } else {
        newPage.push(item);
      }
    });

    // 如果没有重复数据，则要单独添加在后面
    if (!exitFlag) {
      newPage.push(currentPage);
    }

    localStorage.setItem("onlineSystem_tab", JSON.stringify(newPage));
  } else {
    localStorage.setItem("onlineSystem_tab", JSON.stringify([currentPage]))
  }

}
