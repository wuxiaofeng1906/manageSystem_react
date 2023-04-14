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
  debugger
  const branchEnv = await axiosGet(Notice_PreviewEnv);
  const branchs: any = [];
  branchEnv.map((it: any) => {
    // 展示不是global的选项
    if (!it.isGlobal) {
      branchs.push({label: it.envName, value: it.envName, viewKey: it.globalEnv});
    }
  });
  debugger
  // if (!location.origin.includes("rd.q7link.com")) {
  //   branchs.push(
  //     {label: "hotfix-inte-aws-1", value: "hotfix-inte-aws-1"},
  //     {label: "hotfix-inte-aws-1-global", value: "hotfix-inte-aws-1-global"},
  //     {label: "hotfix-aws-1", value: "hotfix-aws-1"},
  //     {label: "hotfix-aws-1-global", value: "hotfix-aws-1-global"}
  //   );
  // }


  return branchs;

}
