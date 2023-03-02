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
      if (!isEmpty(v2.second)) childList.push({"speciality": v2.second});
    })
    specialList.push({
      "speciality": v.first,
      "children": childList
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
  if (!popupData && popupData.length) return {};
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
  debugger
  const data: any = {
    iteration: formData.announce_name, // 公告名称：默认带入当前时间，可修改，必填(string)
    templateTypeId: formData.modules, // 通知模板：1.消息卡片，2.弹窗
    updatedTime: dayjs(formData.announce_time).format('YYYY-MM-DD HH:mm:ss'), // 升级时间：手动选择时间，必填
    description: formData.announce_content, // 升级公告详情：默认带入“亲爱的用户：您好，企企经营管理平台已于 xx 时间更新升级。更新功能：”必填
  };

  // 公告模板变了，使用旧id来删除原来的公告
  if (formData.releaseID) {
    data["$id"] = formData.releaseID;
  }
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


// 常规的修改：不涉及新增
const normalUpdate = async (formData: any, popupData: object = {}) => {
  debugger
  const data: any = {
    id: formData.releaseId,
    iteration: formData.announce_name, // 公告名称：默认带入当前时间，可修改，必填(string)
    // templateTypeId: formData.modules, //  修改的话不传模板id
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


  const result = await axiosPut('/api/77hub/notice', relData);
  return result;

};

// 切换升级模板--调用新增接口（会删除原有公告）调用新增接口，多传一个参数 "$id":"Q8G383618N7003B",
const updateForChangeModules = async (newData: any, oldData: any) => {
  //  此应用场景：弹窗模板变为消息模板
  if (newData.commonData?.modules === "1") {
    return await saveAnnounceContent({...newData.commonData, releaseID: oldData.releaseID})
  } else {
    //  此应用场景：消息卡片模板变为弹窗模板
    return await saveAnnounceContent({
      ...newData.commonData,
      releaseID: oldData.oldCommonData?.releaseID
    }, newData.finalData)
  }
}

// 弹窗- 新增（删除）page或特性 editFlag：update，detele，add
const addOrDeleteMsg = async (newData: any, oldData: any) => {
  sucMessage("测试中。。。。。。。。。。。。。。。。。。。。。")


  let relData = {id:"",pages:[]};

  const result = await axiosPut('/api/77hub/notice', relData);
  return result;
}

// 判断弹窗数据（是否轮播，轮播页数，以及特性条数）是否改变
const popupPageIsUpdate = (newData: any, oldData: any) => {
  const {commonData, finalData} = newData;  // commonData, finalData  ==> 新数据
  const {oldCommonData, oldAnPopData} = oldData; // oldCommonData, oldAnPopData ==> 旧数据

  // 是否轮播：不相等则是修改过是否轮播
  if (commonData.announce_carousel !== oldCommonData.announce_carousel) {
    return true;
  }
  // 轮播页数：是否被修改过
  if (commonData.carouselNum !== oldCommonData.carouselNum) {
    return true;
  }
  // 轮播页数至少是1个，不是轮播也有一页特性
  for (let i = 0; i < commonData.carouselNum + 1; i++) {
    const newPopData = finalData[i];
    const oldPopData = (oldAnPopData.anPopData)[i];
    //   先判断有没有tabPage（有可能一个是有轮播的，一个没轮播的）
    if (newPopData.tabPage !== oldPopData.tabPage) {
      return true;
      break;
    }

    // 如果是不轮播的数据
    let newPtGroup = [];
    let oldPtGroup = [];
    if (!newPopData.tabPage) {
      newPtGroup = newPopData.ptyGroup;
      oldPtGroup = oldPopData.ptyGroup;
    } else {
      // 如果是轮播的数据
      newPtGroup = newPopData.tabsContent?.ptyGroup;
      oldPtGroup = oldPopData.tabsContent?.ptyGroup;
    }
    if (oldPtGroup.length !== oldPtGroup.length) { // 如果一级特性个数不同，也不同
      return true;
      break
    }
    for (let m = 0; m < newPtGroup.length; m += 1) {
      const newFirstSp = newPtGroup[m];
      const oldFirstSp = oldPtGroup[m];
      if (newFirstSp.length !== oldFirstSp.length) { // 二级特性个数不同
        return true;
        break
      }
    }
  }
  return false;
}
// 修改发布公告
// note
export const updateAnnouncement = async (newData: any, oldData: any) => {
  debugger
  // 1 进行判断，首先判断模板类型有没有被改变。
  // 1.1 如果改变了，直接调用新增接口，需要把旧公告ID一并传到后端
  if (newData.commonData?.modules !== oldData.oldCommonData?.modules) {
    return await updateForChangeModules(newData, oldData);
  }
    // 1.2 如果模板类型没有改变
  // 1.2.1 如果是消息模板，则直接调用常规修改接口
  else if (newData.commonData?.modules === "1") { // 如果是消息卡片
    return await normalUpdate({...newData.commonData, releaseId: oldData.oldCommonData.releaseID});
  } else {
    // // 1.2.2 如果是弹窗，则需要判断有没有新增或删除过   是否轮播、特性项、以及轮播页数

    // 1.2.2.1 如果有修改过，则调用特殊修改接口
    if (popupPageIsUpdate(newData, oldData)) {
      return await addOrDeleteMsg(newData, oldData);
    }
    // 1.2.2.2 如果没有修改过，则调用普通修改接口
    else {
      return await normalUpdate({
        ...newData.commonData,
        releaseId: oldData.oldCommonData.releaseID
      }, {...newData.finalData});
    }
  }
};

