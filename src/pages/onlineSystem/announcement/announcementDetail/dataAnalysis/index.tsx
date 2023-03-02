// 解析从语雀获取的数据，返回界面可以展示的格式
import {isEmpty} from "lodash";
import {errorMessage} from "@/publicMethods/showMessages";
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
  if (isEmpty(formInfo.announce_name.trim())) {
    errorMessage("公告名称不能为空！");
    return false;
  }
  if (formInfo.announce_content && isEmpty(((formInfo.announce_content).split("更新功能：")[1]).trim())) {
    errorMessage("请完善公告详情！");
    return false;
  }
  return true;
};


// 验证字段的必填项(弹窗界面)
export const vertifyFieldForPopup = (popDataArray: any) => {
  popDataArray.map((popData: any) => {
    if (!popData.uploadPic) {
      errorMessage("图片不能为空！");
      return false;
    }
    (popData.ptyGroup).map((v: any) => {
      if (isEmpty((v.first).trim())) {
        errorMessage("一级特性不能为空！");
        return false;
      }
      return true;
    });
    return true;
  });
  return true;
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


const getchilds = (id: any, array: any) => {
  debugger
  const childs = []
  for (const arr of array) {  // 循环获取子节点
    if (arr.parentId === id) {
      childs.push({
        'id': arr.id,
        'first': arr.speciality
      })
    }
  }

  for (const child of childs) { // 获取子节点的子节点
    const childscopy = getchilds(child.id, array)// 递归获取子节点
    if (childscopy.length > 0) {
      child.seconds = childscopy
    }
  }
  return childs
}


// 递归解析数据
// @specialName 特性名称，用于判断是否有哦parentid
const getSpecialData = (data: any, specialName: string) => {
  //   [{ //  格式
  //   first: "",
  //   seconds: [{"first": ""}]
  // }];
  // 调用方法， temp为原始数据, result为树形结构数据
  var result = []
  for (const param of data) {
    if (param.parentId === undefined) {  // 判断是否为顶层节点
      var parent = {
        'id': param.id,
        'speciality': param.speciality
      }
      parent.seconds = getchilds(param.id, data)  // 获取子节点
      result.push(parent)
    }

  }
 // result[0].seconds
  return []

};

// 获取特性树
const getSpecialListTree = (contents: any) => {
  debugger
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
  contentData.ptyGroup = getSpecialData(contents, contentData.specialName);
  return contentData;
};
// 处理从服务器获取过来的弹窗数据放到state中
export const dealPopDataFromService = (NoticeEdition: any) => {
  debugger
  if (!NoticeEdition || NoticeEdition.length === 0 || !NoticeEdition[0]) {
    return [];
  }
  const {pages} = NoticeEdition[0];
  if (!pages || pages.length === 0) {
    return [];
  }
  const formData: any = [];
  pages.map((v: any) => {
    let contentData: any = {};
    const {contents} = v;
    if (contents && contents.length) {
      contentData = getSpecialListTree(contents);
    }

    formData.push({
      tabPage: v.pageNum,
      tabsContent: {
        picLayout: v.layoutTypeId,
        specialName: contentData.specialName, // 没有看到特性
        uploadPic: v.image,
        yuQueUrl: v.yuQue,
        ptyGroup: contentData.ptyGroup
      }
    });
  });
  debugger;
  return formData;
};
