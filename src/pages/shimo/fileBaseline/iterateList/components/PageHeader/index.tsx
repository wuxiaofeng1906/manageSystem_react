import React from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {Button} from 'antd';
import {vertifyButton} from "./style.css";
import "./style.css";
import {sucMessage} from "@/publicMethods/showMessages";
import {CopyOutlined} from '@ant-design/icons';
import {useModel} from "@@/plugin-model/useModel";

const PageHeader: React.FC<any> = () => {

  const {listData, setListData} = useModel("iterateList.index");
  // 验证数据有无重复
  const isRepeat = (arr: any) => {
    debugger;
    const repeatArray = [];
    const hash = {}
    for (const i in arr) {
      if (hash[arr[i]]) {
        repeatArray.push(arr[i].shimo_id);
      }
      hash[arr[i]] = true
    }
    return repeatArray
  }


  // 列表验证重复
  const vertifyListRepeat = () => {
    const oraData = [...listData];
    const repeatData: any = isRepeat(oraData);
    if (repeatData.length === 0) {
      sucMessage("验证完毕：无重复数据！");
    }

    //  利用石墨ID渲染行的颜色,将需要渲染的行加入颜色字段
    const new_array: any = [];
    oraData.forEach((ele: any) => {
      const new_row = {...ele};
      const {shimo_id} = ele;
      if (repeatData.indexOf(shimo_id) > -1) {
        new_row["repeat"] = true;
      }
      new_array.push(new_row);
    });

    setListData(new_array);
  };

  return (
    <PageContainer className="myContainers"
                   extra={[
                     <Button icon={<CopyOutlined/>} className={vertifyButton} size={"small"}
                             onClick={vertifyListRepeat}>列表验重</Button>
                   ]}/>
  );
}


export default PageHeader
