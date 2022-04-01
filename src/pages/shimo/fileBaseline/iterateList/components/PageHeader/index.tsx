import React from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {Button} from 'antd';
import "./style.css";
import {errorMessage, infoMessage, sucMessage} from "@/publicMethods/showMessages";

const PageHeader: React.FC<any> = () => {

  // 列表验证重复
  const vertifyListRepeat = () => {
    sucMessage("验证成功！");
  };

  return (
    <PageContainer className={"containers"}
                   extra={[
                     <Button type="primary" className={"vertifyButton"}
                             onClick={vertifyListRepeat}>列表验重
                     </Button>
                   ]}/>
  );
}


export default PageHeader
