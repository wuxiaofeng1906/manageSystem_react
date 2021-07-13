import {message} from 'antd';
import React, {useState, useEffect} from 'react';
import ProForm from '@ant-design/pro-form';
import {history} from 'umi';
import {useIntl} from "@@/plugin-locale/localeExports";
import {useModel} from "@@/plugin-model/useModel";
import styles from './index.less';
import axios from "axios";
import {useRequest} from "ahooks";


/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const goto = () => {

  if (!history) return;
  setTimeout(() => {
    const {query} = history.location;
    const {redirect} = query as { redirect: string };
    history.push(redirect || '/');
  }, 20);
};

const wxLogin = () => {
  setTimeout(function () {
    // (window as any).WwLogin({
    //   "id": "container",
    //   "appid": "ww90adb0abc37b79c8",
    //   "agentid": 1000002,
    //   "redirect_uri": encodeURIComponent('http://6ce224098541.ngrok.io/user/myLogin'),
    //   "state": "ww90adb0abc37b79c8",
    //   "href": "",
    // });

    (window as any).WwLogin({
      "id": "container",
      "appid": "wwcba5faed367cdeee",
      "agentid": 1000021,
      "redirect_uri": encodeURIComponent('http://dms.q7link.com:8000/user/myLogin'),
      "state": "wwcba5faed367cdeee",
      "href": "",
    });
  }, 1000);
};

// 添加企业微信需要的script标签
const qywxScript = () => {

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = false;
  script.src = 'http://rescdn.qqmail.com/node/ww/wwopenmng/js/sso/wwLogin-1.0.0.js';
  document.head.appendChild(script);

};

const Login: React.FC<{}> = () => {
  const [submitting] = useState(false);
  const [showTitle, setTitleShown] = useState(false);

  const {initialState, setInitialState} = useModel('@@initialState');
  const intl = useIntl();

  const fetchUserInfo = async (userInfos: any) => {

    // 测试时的token
    console.log("登录后的token", userInfos.access_token);
    localStorage.setItem("accessId", userInfos.access_token); // 正式环境应放开
    localStorage.setItem("authority", JSON.stringify(userInfos.authorities));
    console.log("myauth", JSON.stringify(userInfos.authorities));

    // 权限分组：
    // 系统管理员：拥有所有权限。
    // sprint管理员：除了系统设置，其他权限全有
    // 研发中心：所有除了客服和顾问的人员
    // 还有其他用户

    // 接下来需要判断用户

    // let accessRole = userInfos.role.name;
    // if (userInfos.role.name === "superGroup") {
    //   accessRole = 'sys_admin';
    // } else if (userInfos.role.name === "projectListMG") {
    //   accessRole = 'sprint_admin';
    // }

    const userInfo = {
      name: userInfos.user.userName,
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',

      userid: userInfos.user.id,
      group: userInfos.role.name,
      authority: userInfos.authorities,
      access: userInfos.role.name
    };
    // 缓存状态
    localStorage.setItem("userLogins", JSON.stringify(userInfo)); // 正式环境应放开


    if (userInfo) {
      setInitialState({
        ...initialState,
        currentUser: userInfo,
      });
    }
  };

  const getUsersInfo = async (windowURL: any) => {
    let userCode = "";
    if (windowURL.indexOf("?") !== -1) {
      const firstGroup = windowURL.split("?"); // 区分问号后面的内容
      const secondGroup = firstGroup[1].split("&"); // 区分code和其他属性
      const thirdGroup = secondGroup[0].split("="); // 获取到=后面的值
      userCode = thirdGroup[1].toString();
      if (!windowURL.includes("redirect")) {  // 不是重定向的时候才禁用
        setTitleShown(true); // 设置为不可见
      }
    }

    // 如果获取到了usercode，则拿取用户信息和权限
    if (userCode !== "") {

      const data = {
        username: "users",
        password: userCode
      };
      await axios.post('/api/auth/login', data)
        .then(function (res) {

          const resultData = res.data;
          if (resultData.ok === true) {
            fetchUserInfo(resultData);
            goto();
          } else {
            message.error({
              content: '您无权登录！',
              duration: 1,
              style: {
                marginTop: '50vh',
              },
            });
          }
        })
        .catch(function (error) {
          console.log("登陆界面异常：", error);
          // message.error({
          //   // content: `访问异常:${error.toString()}`,
          //   duration: 1,
          //   style: {
          //     marginTop: '50vh',
          //   },
          // });
        });
    }
  };

  useRequest(() => getUsersInfo(window.location.href));

  const handleSubmit = async () => {

    // 不同组，权限不同
    const testAuth = [{
      "id": 5,
      "name": "showpage",
      "level": 1,
      "description": "查看首页",
      "parentId": 1,
      "RdSysRolePermission": {"id": 997, "permissionId": 5, "roleId": 1},
      "parent": {"id": 1, "name": "homepage", "level": 0, "description": "首页", "parentId": null}
    }, {
      "id": 6,
      "name": "showSeclectList",
      "level": 1,
      "description": "查看下拉列表",
      "parentId": 2,
      "RdSysRolePermission": {"id": 1480, "permissionId": 6, "roleId": 1},
      "parent": {"id": 2, "name": "dashboard", "level": 0, "description": "面板", "parentId": null}
    }, {
      "id": 7,
      "name": "showAllProjects",
      "level": 1,
      "description": "查看项目清单All",
      "parentId": 2,
      "RdSysRolePermission": {"id": 1482, "permissionId": 7, "roleId": 1},
      "parent": {"id": 2, "name": "dashboard", "level": 0, "description": "面板", "parentId": null}
    }, {
      "id": 8,
      "name": "showContent",
      "level": 1,
      "description": "内容查看",
      "parentId": 2,
      "RdSysRolePermission": {"id": 1483, "permissionId": 8, "roleId": 1},
      "parent": {"id": 2, "name": "dashboard", "level": 0, "description": "面板", "parentId": null}
    }, {
      "id": 9,
      "name": "getProjectDetailLine",
      "level": 1,
      "description": "穿透,查项目明细行",
      "parentId": 2,
      "RdSysRolePermission": {"id": 1484, "permissionId": 9, "roleId": 1},
      "parent": {"id": 2, "name": "dashboard", "level": 0, "description": "面板", "parentId": null}
    }, {
      "id": 10,
      "name": "showProjects",
      "level": 1,
      "description": "展示项目列表",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1485, "permissionId": 10, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 11,
      "name": "addProject",
      "level": 1,
      "description": "新增项目",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1487, "permissionId": 11, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 12,
      "name": "deleteProject",
      "level": 1,
      "description": "删除项目",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1488, "permissionId": 12, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 13,
      "name": "searchProject",
      "level": 1,
      "description": "查询项目",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1489, "permissionId": 13, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 14,
      "name": "modifyProjectName",
      "level": 1,
      "description": "修改项目名称",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1490, "permissionId": 14, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 15,
      "name": "modifyPeojectStartat",
      "level": 1,
      "description": "修改开始时间",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1491, "permissionId": 15, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 16,
      "name": "modifyProjectTestend",
      "level": 1,
      "description": "修改提测截止",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1492, "permissionId": 16, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 17,
      "name": "modifyProjectTestfinish",
      "level": 1,
      "description": "修改测试完成",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1493, "permissionId": 17, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 18,
      "name": "modifyProjectExpectStage",
      "level": 1,
      "description": "修改计划灰度",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1494, "permissionId": 18, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 19,
      "name": "modifyProjectExpectOnline",
      "level": 1,
      "description": "修改计划上线",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1495, "permissionId": 19, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 20,
      "name": "modifyProjectStatus",
      "level": 1,
      "description": "修改项目状态",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1496, "permissionId": 20, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 21,
      "name": "showDefaultButton",
      "level": 1,
      "description": "默认按钮",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1497, "permissionId": 21, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 22,
      "name": "getProjectDetailLine",
      "level": 1,
      "description": "查看项目明细（穿透）",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1498, "permissionId": 22, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 23,
      "name": "addProjectDetailLine",
      "level": 1,
      "description": "新增项目明细行",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1499, "permissionId": 23, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 24,
      "name": "deleteProjectDetailLine",
      "level": 1,
      "description": "删除项目明细行",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1500, "permissionId": 24, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 25,
      "name": "moveProjectDetailLine",
      "level": 1,
      "description": "移动项目明细行",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1501, "permissionId": 25, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 26,
      "name": "showCancleButton",
      "level": 1,
      "description": "取消",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1502, "permissionId": 26, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 27,
      "name": "showDeveloperRevertButton",
      "level": 1,
      "description": "开发已revert",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1503, "permissionId": 27, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 28,
      "name": "showTesterRevertButton",
      "level": 1,
      "description": "测试已验revert",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1504, "permissionId": 28, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 29,
      "name": "showStageVerifyButton",
      "level": 1,
      "description": "灰度已验证",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1505, "permissionId": 29, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 30,
      "name": "showOnlineVerifyButton",
      "level": 1,
      "description": "线上已验证",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1506, "permissionId": 30, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 31,
      "name": "modifyDetailLineTester",
      "level": 1,
      "description": "修改对应测试",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1507, "permissionId": 31, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 32,
      "name": "modifyDetailLineZtCategory",
      "level": 1,
      "description": "修改禅道类型",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1508, "permissionId": 32, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 33,
      "name": "modifyDetailLineZtNo",
      "level": 1,
      "description": "修改禅道编号",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1509, "permissionId": 33, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 34,
      "name": "modifyDetailLineZtStatus",
      "level": 1,
      "description": "修改禅道状态",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1510, "permissionId": 34, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 35,
      "name": "modifyDetailLineHotfix",
      "level": 1,
      "description": "修改是否支持热更新",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1511, "permissionId": 35, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 36,
      "name": "modifyDetailLineUpgrade",
      "level": 1,
      "description": "修改是否有数据升级",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1512, "permissionId": 36, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 37,
      "name": "modifyDetailLineInterface",
      "level": 1,
      "description": "修改是否有接口升级",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1513, "permissionId": 37, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 38,
      "name": "modifyDetailLinePresetData",
      "level": 1,
      "description": "修改是否有预置数据修改",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1514, "permissionId": 38, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 39,
      "name": "modifyDetailLineNeedVerify",
      "level": 1,
      "description": "修改是否需要测试验证",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1515, "permissionId": 39, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 40,
      "name": "modifyDetailLineVerifyArea",
      "level": 1,
      "description": "修改验证范围建议",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1516, "permissionId": 40, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 41,
      "name": "modifyDetailLinePublishEnv",
      "level": 1,
      "description": "修改发布环境",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1517, "permissionId": 41, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 42,
      "name": "modifyDetailLineUED",
      "level": 1,
      "description": "修改对应UED",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1518, "permissionId": 42, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 43,
      "name": "modifyDetailLineUedTestVerify",
      "level": 1,
      "description": "修改UED 测试环境验证",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1519, "permissionId": 43, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 44,
      "name": "modifyDetailLineOnlineVerify",
      "level": 1,
      "description": "修改UED线上验证",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1520, "permissionId": 44, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 45,
      "name": "modifyDetailLineMemo",
      "level": 1,
      "description": "修改备注",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1521, "permissionId": 45, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 46,
      "name": "viewRole",
      "level": 1,
      "description": "查看权限组",
      "parentId": 4,
      "RdSysRolePermission": {"id": 1469, "permissionId": 46, "roleId": 1},
      "parent": {"id": 4, "name": "authority", "level": 0, "description": "权限", "parentId": null}
    }, {
      "id": 47,
      "name": "addRole",
      "level": 1,
      "description": "增加权限组",
      "parentId": 4,
      "RdSysRolePermission": {"id": 1470, "permissionId": 47, "roleId": 1},
      "parent": {"id": 4, "name": "authority", "level": 0, "description": "权限", "parentId": null}
    }, {
      "id": 48,
      "name": "modifyRoleInfo",
      "level": 1,
      "description": "修改权限组详情",
      "parentId": 4,
      "RdSysRolePermission": {"id": 1471, "permissionId": 48, "roleId": 1},
      "parent": {"id": 4, "name": "authority", "level": 0, "description": "权限", "parentId": null}
    }, {
      "id": 49,
      "name": "deleteRole",
      "level": 1,
      "description": "删除权限组",
      "parentId": 4,
      "RdSysRolePermission": {"id": 1472, "permissionId": 49, "roleId": 1},
      "parent": {"id": 4, "name": "authority", "level": 0, "description": "权限", "parentId": null}
    }, {
      "id": 50,
      "name": "modifyRoleAuthority",
      "level": 1,
      "description": "修改权限组的权限",
      "parentId": 4,
      "RdSysRolePermission": {"id": 1474, "permissionId": 50, "roleId": 1},
      "parent": {"id": 4, "name": "authority", "level": 0, "description": "权限", "parentId": null}
    }, {
      "id": 51,
      "name": "modifyRoleUser",
      "level": 1,
      "description": "修改权限组的人员",
      "parentId": 4,
      "RdSysRolePermission": {"id": 1475, "permissionId": 51, "roleId": 1},
      "parent": {"id": 4, "name": "authority", "level": 0, "description": "权限", "parentId": null}
    }, {
      "id": 52,
      "name": "viewRoleAuthority",
      "level": 1,
      "description": "查看权限组的权限项",
      "parentId": 4,
      "RdSysRolePermission": {"id": 1476, "permissionId": 52, "roleId": 1},
      "parent": {"id": 4, "name": "authority", "level": 0, "description": "权限", "parentId": null}
    }, {
      "id": 53,
      "name": "modifyProjectDetailLine",
      "level": 1,
      "description": "修改项目明细行",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1477, "permissionId": 53, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 54,
      "name": "viewOrganization",
      "level": 1,
      "description": "查看组织结构",
      "parentId": 4,
      "RdSysRolePermission": {"id": 1478, "permissionId": 54, "roleId": 1},
      "parent": {"id": 4, "name": "authority", "level": 0, "description": "权限", "parentId": null}
    }, {
      "id": 55,
      "name": "viewProjects",
      "level": 1,
      "description": "查看sprint项目列表",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1522, "permissionId": 55, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 56,
      "name": "viewAllAuthority",
      "level": 1,
      "description": "查看权限列表",
      "parentId": 4,
      "RdSysRolePermission": {"id": 1479, "permissionId": 56, "roleId": 1},
      "parent": {"id": 4, "name": "authority", "level": 0, "description": "权限", "parentId": null}
    }, {
      "id": 57,
      "name": "viewProjectDetail",
      "level": 1,
      "description": "查看项目明细行",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1523, "permissionId": 57, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 58,
      "name": "viewLog",
      "level": 1,
      "description": "查看系统日志",
      "parentId": 4,
      "RdSysRolePermission": {"id": 1524, "permissionId": 58, "roleId": 1},
      "parent": {"id": 4, "name": "authority", "level": 0, "description": "权限", "parentId": null}
    }, {
      "id": 60,
      "name": "vdAvgCodeOnWeek",
      "level": 1,
      "description": "查看开发平均每周代码量 (vd: view developer)",
      "parentId": 59,
      "RdSysRolePermission": {"id": 1525, "permissionId": 60, "roleId": 1},
      "parent": {"id": 59, "name": "kpi", "level": 0, "description": "绩效指标", "parentId": null}
    }, {
      "id": 61,
      "name": "vdThousLineBug",
      "level": 1,
      "description": "查看开发千行bug率",
      "parentId": 59,
      "RdSysRolePermission": {"id": 1527, "permissionId": 61, "roleId": 1},
      "parent": {"id": 59, "name": "kpi", "level": 0, "description": "绩效指标", "parentId": null}
    }, {
      "id": 62,
      "name": "vdThousLineBugNoOnline",
      "level": 1,
      "description": "查看开发千行bug率(不含线上)",
      "parentId": 59,
      "RdSysRolePermission": {"id": 1528, "permissionId": 62, "roleId": 1},
      "parent": {"id": 59, "name": "kpi", "level": 0, "description": "绩效指标", "parentId": null}
    }, {
      "id": 63,
      "name": "vdUnitTestCover",
      "level": 1,
      "description": "查看开发单元测试覆盖率",
      "parentId": 59,
      "RdSysRolePermission": {"id": 1529, "permissionId": 63, "roleId": 1},
      "parent": {"id": 59, "name": "kpi", "level": 0, "description": "绩效指标", "parentId": null}
    }, {
      "id": 64,
      "name": "vdCarryTestPass",
      "level": 1,
      "description": "查看开发提测一次通过率",
      "parentId": 59,
      "RdSysRolePermission": {"id": 1530, "permissionId": 64, "roleId": 1},
      "parent": {"id": 59, "name": "kpi", "level": 0, "description": "绩效指标", "parentId": null}
    }, {
      "id": 65,
      "name": "vdBugReopen",
      "level": 1,
      "description": "查看开发bug reopen率",
      "parentId": 59,
      "RdSysRolePermission": {"id": 1531, "permissionId": 65, "roleId": 1},
      "parent": {"id": 59, "name": "kpi", "level": 0, "description": "绩效指标", "parentId": null}
    }, {
      "id": 66,
      "name": "vdCodeReview",
      "level": 1,
      "description": "查看开发code review",
      "parentId": 59,
      "RdSysRolePermission": {"id": 1532, "permissionId": 66, "roleId": 1},
      "parent": {"id": 59, "name": "kpi", "level": 0, "description": "绩效指标", "parentId": null}
    }, {
      "id": 67,
      "name": "vdBugRepairDuration",
      "level": 1,
      "description": "查看开发bug修复时长",
      "parentId": 59,
      "RdSysRolePermission": {"id": 1533, "permissionId": 67, "roleId": 1},
      "parent": {"id": 59, "name": "kpi", "level": 0, "description": "绩效指标", "parentId": null}
    }, {
      "id": 68,
      "name": "vdBugRepairRate",
      "level": 1,
      "description": "查看开发bug修复率",
      "parentId": 59,
      "RdSysRolePermission": {"id": 1534, "permissionId": 68, "roleId": 1},
      "parent": {"id": 59, "name": "kpi", "level": 0, "description": "绩效指标", "parentId": null}
    }, {
      "id": 69,
      "name": "vtOnlineThousLineBug",
      "level": 1,
      "description": "查看测试线上千行bug率 (vt: view tester)",
      "parentId": 59,
      "RdSysRolePermission": {"id": 1535, "permissionId": 69, "roleId": 1},
      "parent": {"id": 59, "name": "kpi", "level": 0, "description": "绩效指标", "parentId": null}
    }, {
      "id": 70,
      "name": "vtOnlieThousLineBugWithIndex",
      "level": 1,
      "description": "查看测试线上千行bug率(参考指标)",
      "parentId": 59,
      "RdSysRolePermission": {"id": 1536, "permissionId": 70, "roleId": 1},
      "parent": {"id": 59, "name": "kpi", "level": 0, "description": "绩效指标", "parentId": null}
    }, {
      "id": 71,
      "name": "vtOnlineThousLineBugWithTest",
      "level": 1,
      "description": "查看测试线上千行bug率(含测试)",
      "parentId": 59,
      "RdSysRolePermission": {"id": 1537, "permissionId": 71, "roleId": 1},
      "parent": {"id": 59, "name": "kpi", "level": 0, "description": "绩效指标", "parentId": null}
    }, {
      "id": 72,
      "name": "vtCaseRun",
      "level": 1,
      "description": "查看测试用例执行率",
      "parentId": 59,
      "RdSysRolePermission": {"id": 1538, "permissionId": 72, "roleId": 1},
      "parent": {"id": 59, "name": "kpi", "level": 0, "description": "绩效指标", "parentId": null}
    }, {
      "id": 73,
      "name": "vtBugFlybackDuration",
      "level": 1,
      "description": "查看测试bug回归时长",
      "parentId": 59,
      "RdSysRolePermission": {"id": 1539, "permissionId": 73, "roleId": 1},
      "parent": {"id": 59, "name": "kpi", "level": 0, "description": "绩效指标", "parentId": null}
    }, {
      "id": 74,
      "name": "vtAutoCover",
      "level": 1,
      "description": "查看测试自动化覆盖率",
      "parentId": 59,
      "RdSysRolePermission": {"id": 1540, "permissionId": 74, "roleId": 1},
      "parent": {"id": 59, "name": "kpi", "level": 0, "description": "绩效指标", "parentId": null}
    }, {
      "id": 75,
      "name": "vtCaseExecute",
      "level": 1,
      "description": "查看测试用例执行量",
      "parentId": 59,
      "RdSysRolePermission": {"id": 1541, "permissionId": 75, "roleId": 1},
      "parent": {"id": 59, "name": "kpi", "level": 0, "description": "绩效指标", "parentId": null}
    }, {
      "id": 76,
      "name": "vtEffectiveCase",
      "level": 1,
      "description": "查看测试有效用例率",
      "parentId": 59,
      "RdSysRolePermission": {"id": 1542, "permissionId": 76, "roleId": 1},
      "parent": {"id": 59, "name": "kpi", "level": 0, "description": "绩效指标", "parentId": null}
    }, {
      "id": 77,
      "name": "vpChangeApply",
      "level": 1,
      "description": "查看产品需求变更率 (vp: view productor)",
      "parentId": 59,
      "RdSysRolePermission": {"id": 1543, "permissionId": 77, "roleId": 1},
      "parent": {"id": 59, "name": "kpi", "level": 0, "description": "绩效指标", "parentId": null}
    }, {
      "id": 78,
      "name": "vpAvgResopneDuration",
      "level": 1,
      "description": "查看产品响应顾问平均时长",
      "parentId": 59,
      "RdSysRolePermission": {"id": 1544, "permissionId": 78, "roleId": 1},
      "parent": {"id": 59, "name": "kpi", "level": 0, "description": "绩效指标", "parentId": null}
    }, {
      "id": 79,
      "name": "vtBugFlybackRate",
      "level": 1,
      "description": "查看测试bug回归率",
      "parentId": 59,
      "RdSysRolePermission": {"id": 1545, "permissionId": 79, "roleId": 1},
      "parent": {"id": 59, "name": "kpi", "level": 0, "description": "绩效指标", "parentId": null}
    }, {
      "id": 80,
      "name": "modifyDetailLinePropedTest",
      "level": 1,
      "description": "修改已提测状态",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1546, "permissionId": 80, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }, {
      "id": 81,
      "name": "modifyDetailLineStage",
      "level": 1,
      "description": "修改当前阶段",
      "parentId": 3,
      "RdSysRolePermission": {"id": 1547, "permissionId": 81, "roleId": 1},
      "parent": {"id": 3, "name": "projects", "level": 0, "description": "项目列表", "parentId": null}
    }];

    localStorage.setItem("accessId", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IuWQtOaZk-WHpCIsInN1YiI6Ild1WGlhb0ZlbmciLCJpYXQiOjE2MjM4MzA2Nzd9.G3EjtMWppClX_E2NN0dFPXgX6OsGSrIXy4ReT_Rs5zI');
    localStorage.setItem("authority", JSON.stringify(testAuth));

    const userInfos = {
      name: 'testUser',
      userid: 'test',
      group: 'superGroup',
      authority: '',
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      access: 'superGroup'
    };
    localStorage.setItem("userLogins", JSON.stringify(userInfos));

    if (userInfos) {
      setInitialState({
        ...initialState,
        currentUser: userInfos,
      });
    }

    goto();
  };

  useEffect(() => {
    wxLogin();
  }, []);

  return (
    <div className={styles.container}>

      <div className={styles.content} hidden={showTitle}>

        {/* logo  */}
        <div className={styles.top}>
          <div className={styles.header}>
            <img alt="logo" className={styles.logo} src="/77Logo.png"/>
            <span className={styles.title}>企企研发管理平台</span>
          </div>
          <div className={styles.desc}></div>
        </div>

        {/* 登录 */}
        <div className={styles.main}>
          {/* 自动登录 */}
          {qywxScript()}
          <div className={styles.desc} id="container"></div>

          {/* 手动登录


          <ProForm submitter={{
            searchConfig: {
              submitText: intl.formatMessage({
                id: 'pages.login.submit',
                defaultMessage: '登录',
              }),
            },
            render: (_, dom) => dom.pop(),
            submitButtonProps: {
              loading: submitting,
              size: 'large',
              style: {
                width: '100%',
              },
            },
          }} onFinish={async () => {
            handleSubmit();
          }}>
          </ProForm>

*/}
        </div>
      </div>

    </div>
  );
};

export default Login;
