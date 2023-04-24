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

// export const PRE_ENV = [
//   {label: "正式环境", value: "https://app.77hub.com/cn-global/login"},
//   {label: "nx-temp1-k8s", value: "https://nx-temp1-k8s.e7link.com/cn-global/login"},
//   {label: "hotfix-aws-1", value: "https://hotfix-aws-1-global.e7link.com/cn-global/login"}
// ]

// 获取镜像环境
export const preEnv = async () => {
  const branchEnv = await axiosGet(Notice_PreviewEnv);
  const branchs: any = [];
  branchEnv.map((it: any) => {
    // 展示不是global的选项
    if (!it.isGlobal && it.type !== "prod") {
      branchs.push({label: it.envName, value: it.envName, viewKey: it.globalEnv});
    }
    //   添加集群0的数据 envName:"cn-northwest-0"  暂时放出来以后可能会屏蔽，
    if (it.envName === "cn-northwest-0") {
      branchs.push({label: it.envName, value: it.envName, viewKey: it.globalEnv});
    }

  });

  return branchs;

}
