import {axiosGet_TJ, axiosPost} from '@/publicMethods/axios';
import {getCurrentUserInfo} from '@/publicMethods/authorityJudge';
import dayjs from 'dayjs';
import {isEmpty} from "lodash";


const users = getCurrentUserInfo();

//根据编号获取公告内容
export const getAnnouncement = async (readyReleaseNum: string, releaseType: string) => {
  const data = {
    announcement_num: readyReleaseNum,
    announcement_time: releaseType,
  };
  const result = await axiosGet_TJ('/api/verify/release/announcement', data);
  return result;
};

// 不轮播时的数据
const notCarouselData = (popupData: any) => {
  // 相当于只有一个轮播页面
  const {ptyGroup} = popupData;
  let data = {};
  data["noticePage[0][yuQue]"] = popupData.yuQueUrl;  // 语雀地址: 仅不轮播时可用
  data["noticePage[0][image]"] = popupData.uploadPic; // 服务器图片路径。templateTypeId=2(弹窗)时，必传！
  data["noticePage[0][pageNum]"] = 0; // 所属轮播页码(不轮播时固定值：为0)
  data["noticePage[0][layoutTypeId]"] = popupData.picLayout; // 图文布局: 1.上下，2.左右
  const specialList: any = [];
  ptyGroup.map((v: any) => {
    const childList: any = [];
    (v.seconds).map((v2: any) => {
      if (!isEmpty(v2.second)) childList.push({"speciality": v2.second});
    })
    specialList.push({
      "speciality": v.first,
      "children": childList
    });
  });
  data["noticePage[0][noticeContent]"] = specialList;// 特性详情。json字符串数组
  //  特性详情格式
  // const specialDt = [{"speciality": "一、新增未填报工时统计表", "children": []},
  //   {"speciality": "六、在线支付", "children": [{"speciality": "6.1新增九恒星-招行云直联接口"}, {"speciality": "6.2支付前先检查前置机状态"}]}];

  debugger;
  return data;
};

// 轮播时的数据
const carouselData = (popupData: any) => {
  let data = {};
  data["noticePage[0][featureName]"] = ""; // 特性名称: 仅轮播时可用
  data["noticePage[0][image]"] = ""; // 服务器图片路径。templateTypeId=2(弹窗)时，必传！
  data["noticePage[0][pageNum]"] = ""; // 所属轮播页码
  data["noticePage[0][layoutTypeId]"] = ""; // 图文布局: 1.上下，2.左右
  data["noticePage[0][noticeContent]"] = "";// 特性详情。json字符串数组

  return data;
};

// 公告改版后的保存公告内容
export const saveAnnounceContent = async (formData: any, popupData: object = {}) => {
  let data: any = {
    iteration: formData.announce_name, // 公告名称：默认带入当前时间，可修改，必填(string)
    templateTypeId: formData.modules, // 通知模板：1.消息卡片，2.弹窗
    updatedTime: dayjs(formData.announce_time).format('YYYY-MM-DD HH:mm:ss'), // 升级时间：手动选择时间，必填
    description: formData.announceMsg, // 升级公告详情：默认带入“亲爱的用户：您好，企企经营管理平台已于 xx 时间更新升级。更新功能：”必填
  };
  let specialData = {};
  if (data.templateTypeId === "2") { // 弹窗保存数据
    // 共同属性
    data["isCarousel"] = formData.announce_carousel; // 是否轮播
    data["pageSize"] = formData.carouselNum; // 轮播总页数
    // 还要判断是否轮播
    if (formData.announce_carousel === 1) {
      // specialData = carouselData(popupData);// 轮播
    } else {
      specialData = notCarouselData(popupData);
    }
  }

  return axiosPost('/api/77hub/notice', {...data, ...specialData});
};

// 发送（保存）公告(旧的发布过程在用)
export const postAnnouncementForOtherPage = async (formData: any) => {
  const data: any = {
    user_name: users.name,
    user_id: users.userid,
    announcement_id: formData.announcement_id,
    // ready_release_num: formData.ready_release_num,
    upgrade_time: formData.upgrade_time,
    upgrade_description: formData.upgrade_description,
    is_upgrade: formData.is_upgrade,
    announcement_status: 'release',
    announcement_time: formData.announcement_time,
    announcement_num: formData.announcement_num,
    announcement_name: formData.announcement_name,
  };
  return axiosPost('/api/verify/release/announcement', data);
};

// 公告改版后的保存公告内容
export const getYuQueContent = async (Url: string) => {
  return axiosPost('/api/77hub/yuque/docs/headings', {
    yuQue: Url
  });
};
