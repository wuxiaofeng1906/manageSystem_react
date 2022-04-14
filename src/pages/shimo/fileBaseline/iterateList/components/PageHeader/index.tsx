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
    const judgeArray: any = [];
    // 单独拿出需要判断的字段
    arr.forEach((ele: any) => {
      judgeArray.push({
        shimoId: ele.shimo_id,
        datas: [ele.execution_id, ele.execution_head_name, ele.head_depart, ele.execution_status, ele.execution_sqa,
          ele.demand_directory_guid, ele.demand_status, ele.design_directory_guid, ele.design_status]
      });
    });

    const repeatArray = [];
    for (let index1 = 0; index1 < judgeArray.length; index1 += 1) {
      const firstData = judgeArray[index1];
      for (let index2 = index1 + 1; index2 < judgeArray.length; index2 += 1) {
        const secondData = judgeArray[index2];
        if (JSON.stringify(firstData.datas) === JSON.stringify(secondData.datas)) {
          repeatArray.push(firstData.shimoId);
          repeatArray.push(secondData.shimoId)
        }
      }
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

  // 只有管理员才能操作按钮
  let showOperate = true;
  if ((JSON.parse(localStorage.getItem('userLogins') as string)).group === "superGroup") {
    showOperate = true;
  }

  return (
    <PageContainer className="myContainers"
                   extra={[
                     <Button icon={<CopyOutlined/>} className={vertifyButton} size={"small"}
                             disabled={showOperate}
                             onClick={vertifyListRepeat}>列表验重</Button>
                   ]}/>
  );
}


export default PageHeader
