// 解析从语雀获取的数据，返回界面可以展示的格式
import {isEmpty} from "lodash";
import {customMessage} from "@/publicMethods/showMessages";
import {Tabs} from "antd";
import React from "react";

export const analysisSpecialTitle = (source: any) => {

  // const example = [{first: "一级标题", seconds: [{"second": "2324234"}, {"second": "dfdsfd"}, {"second": "22222"}]}]
  const result: any = [];
  source.map((v: any) => {
    const childs: any = [];
    const specialChild = v.children;
    if (specialChild && specialChild.length > 0) {
      specialChild.map((v2: any) => childs.push({"first": v2.speciality}));
    }

    result.push({
      first: v.speciality,
      seconds: childs
    });

  });
  return result;
}

// 验证表单字段不能为空（公共字段）
export const vertifyFieldForCommon = (formInfo: any) => {

  if (!formInfo.announce_name || isEmpty(formInfo.announce_name.trim())) {
    customMessage({type: "error", msg: "公告名称不能为空！", position: "0vh"});
    // errorMessage("公告名称不能为空！");
    return false;
  }

  if (!formInfo.announce_time) {
    customMessage({type: "error", msg: "升级时间不能为空！", position: "0vh"});
    // errorMessage("升级时间不能为空！");
    return false;
  }

  if (formInfo.announce_content && isEmpty(((formInfo.announce_content).split("更新升级")[1]).trim())) {
    customMessage({type: "error", msg: "请完善公告详情！", position: "0vh"});
    // errorMessage("请完善公告详情！");
    return false;
  }
  return true;
};

// 验证字段的必填项(弹窗界面)
export const vertifyFieldForPopup = (popDataArray: any) => {

  let value = true;
  for (let i = 0; i < popDataArray.length; i++) {
    let popData = popDataArray[i]; // 不可轮播的数据
    if (popDataArray[i].tabsContent) {
      popData = popDataArray[i].tabsContent;  // 可轮播的数据
    }
    let firstLevelEmpty = false;
    if (popData.ptyGroup && (popData.ptyGroup).length) {
      for (let i2 = 0; i2 < (popData.ptyGroup).length; i2++) {

        const v = (popData.ptyGroup)[i2];
        if (!v || !v.first) {
          firstLevelEmpty = true;
          customMessage({type: "error", msg: "一级特性不能为空！", position: "0vh"});

          // errorMessage("一级特性不能为空！");
          value = false;
          break;
        } else if (isEmpty((v.first).trim())) {
          firstLevelEmpty = true;
          customMessage({type: "error", msg: "一级特性不能为空！", position: "0vh"});
          // errorMessage("一级特性不能为空！");
          value = false;
          break
        }
      }
    } else {
      firstLevelEmpty = true
    }

    // 除了图文布局，其他只要有一个不为空，就需要判断图片是否为空
    if (popData.specialName || popData.yuQueUrl || !firstLevelEmpty) {
      if (!popData.uploadPic) {
        customMessage({type: "error", msg: "图片不能为空！", position: "0vh"});

        // errorMessage("图片不能为空！");
        value = false;
        break;
      }
    }
    if (!value) {
      break;
    }
  }
  return value;
};

// 判断所以的page是否填写完。
export const vertifyPageAllFinished = (tabPage: any) => {
  let notFinishedPage: any = [];
  if (tabPage && tabPage.length > 1) { // 只有1页就不用判断了
    tabPage.map((page: any) => {
      // 如果图片没有，表示本页就没数据
      const {uploadPic} = page.tabsContent;
      if (isEmpty((uploadPic))) {
        notFinishedPage.push(page.tabPage);
      }
    });
  }

  return notFinishedPage;
};

// 动态panes
export const tabsPanel = (count: number) => {
  const panes = [];
  for (let i = 1; i <= Number(count); i++) {
    panes.push(<Tabs.TabPane tab={<label style={{fontSize: "medium"}}> 第{i}张 </label>} key={i}
                             style={{fontWeight: "bold"}}/>);
  }
  return panes;
};

const parTree = (oraData: any) => {
  const parents = oraData.filter((value: any) => value.parentId === 'undefined' || value.parentId === undefined || value.parentId === null || value.parentId === "1");
  const children = oraData.filter((value: any) => value.parentId !== 'undefined' && value.parentId !== undefined && value.parentId != null && value.parentId != "1");
  const translator = (parentB: any, childrenB: any) => {
    parentB.forEach((parent: any) => {
      childrenB.forEach((child: any, index: any) => {
        if (child.parentId === parent.id) {
          const temp: any = JSON.parse(JSON.stringify(childrenB));
          temp.splice(index, 1);
          translator([child], temp);
          if (typeof (parent.children) !== 'undefined') {
            parent.children.push(child);
          } else {
            // eslint-disable-next-line no-param-reassign
            parent.children = [child];
          }
        }
      });
    });
  };

  translator(parents, children);
  return parents;
};


// 递归解析数据
// @specialName 特性名称，用于判断是否有哦parentid
//@isCarousel 是否轮播
const getSpecialData = (data: any, isCarousel: boolean, updateGet: boolean) => {

  let ptGroupData = parTree(data);
  // ，第一个特性需要去除掉，才是下面的子特性
  // if (isCarousel) {
  ptGroupData = ptGroupData[0].children;
  // }

  let finalPtGroup: any = [];
  if (ptGroupData) {
    ptGroupData.map((v: any) => {

      const child = v.children;
      const childGroup: any = [];
      if (child && child.length > 0) {
        child.map((m: any) => {

          childGroup.push({
            first: m.speciality,
            id: m.id,
            parentId: m.parentId,
          });
        });
      } else if (!updateGet) {
        // 如果是修改时查数据，就不添加空数据了，空数据只是为了前端展示时二级特性至少有一个。
        childGroup.push({
          first: "",
        });
      }

      finalPtGroup.push({
        first: v.speciality,
        id: v.id,
        parentId: v.parentId,
        seconds: childGroup
      })
    });
  }

  //   [{ //  格式
  //   first: "",
  //   seconds: [{"first": ""}]
  // }];

  return finalPtGroup;
};

// 获取特性树
const getSpecialList = (contents: any, isCarousel: boolean, updateGet: boolean) => {
  const contentData: any = {
    ptyGroup: [],
    specialName: ""
  };
  let oraSpecialList: any = []; // 去除最上面特性名称的特性数组
  contents.map((v: any) => {
    //判断对象中有没有包含parentId，如果没有，则这里面的speciality属性就属于界面最上面的特性名称
    if (!Object.keys(v).includes("parentId")) {
      contentData.specialName = v.speciality;
    } else {
      oraSpecialList.push(v);
    }
  });
  contentData.ptyGroup = getSpecialData(contents, isCarousel, updateGet);
  return contentData;
};
// 处理从服务器获取过来的弹窗数据放到state中(updateGet 在修改时的数据获取)
export const dealPopDataFromService = (NoticeEdition: any, updateGet: any = false) => {
  if (!NoticeEdition || NoticeEdition.length === 0 || !NoticeEdition[0]) {
    return [];
  }
  const {pages, isCarousel, templateTypeId, pageSize} = NoticeEdition[0];
  if (!pages || pages.length === 0) {
    return [];
  }

  const formData: any = [];
  // 如果是弹窗，又不是轮播。则有一个数据。
  if (templateTypeId === "2" && !isCarousel && pages) {
    const tempData = pages[0];
    let contentData: any = {};
    const {contents} = tempData;
    if (contents && contents.length) {
      contentData = getSpecialList(contents, isCarousel, updateGet);
    }
    formData.push({
      tabPage: tempData.pageNum,
      tabsContent: {
        id: tempData.id,
        picLayout: tempData.layoutTypeId,
        specialName: contentData.specialName, // 特性名称在content中，没有parentid的那一项
        uploadPic: tempData.image,
        yuQueUrl: tempData.yuQue,
        ptyGroup: contentData.ptyGroup
      }
    })
  } else {
    // pageSize 为几就有多少个tab，不能只看page 里面的数据条数
    for (let i = 0; i < pageSize; i++) {
      formData.push({
        tabPage: i + 1,
        tabsContent: {}
      })
    }

    formData.map((v1: any) => {
      pages.map((v: any) => {
        if (v1.tabPage === v.pageNum) {
          let contentData: any = {};
          const {contents} = v;
          if (contents && contents.length) {
            contentData = getSpecialList(contents, isCarousel, updateGet);
          }
          // 如果是非轮播，tabpage =0
          v1.tabsContent = {
            id: v.id,
            picLayout: v.layoutTypeId,
            specialName: contentData.specialName, // 特性名称在content中，没有parentid的那一项
            uploadPic: v.image,
            yuQueUrl: v.yuQue,
            ptyGroup: contentData.ptyGroup
          };
        }
      });
    });
  }


  return formData;
};

// 修改tab保存时候的顺序
export const changeTabSort = (commonData: any, oraPopData: any, order: any) => {
  // 如果不是轮播的话
  if (order.length === 0 && commonData?.announce_carousel === 0) {
    return [{
      tabPage: 0,
      oldPage: 0,
      tabsContent: oraPopData
    }]
  }
  const sortedData: any = [];

  oraPopData.forEach((v: any) => {
    let currentPage = v.tabPage;
    if (order && order.length) {
      order.forEach((key: string, index: number) => {
        if ((v.tabPage).toString() === key) {
          currentPage = index + 1;
        }
      });
    }

    // 保存的时候，tabPage 用于传给后端，oldPage 用于对比数据
    sortedData.push({
      tabPage: currentPage,
      oldPage: v.tabPage,
      tabsContent: v.tabsContent
    })

  });

  // order.forEach((key: string, index: number) => {
  //   oraPopData.forEach((v: any) => {
  //     if ((v.tabPage).toString() === key) {
  //       sortedData.push({
  //         tabPage: index + 1,
  //         oldPage: key,
  //         tabsContent: v.tabsContent
  //       })
  //     }
  //   });
  //
  // });

  return sortedData;
};

// 判断是否界面有填写数据
const isPageImpty = (specialList: any) => {
  // 除了图文布局，有一个不为空，则都返回fasle，都要将页面数据保留
  // 特性名称不为空
  if (specialList.specialName && !isEmpty(specialList.specialName)) {
    return false;
  }
  // 图片不为空
  if (!isEmpty(specialList.uploadPic)) {
    return false;
  }
  // 一级二级特性
  const {ptyGroup} = specialList;
  if (ptyGroup && ptyGroup.length > 0) {
    for (let i = 0; i < ptyGroup.length; i++) {
      let flag = true;
      const specilaList = ptyGroup[i];
      if (specilaList.first && !isEmpty((specilaList.first).trim())) {
        flag = false;
      }

      const secondList = specilaList.seconds;
      //  二级特性不是必填，所以
      for (let m = 0; m < secondList.length; m++) {
        if (secondList[m].first && !isEmpty((secondList[m].first).trim())) {
          flag = false;
          break;
        }
      }

      // 一级特性和二级特性有一个不为空都要保留演示数据
      if (!flag) {
        return false;
      }
    }
  }

  return true
}


// 切换tab后的数据
export const getChanedData = (currentKey: number, commonData: any, anPopData: any, specialList: any) => {

  // 覆盖已有当前页的数据或者添加新数据
  const oldList = [...anPopData];
  // 构造新增的tab数据框架
  if (Number(commonData?.carouselNum) > oldList.length) {
    for (let i = oldList.length; i < Number(commonData?.carouselNum); i++) {
      oldList.push({
        tabPage: i + 1,
        tabsContent: {}
      })
    }
  }
  const result: any = [];
  oldList.map((v: any) => {
    // page 相等，并且里面的内容不为空
    if (v.tabPage === currentKey && !isPageImpty(specialList)) {
      result.push({
        ...v,
        tabsContent: {...specialList, id: v.tabsContent.id}
      });
    } else {
      result.push(v);
    }
  });

  return result;
};
