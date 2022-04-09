import React from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {Button} from 'antd';
import {vertifyButton} from "./style.css";
import "./style.css";
import {sucMessage} from "@/publicMethods/showMessages";
import {CopyOutlined} from '@ant-design/icons';
import {useModel} from "@@/plugin-model/useModel";

const PageHeader: React.FC<any> = () => {

  const {listData, setRepeatId} = useModel("iterateList.index");
  // 验证数据有无重复
  const isRepeat = (arr: any) => {
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

    //  利用石墨ID渲染行的颜色
    setRepeatId(repeatData);

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
