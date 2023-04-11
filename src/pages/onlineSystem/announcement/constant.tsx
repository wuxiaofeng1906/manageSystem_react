import {OnlineSystemServices} from "@/services/onlineSystem";

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
  const branchEnv = await OnlineSystemServices.branchEnv({branch: ""});
  const branchs: any = [];
  branchEnv.map((it: any) => {
    branchs.push({label: it, value: `https://${it}.e7link.com/cn-global/login`});
  });
  return branchs;

}
