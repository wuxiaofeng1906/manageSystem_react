import {axiosPost, axiosPut} from '@/publicMethods/axios';
import dayjs from 'dayjs';
import {isEmpty} from "lodash";
import {queryAnnounceDetail} from "@/pages/onlineSystem/announcement/announcementDetail/axiosRequest/gqlPage";
import {dealPopDataFromService} from "../dataAnalysis/index"

// 修改的api
const updateApi = async (data: any) => {

  const result = await axiosPut('/api/77hub/notice', data);
  return result;
}

//  region 修改时候调用的新增（比如修改模板类型，是否轮播）
const getSpecialListForAdd = (ptyGroup: any) => {
  const specialList: any = [];
  ptyGroup.map((v: any) => {
    const childList: any = [];
    (v.seconds).map((v2: any) => {
      if (!isEmpty(v2.first)) childList.push({id: v2.id, speciality: v2.first});
    })
    specialList.push({
      id: v.id,
      speciality: v.first,
      children: childList
    });
  });
  return specialList;
};

// 不轮播时的数据
const notCarouselDataForAdd = (popupData: any) => {
  // 相当于只有一个轮播页面
  const {ptyGroup} = popupData;
  const data = {
    pages: [
      {
        image: popupData.uploadPic,
        pageNum: 0, // 所属轮播页码
        layoutTypeId: popupData.picLayout,
        yuQue: popupData.yuQueUrl,
        contents: getSpecialListForAdd(ptyGroup)
      }
    ]
  }
  return data;
};

// 轮播时的数据
const carouselDataForAdd = (popupData: any) => {
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
        contents: getSpecialListForAdd(tabsContent.ptyGroup)
      });
    }
  });
  return {pages: data};
};

// 更新公告内容
export const updateAnnounceContentForAdd = async (formData: any, popupData: object = {}) => {
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
      specialData = carouselDataForAdd(popupData);// 轮播
    } else {
      data["pageSize"] = 0; // 不轮播的时候总页数为0
      specialData = notCarouselDataForAdd(popupData[0]); // 不轮播
    }
  }

  const relData = {...data, ...specialData};
  return axiosPost('/api/77hub/notice', relData);
  // return {ok: false, message: "ssssss"}
};

// 切换升级模板--调用新增接口（会删除原有公告）调用新增接口，多传一个参数 "$id":"Q8G383618N7003B",
const updateForModulesAndCarousel = async (newCommonData: any, newPopData: any, oldCommonData: any, oldPopData: any) => {
  //  此应用场景：弹窗模板变为消息模板
  if (newCommonData?.modules === "1") {
    return await updateAnnounceContentForAdd({...newCommonData, releaseID: oldCommonData?.id})
  } else {
    //  此应用场景：消息卡片模板变为弹窗模板
    return await updateAnnounceContentForAdd(
      {...newCommonData, releaseID: oldCommonData?.id}, newPopData)
  }
}
// endregion


const getSpecialListForUpdate = (ptyGroup: any) => {
  const specialList: any = [];
  ptyGroup.map((v: any) => {
    const childList: any = [];
    (v.seconds).map((v2: any) => {
      if (!isEmpty(v2.first)) childList.push({id: v2.id, speciality: v2.first});
    })
    specialList.push({
      id: v.id,
      parentId: v.parentId,
      speciality: v.first,
      children: childList
    });
  });
  return specialList;
};

// 不轮播时的数据
const notCarouselDataForUpdate = (popupData: any, oldPopData: any = []) => {

  debugger
  // 相当于只有一个轮播页面
  const {ptyGroup} = popupData;
  const data = {
    pages: [
      {
        id: oldPopData[0].tabsContent.id, // 非轮播的page id在界面拿不到。
        image: popupData.uploadPic,
        pageNum: 0, // 所属轮播页码
        layoutTypeId: popupData.picLayout,
        yuQue: popupData.yuQueUrl,
        contents: getSpecialListForUpdate(ptyGroup)
      }
    ]
  }
  return data;
};

// 轮播时的数据
const carouselDataForUpdate = (popupData: any) => {
  if (!popupData || popupData.length === 0) return {};
  // 轮播页数没填完的时候，只保存有数据的页面
  const data: any = [];
  popupData.map((v: any) => {
    const {tabsContent} = v;
    // 通过判断图片和一级特性是否为空来确定此轮播页面有没有填写完  (测试时：  )
    if (tabsContent.uploadPic && tabsContent.ptyGroup && (tabsContent.ptyGroup)[0].first) {
      data.push({
        id: tabsContent.id,
        featureName: tabsContent.specialName,
        image: tabsContent.uploadPic,
        pageNum: v.tabPage,
        layoutTypeId: tabsContent.picLayout,
        contents: getSpecialListForUpdate(tabsContent.ptyGroup)
      });
    }
  });
  return {pages: data};
};

// 常规的修改：不涉及新增
const normalUpdate = async (formData: any, popupData: any = [], oldPopData: any = []) => {
  debugger
  const data: any = {
    id: formData.releaseId,
    iteration: formData.announce_name, // 公告名称：默认带入当前时间，可修改，必填(string)
    // templateTypeId: formData.modules, //  修改的话不传模板id
    updatedTime: dayjs(formData.announce_time).format('YYYY-MM-DD HH:mm:ss'), // 升级时间：手动选择时间，必填
    description: formData.announce_content, // 升级公告详情：默认带入“亲爱的用户：您好，企企经营管理平台已于 xx 时间更新升级。更新功能：”必填
  };
  let specialData = {};
  if (formData.modules === "2") { // 弹窗保存数据
    // 共同属性
    // data["isCarousel"] = formData.announce_carousel === 0 ? false : true; // 是否轮播
    // 还要判断是否轮播(轮播还要分轮播页面是否全部填写完)
    if (formData.announce_carousel === 1) {
      data["pageSize"] = formData.carouselNum; // 轮播总页数
      specialData = carouselDataForUpdate(popupData);// 轮播
    } else {
      data["pageSize"] = 0; // 不轮播的时候总页数为0

      specialData = notCarouselDataForUpdate(popupData[0], oldPopData); // 不轮播
    }
  }
  const relData = {...data, ...specialData};
  return await updateApi(relData);

};


// 轮播页发生改变
const carousePageUpdate = (newCommonData: any, newPopData: any, oldCommonData: any, oldPopData: any) => {
  debugger


  if (oldCommonData.carouselNum > newCommonData.carouselNum) {
    //  轮播页减少,删除之前的轮播页数
    return {}
  } else if (oldCommonData.carouselNum < newCommonData.carouselNum) {
    debugger
    let page: any = [];
    //  拿最后新增的
    for (let i = oldCommonData.carouselNum; i < newCommonData.carouselNum; i++) {
      const pageDt = newPopData[i].tabsContent;
      const content: any = [];

      (pageDt.ptyGroup).map((v: any) => {

        // 二级特性
        const secondLevel: any = [];
        const second = v.seconds;
        second.map((v2: any) => {
          if (v2.first) {
            secondLevel.push({
              "speciality": v2.first,
              "editFlag": "add"
            })
          }
        });
        content.push({
          "speciality": v.first,
          "editFlag": "add",
          children: secondLevel
        });
      });
      page.push({
        image: pageDt.uploadPic,
        pageNum: newPopData[i].tabPage,
        layoutTypeId: pageDt.picLayout,
        editFlag: "add",
        contents: [{
          "speciality": pageDt.specialName,
          "editFlag": "add",
          "children": content
        }]
      })
    }
    return {
      id: oldCommonData.id,
      pageSize: newCommonData.carouselNum,
      iteration: newCommonData.announce_name,
      updatedTime: dayjs(newCommonData.announce_time).format("YYYY-MM-DD hh:mm:ss"),
      description: newCommonData.announce_content,
      // 模板类型和是否轮播不能修改
      // "templateTypeId": newCommonData.modules,
      // "isCarousel": true,
      pages: page
    }
  }
  return {}
};

// 一级特性发生改变
const firstSpecityUpdate = (commonData: any, finalData: any, oldCommonData: any, oldAnPopData: any) => {
  console.log(finalData, oldAnPopData);


  // 轮播页数至少是1个，不是轮播也有一页特性
  for (let i = 0; i < commonData.carouselNum - 1; i++) {
    const newPopData = finalData[i];
    const oldPopData = (oldAnPopData.anPopData)[i];
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
    if (newPtGroup.length !== oldPtGroup.length) { // 如果一级特性个数不同
      // 需要匹配哪些数据要add，哪些数据要delete
      newPtGroup.map(() => {

      })
    }
    for (let m = 0; m < newPtGroup.length; m++) {
      const newFirstSp = newPtGroup[m];
      const oldFirstSp = oldPtGroup[m];
      if (newFirstSp.seconds?.length !== oldFirstSp.seconds?.length) { // 二级特性个数不同


      }
    }
  }
};

// 二级特性发生改变
const secondSpecityUpdate = (commonData: any, finalData: any, oldCommonData: any, oldAnPopData: any) => {

};

// 弹窗- 新增（删除）page或特性 editFlag :detele，add
const addOrDeleteMsg = async (newCommonData: any, newPopData: any, oldCommonData: any, oldPopData: any, updateType: string) => {

  debugger
  let relData: any;
  // 判断是哪种情况的修改。
  switch (updateType) {
    case "carouselPage": // 轮播页数不同
      relData = carousePageUpdate(newCommonData, newPopData, oldCommonData, oldPopData);
      break;

    case "firstSpecity": // 一级特性不同
      relData = firstSpecityUpdate(newCommonData, newPopData, oldCommonData, oldPopData);
      break;

    case "secondSpecity": // 二级特性不同
      relData = secondSpecityUpdate(newCommonData, newPopData, oldCommonData, oldPopData);

      break;
    default:
      break;
  }

  return await updateApi(relData);
}

// 判断弹窗数据（是否轮播，轮播页数，以及特性条数）是否改变
const popupPageIsUpdate = (newCommonData: any, newPopData: any, oldCommonData: any, oldPopData: any) => {

  // 这个函数包含三种情况，1.新增或删除轮播页数  2.新增轮播页和相关属性 3.页面属性新增或者删除
  // 首先，判断是否轮播，如果不是轮播，则需要看特性项有没有改变过。如果是轮播，则继续判断其他情况
  debugger

  // 轮播页数：是否被修改过
  if (newCommonData.carouselNum !== oldCommonData.carouselNum) {
    return {status: true, type: "carouselPage"};
  }
  // 轮播页数至少是1个，不是轮播也有一页特性
  for (let i = 0; i < newCommonData.carouselNum - 1; i++) {
    const newPopTemp = newPopData[i];
    const oldPopTemp = oldPopData[i];
    // 如果是不轮播的数据
    let newPtGroup = [];
    let oldPtGroup = [];
    // 如果不是轮播
    if (!newPopTemp.tabPage) {
      newPtGroup = newPopTemp.ptyGroup;
      oldPtGroup = oldPopTemp.ptyGroup;
    } else {
      // 如果是轮播的数据
      newPtGroup = newPopTemp.tabsContent?.ptyGroup;
      oldPtGroup = oldPopTemp.tabsContent?.ptyGroup;
    }
    if (newPtGroup.length !== oldPtGroup.length) { // 如果一级特性个数不同，也不同
      return {status: true, type: "firstSpecity"};
      break
    }
    for (let m = 0; m < newPtGroup.length; m++) {
      const newFirstSp = newPtGroup[m];
      const oldFirstSp = oldPtGroup[m];
      if (newFirstSp.seconds?.length !== oldFirstSp.seconds?.length) { // 二级特性个数不同
        return {status: true, type: "secondSpecity"};
        break
      }
    }
  }
  return {status: false, type: ""};
};

// 修改发布公告
export const updateAnnouncement = async (releaseID: string, newCommonData: any, newPopData: any) => {

  let oldCommonData = {
    id: releaseID,
    templateTypeId: "",
    iteration: "",
    updatedTime: "",
    isCarousel: "",
    description: "",
    carouselNum: 0
  };
  let oldPopData: any = [];
  const dts = await queryAnnounceDetail(releaseID);
  if (dts.NoticeEdition && (dts.NoticeEdition).length) {
    const temp = (dts.NoticeEdition)[0];
    oldCommonData.templateTypeId = temp.templateTypeId;
    oldCommonData.iteration = temp.iteration;
    oldCommonData.updatedTime = temp.updatedTime;
    oldCommonData.isCarousel = temp.isCarousel;
    oldCommonData.description = temp.description;
    oldCommonData.carouselNum = temp.pageSize;
    // 获取旧的数据，用于修改数据对比
    oldPopData = await dealPopDataFromService(dts.NoticeEdition);
  }

  debugger
  // 是否轮播
  const isCarsousel = oldCommonData?.isCarousel ? 1 : 0;
  // // 1 进行判断，首先判断模板类型和是否轮播选项有没有被改变。
  // 1.1 如果改变了，直接调用新增接口，需要把旧公告ID一并传到后端
  if (newCommonData.modules !== oldCommonData?.templateTypeId
    || newCommonData?.announce_carousel !== isCarsousel) {
    return await updateForModulesAndCarousel(newCommonData, newPopData, oldCommonData, oldPopData);
  }
    // 1.2 如果模板类型没有改变
  // 1.2.1 如果是消息模板，则直接调用常规修改接口
  else if (newCommonData.modules === "1") { // 如果是消息卡片
    return await normalUpdate({...newCommonData, releaseId: oldCommonData.id});
  } else {
    // 1.2.2 如果是弹窗，则需要判断有没有新增或删除过轮播页数和特性项
    // 1.2.2.1 如果有修改过，则调用特殊修改接口
    debugger
    const updateType = popupPageIsUpdate(newCommonData, newPopData, oldCommonData, oldPopData);
    if (updateType.status) {
      return await addOrDeleteMsg(newCommonData, newPopData, oldCommonData, oldPopData, updateType.type);
    }
    // 1.2.2.2 如果没有修改过，则调用普通修改接口
    else {
      return await normalUpdate(
        {...newCommonData, releaseId: oldCommonData.id},
        [...newPopData], [...oldPopData]);
    }
  }
};

