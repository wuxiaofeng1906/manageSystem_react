import {axiosPost, axiosPut} from '@/publicMethods/axios';
import dayjs from 'dayjs';
import {isEmpty} from "lodash";
// 获取特性列表list
const getSpecialList = (ptyGroup: any) => {
  const specialList: any = [];
  ptyGroup.map((v: any) => {
    const childList: any = [];
    (v.seconds).map((v2: any) => {
      if (!isEmpty(v2.first)) childList.push({id: v2.id, speciality: v2.first});
    })
    specialList.push({
      edit: "",
      id: v.id,
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
        id: "",
        editFlag: "",
        image: popupData.uploadPic,
        pageNum: 0, // 所属轮播页码
        layoutTypeId: popupData.picLayout,
        yuQue: popupData.yuQueUrl,
        contents: getSpecialList(ptyGroup)
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
        id: tabsContent.id,
        editFlag: "",
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

// 更新公告内容
export const updateAnnounceContent = async (formData: any, popupData: object = {}) => {
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
    // data["isCarousel"] = formData.announce_carousel === 0 ? false : true; // 是否轮播
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

// 常规的修改：不涉及新增
const normalUpdate = async (formData: any, popupData: any = []) => {
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
    return await updateAnnounceContent({...newData.commonData, releaseID: oldData.oldCommonData?.releaseID})
  } else {
    //  此应用场景：消息卡片模板变为弹窗模板
    return await updateAnnounceContent({
      ...newData.commonData,
      releaseID: oldData.oldCommonData?.releaseID
    }, newData.finalData)
  }
}

// 是否轮播选项不同
const isCarouseUpdate = (commonData: any, finalData: any, oldCommonData: any, oldAnPopData: any) => {

  const data: any = {
    "$id": commonData.releaseID,
    iteration: commonData.announce_name, // 公告名称：默认带入当前时间，可修改，必填(string)
    templateTypeId: commonData.modules, // 通知模板：1.消息卡片，2.弹窗
    updatedTime: dayjs(commonData.announce_time).format('YYYY-MM-DD HH:mm:ss'), // 升级时间：手动选择时间，必填
    description: commonData.announce_content, // 升级公告详情：默认带入“亲爱的用户：您好，企企经营管理平台已于 xx 时间更新升级。更新功能：”必填
  };

  let specialData = {};
  if (data.templateTypeId === "2") { // 弹窗保存数据
    // 共同属性
    data["isCarousel"] = commonData.announce_carousel === 0 ? false : true; // 是否轮播
    // 还要判断是否轮播(轮播还要分轮播页面是否全部填写完)
    if (commonData.announce_carousel === 1) {
      data["pageSize"] = commonData.carouselNum; // 轮播总页数
      specialData = carouselData(finalData);// 轮播
    } else {
      data["pageSize"] = 0; // 不轮播的时候总页数为0
      specialData = notCarouselData(finalData[0]); // 不轮播
    }
  }

  const relData = {...data, ...specialData};


  debugger
  if (oldCommonData.announce_carousel === 0 && commonData.announce_carousel === 1) {
    //  如果从否变为是：
    //  原来的特性添加edit：为delete，新增的轮播页面添加edit为add
  } else if (oldCommonData.announce_carousel === 1 && commonData.announce_carousel === 0) {
    //  如果从是变为否
    //  原来的轮播页面添加edit：为delete，新增的特性页面添加edit为add
  }

};

// 轮播页发生改变
const carousePageUpdate = (commonData: any, finalData: any, oldCommonData: any, oldAnPopData: any) => {
  if (oldCommonData.carouselNum > commonData.carouselNum) {
    //  轮播页减少
  } else if (oldCommonData.carouselNum < commonData.carouselNum) {
    //  轮播页增加
  }

};

// 一级特性发生改变
const firstSpecityUpdate = (commonData: any, finalData: any, oldCommonData: any, oldAnPopData: any) => {

};

// 二级特性发生改变
const secondSpecityUpdate = (commonData: any, finalData: any, oldCommonData: any, oldAnPopData: any) => {

};
// 弹窗- 新增（删除）page或特性 editFlag :detele，add
const addOrDeleteMsg = async (newData: any, oldData: any, updateType: string) => {
  const {commonData, finalData} = newData;  // commonData, finalData  ==> 新数据
  const {oldCommonData, oldAnPopData} = oldData; // oldCommonData, oldAnPopData ==> 旧数据
  debugger
  let relData: any;
  // 判断是哪种情况的修改。
  switch (updateType) {
    case "isCarouselUpdate": // 是否轮播 选择不同
      relData = isCarouseUpdate(commonData, finalData, oldCommonData, oldAnPopData);
      break;

    case "carouselPage": // 轮播页数不同
      relData = carousePageUpdate(commonData, finalData, oldCommonData, oldAnPopData);
      break;

    case "firstSpecity": // 一级特性不同
      relData = firstSpecityUpdate(commonData, finalData, oldCommonData, oldAnPopData);
      break;

    case "secondSpecity": // 二级特性不同
      relData = secondSpecityUpdate(commonData, finalData, oldCommonData, oldAnPopData);

      break;
    default:
      break;
  }


  const result = await axiosPut('/api/77hub/notice', relData);
  return result;
}

// 判断弹窗数据（是否轮播，轮播页数，以及特性条数）是否改变
const popupPageIsUpdate = (newData: any, oldData: any) => {
  const {commonData, finalData} = newData;  // commonData, finalData  ==> 新数据
  const {oldCommonData, oldAnPopData} = oldData; // oldCommonData, oldAnPopData ==> 旧数据

  // 是否轮播：不相等则是修改过是否轮播
  if (commonData.announce_carousel !== oldCommonData.announce_carousel) {
    return {status: true, type: "isCarouselUpdate"};
  }
  // 轮播页数：是否被修改过
  if (commonData.carouselNum !== oldCommonData.carouselNum) {
    return {status: true, type: "carouselPage"};
  }
  // 轮播页数至少是1个，不是轮播也有一页特性
  for (let i = 0; i < commonData.carouselNum - 1; i++) {
    const newPopData = finalData[i];
    const oldPopData = (oldAnPopData.anPopData)[i];
    //   先判断有没有tabPage（有可能一个是有轮播的，一个没轮播的）
    if (newPopData.tabPage !== oldPopData.tabPage) {
      return {status: true, type: "isCarouselUpdate"};
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
}
// 修改发布公告
// note
export const updateAnnouncement = async (newData: any, oldData: any) => {
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
    const updateType = popupPageIsUpdate(newData, oldData);
    if (updateType.status) {
      return await addOrDeleteMsg(newData, oldData, updateType.type);
    }
    // 1.2.2.2 如果没有修改过，则调用普通修改接口
    else {

      return await normalUpdate({
        ...newData.commonData,
        releaseId: oldData.oldCommonData.releaseID
      }, [...newData.finalData]);
    }
  }
};

