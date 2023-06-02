import {useCallback} from 'react';
import {useModel} from 'umi';
import axios from "axios";
import dayjs from "dayjs";
import {errorMessage} from "@/publicMethods/showMessages";

const usePermission = () => {

  // 勾选的权限
  const [authority, group, userid] = useModel('@@initialState', (init) => [
    init.initialState?.currentUser?.authority,
    init.initialState?.currentUser?.group,
    init.initialState?.currentUser?.userid
  ]);

  // 获取值班人
  // 界面值班计划查询
  const queryDutyCardInfo = async () => {
    let result: any = [];
    const currentWeek = {
      start: dayjs().startOf('week').add(1, 'day').format('YYYY/MM/DD'),
      end: dayjs().endOf('week').add(1, 'day').format('YYYY/MM/DD'),
    };
    await axios.get('/api/verify/duty/plan_data', {params: {start_time: currentWeek.start, end_time: currentWeek.end}})
      .then(function (res) {
        if (res.data.code === 200) {

          result = res.data.data.data;
        } else {
          errorMessage(`错误：${res.data.msg}`)
        }
      }).catch(function (error) {
        errorMessage(`异常信息:${error.toString()}`)
      });
    return result[0];
  };

  /*
   公告升级权限
   145,147,148，150，151 => 公告保存，公告查看，公告挂起，删除，新增
   */
  const announcePermission = useCallback(async () => {
    // 新增不做控制；对所有删除功能做控制；修改功能要区分已发布或者未发布：已发布的默认创建人/测试值班人员/管理员可以编辑，可以支持权限配置

    // if (group === "superGroup") {
    //   return {
    //     add: true,// 新增公告
    //     edit: true, // 修改公告内容（未发布）
    //     editPublished: true,//修改已发布公告
    //     delete: true, // 删除公告,
    //     deletePublished: true, // 删除已发布公告
    //   };
    // }
    let flag = {
      view: true,// 公告查看
      add: false,// 新增公告
      edit: false, // 修改公告内容（未发布）
      editPublished: false,//修改已发布公告
      delete: false, // 删除公告,
      deletePublished: false, // 删除已发布公告
      push: false, // 一键发布公告
    }
    const dutyPerson = await queryDutyCardInfo(); // user_tech
    const dutyTest = dutyPerson.filter((it: any) => it.user_tech === "测试" && it.user_id === userid);
    if (dutyTest.length) { // 如果当前登陆人是值班测试
      return {
        ...flag,
        add: true,
        edit: true,
        editPublished: true,
        push: true,
        delete: true
      };
    }

    authority.map((it: any) => {
      switch (it.name) {
        case "announcementAdd":  // 新增公告                             -----------对应权限名字：公告新增
          flag.add = true;
          break;
        case "pendingAnnouncement": // 一键发布公告                       ----------对应权限名字：一键挂起公告
          flag.push = true;
          break;
        //  以上两个权限是旧公告时候配置的权限。
        case "modifyQiQiHubNotice": // 修改公告内容（未发布）              -----------对应权限名字：修改公告内容
          flag.edit = true;
          break;
        case "modifyQiQiHubPublishedNotice": //修改已发布公告            -----------对应权限名字：修改已发布的公告
          flag.editPublished = true;
          break;
        case "deleteQiQiHubNotice":  // 删除公告,                       ----------对应权限名字：（逻辑）删除公告
          flag.delete = true;
          break;
        case "deleteQiQiHubPublishedNotice":// 删除已发布公告            ----------对应权限名字：（逻辑）删除已发布的公告
          flag.deletePublished = true;
          break;

        default:
          break;
      }
    });

    return flag;
  }, [authority]);

  const prePermission = useCallback(() => {
    const roles = authority?.flatMap((it: any) => (it?.parentId == 114 ? [+it.id] : [])) ?? [];
    return {
      delete: roles?.includes(152),
      preView: roles?.includes(153),
      preList: roles?.includes(154),
      historyList: roles?.includes(155),
      add: roles?.includes(156),
      save: roles?.includes(157),
      saveResult: roles?.includes(158),
      dbUpdate: roles?.includes(185),
      dbRecovery: roles?.includes(186),
      hotUpdate: roles?.includes(187),
    };
  }, [authority]);

  const onlineSystemPermission = useCallback(() => {
    const roles = authority?.flatMap((it: any) => (it?.parentId == 114 ? [+it.id] : [])) ?? [];
    return {
      delete: roles?.includes(159), // 移除
      refreshCheck: roles?.includes(160), // 检查刷新
      refreshOnline: roles?.includes(161), // 项目与服务刷新
      branchLock: roles?.includes(162), // 锁定分支
      branchUnlock: roles?.includes(163), // 取消锁定分支
      storyList: roles?.includes(164), // 需求列表
      serverConfirm: roles?.includes(165), // 服务确认
      hotUpdate: roles?.includes(166), // 是否可热更
      baseInfo: roles?.includes(167), // 修改基础信息
      checkStatus: roles?.includes(168), // 修改检查忽略状态
      paramSetting: roles?.includes(169), // 检查参数设置
      multiCheck: roles?.includes(170), // 批量检查
      preLock: roles?.includes(171), // 封版、取消封版
      pushMessage: roles?.includes(172), // 一键推送检查失败信息
      orderSave: roles?.includes(173), // 工单保存
      orderPublish: roles?.includes(174), // 工单标记发布结果
      cancelPublish: roles?.includes(175), // 取消发布
    };
  }, [authority]);

  return {announcePermission, prePermission, onlineSystemPermission};
};
export default usePermission;
