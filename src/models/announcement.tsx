import React, {useState} from 'react';
import {queryAnnounceDetail} from "@/pages/onlineSystem/announcement/announcementDetail/axiosRequest/gqlPage";

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


  const getAnnounceContent = async (releaseID: string) => {
    const dts = await queryAnnounceDetail(releaseID);
  };

  return {
    commonData, setCommonData,
    anPopData, setAnnPopData,
    showPulishButton, setShowPulishButton,
    oldCommonData, setOldCommonData,
    tabOrder, setTabOrder
    // oldAnPopData, setOldAnnPopData

  };
};
