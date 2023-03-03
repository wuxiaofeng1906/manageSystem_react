import {axiosGet_TJ, axiosPost, axiosPut} from '@/publicMethods/axios';
import {getCurrentUserInfo} from '@/publicMethods/authorityJudge';
import dayjs from 'dayjs';
import {isEmpty} from "lodash";
import {sucMessage} from "@/publicMethods/showMessages";

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

// 获取特性列表list
const getSpecialList = (ptyGroup: any) => {
  const specialList: any = [];
  ptyGroup.map((v: any) => {
    const childList: any = [];
    (v.seconds).map((v2: any) => {
      if (!isEmpty(v2.first)) childList.push({speciality: v2.first});
    })
    specialList.push({
      speciality: v.first,
      children: childList
    });
  });
  return specialList;
}
// 不轮播时的数据
const notCarouselData = (popupData: any) => {
  // 相当于只有一个轮播页面
  const {ptyGroup} = popupData;
  const data = {
    pages: [
      {
        "image": popupData.uploadPic,
        "pageNum": 0, // 所属轮播页码
        "layoutTypeId": popupData.picLayout,
        "yuQue": popupData.yuQueUrl,
        "contents": getSpecialList(ptyGroup)
      }
    ]
  }
  return data;
};

// 轮播时的数据
const carouselData = (popupData: any) => {
  if (!popupData || popupData.length === 0) return {};
  // 轮播页数没填完的时候，只保存有数据的页面
  const data: any = [];
  popupData.map((v: any) => {
    const {tabsContent} = v;
    // 通过判断图片和一级特性是否为空来确定此轮播页面有没有填写完  (测试时：  )
    if (tabsContent.uploadPic && tabsContent.ptyGroup && (tabsContent.ptyGroup)[0].first) {
      data.push({
        featureName: tabsContent.specialName,
        image: tabsContent.uploadPic,
        pageNum: v.tabPage,
        layoutTypeId: tabsContent.picLayout,
        contents: getSpecialList(tabsContent.ptyGroup)
      });
    }
  });
  return {pages: data};
};

// 公告改版后的保存公告内容
export const saveAnnounceContent = async (formData: any, popupData: object = {}) => {

  const data: any = {
    iteration: formData.announce_name, // 公告名称：默认带入当前时间，可修改，必填(string)
    templateTypeId: formData.modules, // 通知模板：1.消息卡片，2.弹窗
    updatedTime: dayjs(formData.announce_time).format('YYYY-MM-DD HH:mm:ss'), // 升级时间：手动选择时间，必填
    description: formData.announce_content, // 升级公告详情：默认带入“亲爱的用户：您好，企企经营管理平台已于 xx 时间更新升级。更新功能：”必填
  };


  let specialData = {};
  if (data.templateTypeId === "2") { // 弹窗保存数据
    // 共同属性
    data["isCarousel"] = formData.announce_carousel === 0 ? false : true; // 是否轮播
    // 还要判断是否轮播(轮播还要分轮播页面是否全部填写完)
    if (formData.announce_carousel === 1) {
      data["pageSize"] = formData.carouselNum; // 轮播总页数
      specialData = carouselData(popupData);// 轮播
    } else {
      data["pageSize"] = 0; // 不轮播的时候总页数为0
      specialData = notCarouselData(popupData[0]); // 不轮播
    }
  }

  const relData = {...data, ...specialData};
  return axiosPost('/api/77hub/notice', relData);
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

// 判断该公告是否已被上线，若没有上线，则不显示一键发布，若已上线才显示，位置在保存的左边。
export const announceIsOnlined = async (announceName: string) => {
  const result = await axiosGet_TJ('/api/77hub/notice/be-online', {iteration: announceName});
  return result;
}

// 一键发布
export const oneKeyToRelease = (id: any) => {
  return axiosPost('/api/77hub/notice/released/', {
    sid: id
  });
};




