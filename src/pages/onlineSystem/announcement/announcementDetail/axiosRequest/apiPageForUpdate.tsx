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

// 根据获取旧的数据
const getOldNoticeDetails = async (releaseID: string) => {
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
    oldPopData = await dealPopDataFromService(dts.NoticeEdition, true);
    //   如果有排序则需要对新的顺序进行排列
  }

  return {oldCommonData, oldPopData};
};

// region 常规的修改
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
  // 相当于只有一个轮播页面
  const {ptyGroup, uploadPic, picLayout, yuQueUrl} = popupData.tabsContent[0];
  const data = {
    pages: [
      {
        id: oldPopData[0].tabsContent.id, // 非轮播的page id在界面拿不到。
        image: uploadPic,
        pageNum: 0, // 所属轮播页码
        layoutTypeId: picLayout,
        yuQue: yuQueUrl,
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
const normalUpdate = (formData: any, popupData: any = [], oldPopData: any = []) => {

  const data: any = {
    id: formData.releaseId,
    iteration: formData.announce_name, // 公告名称：默认带入当前时间，可修改，必填(string)
    // templateTypeId: formData.modules, //  修改的话不传模板id
    updatedTime: dayjs(formData.announce_time).subtract(8, 'h').format('YYYY-MM-DD HH:mm'), // 升级时间：手动选择时间，必填
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

//  endregion

//  region 修改时候调用的新增（比如修改模板类型，是否轮播）
const getSpecialListForAdd = (ptyGroup: any) => {
  debugger
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
const notCarouselDataForAdd = (details: any) => {
  debugger
  // 相当于只有一个轮播页面
  const popupData = details?.tabsContent[0];
  const data = {
    pages: [
      {
        image: popupData.uploadPic,
        pageNum: 0, // 所属轮播页码
        layoutTypeId: popupData.picLayout,
        yuQue: popupData.yuQueUrl,
        contents: getSpecialListForAdd(popupData?.ptyGroup)
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
const updateAnnounceContentForAdd = async (formData: any, popupData: object = {}) => {
  debugger
  const data: any = {
    iteration: formData.announce_name, // 公告名称：默认带入当前时间，可修改，必填(string)
    templateTypeId: formData.modules, // 通知模板：1.消息卡片，2.弹窗
    updatedTime: dayjs(formData.announce_time).subtract(8, 'h').format('YYYY-MM-DD HH:mm'), // 升级时间：手动选择时间，必填
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
  debugger
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

// region 新增、修改特性等

//判断特性名称是否被改过(特性名称跟下面的一级特性是同一类型，是一级特性的上一层)
const specialNameIsUpdate = (newCommonData: any, newPopData: any, oldPopData: any) => {


  // 是否轮播(不轮播的话就没有最上层的特性名称)
  if (newCommonData.announce_carousel === 0) {
    return false
  }
  let state = false;

  try {
    const pageCount = newPopData.length > oldPopData.length ? newPopData.length : oldPopData.length;
    for (let i = 0; i < pageCount; i++) {
      const newContent = newPopData[i]?.tabsContent;
      const oldContent = oldPopData[i]?.tabsContent;

      if (newContent?.specialName !== oldContent?.specialName) {
        state = true;
        break;
      }
    }
  } catch (e) {
    console.log("特性判断错误：", e)
  }
  return state;
};

// 判断轮播页数量是否被修改
const carouseNumIsUpdate = (newCommonData: any, oldCommonData: any) => {
  // 轮播页数：是否被修改过
  if (newCommonData.carouselNum !== oldCommonData.carouselNum) {
    return true;
  }
  return false;
};

// 判断一级特性是否被修改
const firstSpecialIsUpdate = (newCommonData: any, newPopData: any, oldPopData: any) => {
  let {carouselNum} = newCommonData;
  // 轮播页数至少是1个，不是轮播也有一页特性
  if (newCommonData.announce_carousel === 0) {
    carouselNum = 1;
  }
  let updateValue = false;
  for (let i = 0; i < carouselNum; i++) {
    // 默认是不轮播的数据（即第一条数据）
    let newPopTemp: any = newPopData[0];
    let oldPopTemp: any = oldPopData[0];

    //  是轮播
    if (newCommonData.announce_carousel === 1) {
      // 查找对应的page数据
      newPopData.map((v: any) => {
        if (v.oldPage === i + 1) {
          newPopTemp = v;
        }
      });

      oldPopData.map((v: any) => {
        if (v.tabPage === i + 1) {
          oldPopTemp = v;
        }
      });
    }


    const oldPtGroup = oldPopTemp.tabsContent?.ptyGroup;
    // 默认是轮播的数据
    let newPtGroup = newPopTemp.tabsContent?.ptyGroup;
    // 如果不是轮播
    if (!newPopTemp.tabPage) {
      newPtGroup = newPopTemp.tabsContent[0]?.ptyGroup;
    }

    if (newPtGroup && oldPtGroup) {
      if (newPtGroup.length !== oldPtGroup.length) { // 如果一级特性个数不同，也不同
        updateValue = true;
        break
      }
    } else {
      updateValue = true;
      break;
    }
  }

  return updateValue;
};

// 判断二级特性是否被修改
const secondSpecialIsUpdate = (newCommonData: any, newPopData: any, oldPopData: any) => {
  // 如果是轮播，那么轮播页数就是所填写的数量，如果不是轮播，则只有一页
  const carouselNum = newCommonData.announce_carousel === 0 ? 1 : newCommonData.carouselNum;
  let updateValue = false;

  for (let i = 0; i < carouselNum; i++) {

    // 默认是不轮播的数据（即第一条数据）
    let newPopTemp: any = newPopData[0];
    let oldPopTemp: any = oldPopData[0];

    //  是轮播
    if (newCommonData.announce_carousel === 1) {
      // 查找对应的page数据
      newPopData.map((v: any) => {
        if (v.oldPage === i + 1) {
          newPopTemp = v;
        }
      });

      oldPopData.map((v: any) => {
        if (v.tabPage === i + 1) {
          oldPopTemp = v;
        }
      });
    }

    // 如果是轮播的数据
    let newPtGroup = newPopTemp.tabsContent?.ptyGroup;
    const oldPtGroup = oldPopTemp.tabsContent?.ptyGroup;
    // 如果不是轮播  ,轮播页数至少是1个，不轮播也有一页特性
    if (!newPopTemp.tabPage) {
      newPtGroup = newPopTemp.tabsContent[0]?.ptyGroup;
    }

    if (newPtGroup === undefined && oldPtGroup === undefined) {
      continue;
    }
    if (JSON.stringify(newPtGroup) !== JSON.stringify(oldPtGroup)) {
      updateValue = true;
      break
    }

    // 下面这个可能有用到，可能没有被用到，因为上一个判断大部分都能判断出来
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
  const children: any = [];
  const newIds: any = []; // 记录旧数据的id，拿来对比新数据用作删除，如果在新数据里找不到，则删除
  // 先添加新特性。记录新特性中的id，再对比旧特性，看看有没有新特性中不存在的id
  if (newSecondArray && newSecondArray.length) {
    newSecondArray.forEach((v1: any) => {
      if (v1.id) {
        newIds.push(v1.id);
        children.push({
          id: v1.id,
          speciality: v1.first,
        });
      } else if (v1.first && !isEmpty((v1.first).trim())) {
        // 没有ID的话就是新增的特性，同时也要判断是值是否为空
        children.push({
          speciality: v1.first,
          editFlag: "add",
        })
      }
    });
  }


  // 记录需要被删除的数据
  if (oldSecondArray && oldSecondArray.length) {
    oldSecondArray.forEach((v2: any) => {
      // 如果旧的ID没有再新的ID集合中，表示旧的ID是需要删除的
      if (v2.id && !newIds.includes(v2.id)) {
        children.push({
          id: v2.id,
          editFlag: "delete"
        });
      }
    });
  }

  // const deletedId: any = [];
  // 将需要删除的id页保存进去
  // deletedId.map((id: number) => {
  //   children.push({
  //     id: id,
  //     editFlag: "delete"
  //   });
  // })
  return children;
};

// 当删除一级特性后，所对应的二级特性也要删除
const deleteSeconds = (firstLevelId: string, oldPopData: any) => {
  let children: any = [];
  oldPopData.forEach((v2: any) => {
    const v2_ptyGroup = v2.tabsContent?.ptyGroup;
    if (v2_ptyGroup) {
      v2_ptyGroup.map((n: any) => {
        // 对应的一级特性数据
        if (n.id === firstLevelId) {
          (n.seconds).map((v: any) => {
            children.push({
              id: v.id,
              editFlag: "delete"
            })
          })
        }
      });
    }
  });
  return children;
};

// 一级特性修改
const firstSpecialDataUpdate = (newCommonData: any, modifyPopData: any, oldCommonData: any, oldPopData: any) => {
  const pages: any = [];
  modifyPopData.forEach((v1: any) => {
    const v1_ptyGroup = v1?.tabsContent?.ptyGroup;
    // 用于记录新特性中的id，再对比旧特性，看看有没有新特性中不存在的id，不存在的id应该删除
    const newIds: any = [];
    if (v1_ptyGroup && v1_ptyGroup.length) {
      v1_ptyGroup.map((m: any) => {
        if (m.id) {
          newIds.push(m.id);
        }
      });
    }

    let rootSpecialId = ""; // 拿取根节点（特性名称）ID
    const deletedId: any = [];    // 记录需要被删除的ID
    oldPopData.forEach((v2: any) => {
      if (v1.oldPage === v2.tabPage) {
        const v2_ptyGroup = v2.tabsContent?.ptyGroup;
        if (v2_ptyGroup && v2_ptyGroup.length) {
          v2_ptyGroup.map((n: any, index: number) => {
            if (index === 0) { // 如果是轮播，一级特性的父节点肯定是特性名称的根节点
              rootSpecialId = n.parentId;
            }

            // 如果旧的ID没有在新的ID集合中，表示旧的ID是需要删除的
            if (!newIds.includes(n.id)) {
              deletedId.push(n.id);
            }
          });
        }

      }
    });

    // 用于记录特性数据
    const content: any = [];

    if (v1.tabsContent && v1_ptyGroup && v1_ptyGroup.length) {
      v1_ptyGroup.map((m: any) => {

        // 有id则为修改，没有id则为新增
        if (m.id) {
          // 寻找旧数据对应ID的二级特性数据
          let oldSecondLevel: any = [];
          oldPopData.forEach((b: any) => {
            if (v1.oldPage === b.tabPage) {
              const v2_ptyGroup = b.tabsContent?.ptyGroup;
              if (v2_ptyGroup) {
                v2_ptyGroup.map((c: any) => {
                  // 需要一级特性的id相等，才记录二级特性的数据
                  if (m.id === c.id) {
                    oldSecondLevel = c.seconds;
                  }
                });
              }

            }
          });

          if (m.first) {
            content.push({
              id: m.id,
              speciality: m.first,
              children: secondSpecialDataUpdate(m.seconds, oldSecondLevel) // 获取二级数据
            });
          }
        } else { // 新增的一级特性（包含里面的二级特性）

          // 二级特性数据
          let childs: any = [];
          (m.seconds).map((p: any) => {
            if (p.first) {
              childs.push({
                speciality: p.first,
                editFlag: "add",
              });
            }
          });

          if (m.first) {
            // 一级特性
            content.push({
              speciality: m.first,
              editFlag: "add",
              children: childs
            });
          }

        }
      });
    }

    // 将需要删除的id页保存进去
    deletedId.map((id: string) => {
      content.push({
        id: id,
        editFlag: "delete",
        children: deleteSeconds(id, oldPopData)
      });
    })
    const {tabsContent} = v1;

    // 最上面的特性名称，有id则为修改，没有id则要添加add 属性
    let specialItem = [];
    if (rootSpecialId) {
      specialItem.push({
        id: rootSpecialId,
        speciality: tabsContent.specialName,
        children: content
      })

    } else if (content.length) {
      specialItem.push({
        editFlag: "add",
        speciality: tabsContent.specialName,
        children: content
      })
    }
    //  有特性才会保存
    if (specialItem.length) {
      pages.push({
        id: tabsContent.id,
        yuQue: tabsContent.yuQueUrl,
        image: tabsContent.uploadPic,
        pageNum: v1.tabPage,
        layoutTypeId: tabsContent.picLayout,
        contents: specialItem
      });
    }
  });

  return pages;
};

// 新增轮播页
const addCarousePage = (oldCommonData: any, newCommonData: any, newPopData: any) => {

  // 新增轮播页
  let page: any = [];
  //  拿最后新增的
  for (let i = 0; i < newPopData.length; i++) {

    const pageDt = newPopData[i].tabsContent;
    const content: any = [];
    if (pageDt.ptyGroup) {
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
  }
  return page;
}

// 其他数据发生改变
const otherInfoUpdate = (newCommonData: any, newPopData: any, oldCommonData: any, oldPopData: any) => {
  let page: any = [];
  //  轮播页减少,1.删除最后几张的轮播页数(特性可能会被修改) 2.删除所有的页面重建
  if (newCommonData.clearTabContent) {
    // 清空重建旧数据全部用delete，新数据全部用add
    // 需要删除的page
    oldPopData.map((v: any) => {
      if (v.tabsContent?.id) {
        page.push({
          id: v.tabsContent?.id,
          editFlag: "delete",
        });
      }
    });

    //这个是新增的数据
    page = page.concat(addCarousePage(oldCommonData, newCommonData, newPopData));
  } else {
    let modifyPopData = [];
    // 轮播的时候轮播页数才>0
    if (newCommonData.announce_carousel === 1) {
      let finalCarouselNum = newCommonData.carouselNum;
      // 判断减少了页数还是增加了页数(最终页数取最多的)
      if (oldCommonData.carouselNum > newCommonData.carouselNum) {
        //   减少了页数
        finalCarouselNum = oldCommonData.carouselNum
      }
      for (let i = 0; i < finalCarouselNum; i++) {
        const pageDt = newPopData[i]?.tabsContent;
        if (i > newCommonData.carouselNum - 1 && pageDt?.id) {
          // 需要删除的page
          page.push({
            id: pageDt.id,
            editFlag: "delete",
          });
        } else if (newPopData[i]) {
          modifyPopData.push(newPopData[i]);
        }
      }
    } else {
      const tabsData = {...newPopData[0].tabsContent};
      // 不轮播时候构建相同的数据结构
      modifyPopData.push({
        tabPage: 0,
        oldPage: 0,
        tabsContent: {...tabsData[0], id: oldPopData[0].tabsContent.id}
      });
    }

    if (modifyPopData.length > 0) {
      const specialItem = firstSpecialDataUpdate(newCommonData, modifyPopData, oldCommonData, oldPopData);
      page = page.concat(specialItem);
    }
  }
  return {
    id: oldCommonData.id,
    pageSize: newCommonData.carouselNum,
    iteration: newCommonData.announce_name,
    updatedTime: dayjs(newCommonData.announce_time).subtract(8, 'h').format("YYYY-MM-DD hh:mm"),
    description: newCommonData.announce_content,
    pages: page
  }
};

// endregion

// 修改发布公告
export const updateAnnouncement = async (releaseID: string, newCommonData: any, newPopData: any) => {

  debugger
  // 构造基础数据
  const {oldCommonData, oldPopData} = await getOldNoticeDetails(releaseID);
  // 是否轮播
  const isCarsousel = oldCommonData?.isCarousel ? 1 : 0;

  try {
    // 1 进行判断，首先判断模板类型和是否轮播选项有没有被改变。
    if (newCommonData.modules !== oldCommonData?.templateTypeId
      || newCommonData?.announce_carousel !== isCarsousel) {
      debugger
      // 1.1 如果改变了，直接调用新增接口，需要把旧公告ID一并传到后端
      return await updateForModulesAndCarousel(newCommonData, newPopData, oldCommonData, oldPopData);
    } else if (newCommonData.modules === "1") {  // 1.2 如果模板类型没有改变、
      debugger
      // 1.2.1 如果是消息模板，则直接调用常规修改接口
      const relData = normalUpdate({...newCommonData, releaseId: oldCommonData.id});
      return await updateApi(relData);

    } else {
      debugger
      // 1.2.2 如果是弹窗模板，还要看其他修改方向
      let relData: any;
      const specialNameState = specialNameIsUpdate(newCommonData, newPopData, oldPopData);
      const carouseNumState = carouseNumIsUpdate(newCommonData, oldCommonData);  // 轮播页数是否修改
      const firstLevelState = firstSpecialIsUpdate(newCommonData, newPopData, oldPopData); // 一级特性是否增加或者删除
      const secondLevelState = secondSpecialIsUpdate(newCommonData, newPopData, oldPopData); // 二级特性是否增加或者删除
      //  轮播页数，一级特性和二级特性被修改过
      if (carouseNumState || firstLevelState || secondLevelState || specialNameState) {
        relData = otherInfoUpdate(newCommonData, newPopData, oldCommonData, oldPopData);
      } else {
        // 如果都没有被增加或者删除，则调用常规修改接口
        relData = normalUpdate(
          {...newCommonData, releaseId: oldCommonData.id},
          [...newPopData], [...oldPopData]);
      }
      return await updateApi(relData);
      // return {ok: false}

    }
  } catch (e: any) {
    return {
      ok: false,
      message: e.toString(),
    }
  }

};

