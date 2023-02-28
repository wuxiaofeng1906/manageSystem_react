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
      specialChild.map((v2: any) => childs.push({"second": v2.speciality}));
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
