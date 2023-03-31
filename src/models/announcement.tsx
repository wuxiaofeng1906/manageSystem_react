import React, {useState} from 'react';
import {queryAnnounceDetail} from "@/pages/onlineSystem/announcement/announcementDetail/axiosRequest/gqlPage";
import moment from "moment";
import {dealPopDataFromService} from "@/pages/onlineSystem/announcement/announcementDetail/dataAnalysis";

export default () => {
  // 升级公告详情界面数据（公共数据）
  const [commonData, setCommonData] = useState<any>(null);
  // 升级公告详情界面数据（弹窗数据）
  const [anPopData, setAnnPopData] = useState<any>([]);
  // 当前公告所属内容是否已经上线
  const [showPulishButton, setShowPulishButton] = useState<boolean>(false); // 暂时设置为true，正式使用要设置为false

  // 旧的公告数据，用于修改公告 -- 升级公告详情界面数据（公共数据）
  const [oldCommonData, setOldCommonData] = useState<any>(null);
  // 旧的公告数据，用于修改公告 -- 升级公告详情界面数据（弹窗数据）
  // const [oldAnPopData, setOldAnnPopData] = useState<any>([]);

  // 记录tabs的排序
  const [tabOrder, setTabOrder] = useState<React.Key[]>([]);

  // 获取原数据
  const getAnnounceContent = async (releaseID: string, showNextPage: boolean = false) => {

    let head: any;
    let body: any;
    const dts = await queryAnnounceDetail(releaseID);
    const {NoticeEdition} = dts;
    if (NoticeEdition && NoticeEdition.length) {
      const noticeDetails = NoticeEdition[0];
      head = {
        announce_carousel: noticeDetails.isCarousel ? 1 : 0,
        announce_content: noticeDetails.description,
        announce_name: noticeDetails.iteration,
        announce_time: moment(noticeDetails.updatedTime),
        carouselNum: noticeDetails.pageSize,
        modules: noticeDetails.templateTypeId
      };
      if (head.modules === "2" && showNextPage) { // 如果是弹窗，并且需要获取弹窗数据，获取弹窗数据
        // 还需要在state中保存弹窗的数据
        body = dealPopDataFromService(NoticeEdition);
      }
    }

    return {head, body}
  };

  return {
    commonData, setCommonData,
    anPopData, setAnnPopData,
    showPulishButton, setShowPulishButton,
    oldCommonData, setOldCommonData,
    tabOrder, setTabOrder,
    getAnnounceContent
  };
};
