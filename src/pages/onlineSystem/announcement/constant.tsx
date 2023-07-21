import {axiosGet} from "@/publicMethods/axios";
import {Notice_PreviewEnv} from "../../../../config/qqServiceEnv";

export const SIZE = {
  width: 105,
  height: 60,
};

export const RELEASE_MODULE = {
  "1": "消息卡片",
  "2": "弹窗"
}


/**
 * 获取运维系统中的镜像环境
 * @param isNotice 是否为公告中的引用
 */
export const preEnv = async (isNotice: boolean = true) => {
  const branchEnv = await axiosGet(Notice_PreviewEnv);
  const branchs: any = [];
  if (isNotice) {
    branchEnv.map((it: any) => {
      // 展示不是global的选项,正式环境不展示测试预览环境
      if (!it.isGlobal && it.type !== "prod" && !location.origin.includes("rd.q7link.com")) {
        branchs.push({label: it.envName, value: it.envName, viewKey: it.globalEnv});
      }
      //  正式环境添加集群0，正式环境不要集群0。。   envName:"cn-northwest-0"  暂时放出来以后可能会屏蔽，
      if (it.envName === "cn-northwest-0" && location.origin.includes("rd.q7link.com")) {
        branchs.push({label: it.envName, value: it.envName, viewKey: it.globalEnv});
      }

    });
  } else {
    branchEnv.map((it: any) => {
      // 展示所有测试环境镜像，不区分global
      if (it.type !== "prod") {
        branchs.push({label: it.envName, value: it.envName, isGlobal: it.isGlobal});
      }
    });
  }
  return branchs;
}
