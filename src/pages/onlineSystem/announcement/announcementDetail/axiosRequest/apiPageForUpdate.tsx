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
  return relData;
};


// 判断轮播页是否被修改
const carouseNumIsUpdate = (newCommonData: any, oldCommonData: any) => {
  // 轮播页数：是否被修改过
  if (newCommonData.carouselNum !== oldCommonData.carouselNum) {
    return true;
  }
  return false;
};

// 判断一级特性是否被修改
const firstSpecialIsUpdate = (newCommonData: any, newPopData: any, oldPopData: any) => {
  // 轮播页数至少是1个，不是轮播也有一页特性
  let updateValue = false;
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
      updateValue = true;
      break
    }
  }

  return updateValue;
};

// 判断二级特性是否被修改
const secondSpecialIsUpdate = (newCommonData: any, newPopData: any, oldPopData: any) => {
  // 轮播页数至少是1个，不是轮播也有一页特性
  let updateValue = false;

  for (let i = 0; i < newCommonData.carouselNum - 1; i++) {
    const newPopTemp = newPopData[i];
    const oldPopTemp = oldPopData[i];
    // 如果是不轮播的数据
    let newPtGroup = [];
    let oldPtGroup = [];
    // 如果不是轮播  ,轮播页数至少是1个，不轮播也有一页特性
    if (!newPopTemp.tabPage) {
      newPtGroup = newPopTemp.ptyGroup;
      oldPtGroup = oldPopTemp.ptyGroup;
    } else {
      // 如果是轮播的数据
      newPtGroup = newPopTemp.tabsContent?.ptyGroup;
      oldPtGroup = oldPopTemp.tabsContent?.ptyGroup;
    }
    for (let m = 0; m < newPtGroup.length; m++) {
      const newFirstSp = newPtGroup[m];
      const oldFirstSp = oldPtGroup[m];
      if (newFirstSp && oldFirstSp) {
        if (newFirstSp.seconds?.length !== oldFirstSp.seconds?.length) { // 二级特性个数不同
          updateValue = true;
          break
        }
      }
    }

    // 如果updateValue 是true，就要跳出当前循环
    if (updateValue) {
      break;
    }
  }

  return updateValue;
};

// 二级特性修改
const secondSpecialDataUpdate = (newSecondArray: any, oldSecondArray: any,) => {
  debugger
  const children: any = [];
  const newIds: any = []; // 记录旧数据的id，拿来对比新数据用作删除，如果在新数据里找不到，则删除
  // 先添加新特性。记录新特性中的id，再对比旧特性，看看有没有新特性中不存在的id
  newSecondArray.forEach((v1: any) => {
    if (v1.id) {
      newIds.push(v1.id);
      children.push({
        id: v1.id,
        speciality: v1.first,
      });
    } else if (!isEmpty((v1.first).trim())) {
      // 没有ID的话就是新增的特性，同时也要判断是值是否为空
      children.push({
        speciality: v1.first,
        editFlag: "add",
      })
    }
  });

  // 记录需要被删除的ID
  const deletedId: any = [];
  oldSecondArray.forEach((v2: any) => {
    // 如果旧的ID没有再新的ID集合中，表示旧的ID是需要删除的
    if (v2.id && !newIds.includes(v2.id)) {
      deletedId.push(v2.id);
    }
  });

  // 将需要删除的id页保存进去
  deletedId.map((id: number) => {
    children.push({
      id: id,
      editFlag: "delete"
    });
  })
  return children;
};


const firstSpecialDataUpdate = (newCommonData: any, modifyPopData: any, oldCommonData: any, oldPopData: any) => {
  debugger;

  const pages: any = [];

  modifyPopData.forEach((v1: any) => {
    const v1_ptyGroup = v1.tabsContent?.ptyGroup;
    // 用于记录新特性中的id，再对比旧特性，看看有没有新特性中不存在的id，不存在的id应该删除
    const newIds: any = [];
    v1_ptyGroup.map((m: any) => {
      if (m.id) {
        newIds.push(m.id);
      }
    });

    let rootSpecialId = ""; // 拿取根节点（特性名称）ID
    const deletedId: any = [];    // 记录需要被删除的ID
    oldPopData.forEach((v2: any) => {
      if (v1.tabPage === v2.tabPage) {
        const v2_ptyGroup = v2.tabsContent?.ptyGroup;
        v2_ptyGroup.map((n: any, index: number) => {
          if (index === 0) { // 一级特性的父节点肯定是特性名称的根节点
            rootSpecialId = n.parentId;
          }

          // 如果旧的ID没有再新的ID集合中，表示旧的ID是需要删除的
          if (n.id && !newIds.includes(n.id)) {
            deletedId.push(n.id);
          }
        });
      }
    });

    // 用于记录特性数据
    const content: any = [];
    v1_ptyGroup.map((m: any) => {

      // 有id则为修改，没有id则为新增
      if (m.id) {
        // 寻找旧数据对应ID的二级特性数据
        let oldSecondLevel: any = [];
        oldPopData.forEach((b: any) => {
          if (v1.tabPage === b.tabPage) {
            const v2_ptyGroup = b.tabsContent?.ptyGroup;
            v2_ptyGroup.map((c: any) => {
              // 需要一级特性的id相等，才记录二级特性的数据
              if (m.id === c.id) {
                oldSecondLevel = c.seconds;
              }
            });
          }
        });

        let children = [];
        if (oldSecondLevel) {
          children = secondSpecialDataUpdate(m.seconds, oldSecondLevel);
        }
        content.push({
          id: m.id,
          speciality: m.first,
          children: children
        })
      } else {
        // 新增的一级特性（包含里面的二级特性）
        let child: any = [];
        (m.seconds).map((p: any) => {
          child.push({
            speciality: p.first,
            editFlag: "add",
          })
        })
        content.push({
          speciality: m.first,
          editFlag: "add",
          children: child
        })
      }
    });

    // 将需要删除的id页保存进去
    deletedId.map((id: number) => {
      content.push({
        id: id,
        editFlag: "delete"
      });
    })
    const {tabsContent} = v1;
    debugger
    pages.push({
      id: tabsContent.id,
      yuQue: tabsContent.yuQueUrl,
      image: tabsContent.uploadPic,
      pageNum: v1.tabPage,
      layoutTypeId: tabsContent.picLayout,
      contents: [{
        id: rootSpecialId,
        children: content
      }]
    })

  });

  return pages;
};

// 轮播页发生改变
const carousePageUpdate = (newCommonData: any, newPopData: any, oldCommonData: any, oldPopData: any) => {
  debugger
  let page: any = [];
  if (oldCommonData.carouselNum > newCommonData.carouselNum) {
    //  轮播页减少,删除最后几张的轮播页数(特性可能会被修改)

    let modifyPopData = []
    for (let i = 0; i < oldCommonData.carouselNum; i++) {
      const pageDt = newPopData[i].tabsContent;
      if (i > newCommonData.carouselNum - 1) {
        // 需要删除的page
        page.push({
          id: pageDt.id,
          editFlag: "delete",
        })
      } else {
        modifyPopData.push(newPopData[i]);
      }
    }

    if (modifyPopData.length > 0) {
      // 判断一级特性是否修改过:是否可以不进行改变判断，直接取获取数据
      // if (firstSpecialIsUpdate(newCommonData, modifyPopData, oldPopData)) {
      const specialItem = firstSpecialDataUpdate(newCommonData, modifyPopData, oldCommonData, oldPopData);

      page = page.concat(specialItem);
      // }
    }
    debugger;
    return {
      id: oldCommonData.id,
      pageSize: newCommonData.carouselNum,
      iteration: newCommonData.announce_name,
      updatedTime: dayjs(newCommonData.announce_time).format("YYYY-MM-DD hh:mm:ss"),
      description: newCommonData.announce_content,
      pages: page
    }

  } else if (oldCommonData.carouselNum < newCommonData.carouselNum) {
    // 新增轮播页
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
              speciality: v2.first,
              editFlag: "add"
            })
          }
        });
        content.push({
          speciality: v.first,
          editFlag: "add",
          children: secondLevel
        });
      });
      page.push({
        image: pageDt.uploadPic,
        pageNum: newPopData[i].tabPage,
        layoutTypeId: pageDt.picLayout,
        editFlag: "add",
        contents: [{
          speciality: pageDt.specialName,
          editFlag: "add",
          children: content
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


// 修改发布公告
export const updateAnnouncement = async (releaseID: string, newCommonData: any, newPopData: any) => {

  // 构造基础数据
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
  // 1 进行判断，首先判断模板类型和是否轮播选项有没有被改变。
  if (newCommonData.modules !== oldCommonData?.templateTypeId
    || newCommonData?.announce_carousel !== isCarsousel) {
    // 1.1 如果改变了，直接调用新增接口，需要把旧公告ID一并传到后端
    return await updateForModulesAndCarousel(newCommonData, newPopData, oldCommonData, oldPopData);
  }
  // 1.2 如果模板类型没有改变
  else if (newCommonData.modules === "1") {
    // 1.2.1 如果是消息模板，则直接调用常规修改接口
    const relData = normalUpdate({...newCommonData, releaseId: oldCommonData.id});
    return await updateApi(relData);

  } else {
    // 1.2.2 如果是弹窗模板，还要看其他修改方向
    let relData: any;
    const carouseNumState = carouseNumIsUpdate(newCommonData, oldCommonData);  // 轮播页数是否修改
    const firstLevelState = firstSpecialIsUpdate(newCommonData, newPopData, oldPopData); // 一级特性是否增加或者删除
    const secondLevelState = secondSpecialIsUpdate(newCommonData, newPopData, oldPopData); // 二级特性是否增加或者删除
    // 如果只是修改过轮播页数，一级特性和二级特性都没有被修改过
    if (carouseNumState || firstLevelState || secondLevelState) {
      relData = carousePageUpdate(newCommonData, newPopData, oldCommonData, oldPopData);
    } else {
      // 如果都没有被增加或者删除，则调用常规修改接口
      relData = normalUpdate(
        {...newCommonData, releaseId: oldCommonData.id},
        [...newPopData], [...oldPopData]);
    }
    debugger
    console.log(relData)
    return await updateApi(relData);
  }
};

