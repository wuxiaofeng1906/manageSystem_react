import React from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {Button} from 'antd';
import {myContainers, vertifyButton} from "./style.css";
import {errorMessage, infoMessage, sucMessage} from "@/publicMethods/showMessages";
import {CopyOutlined} from '@ant-design/icons';
import {useModel} from "@@/plugin-model/useModel";

const PageHeader: React.FC<any> = () => {

  const {listData} = useModel("iterateList.index");


  // 列表验证重复
  const vertifyListRepeat = () => {
    sucMessage("验证成功！");
  };

  return (
    <PageContainer className={myContainers}
                   extra={[
                     <Button icon={<CopyOutlined/>} className={vertifyButton} size={"small"}
                             onClick={vertifyListRepeat}>列表验重</Button>
                   ]}/>
  );
}


export default PageHeader
