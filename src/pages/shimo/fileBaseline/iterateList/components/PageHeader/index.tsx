import React from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {Button} from 'antd';

const PageHeader: React.FC<any> = () => {

  // 列表验证重复
  const vertifyListRepeat=()=>{

  };

  return (
    <PageContainer
      extra={[
        <Button type="primary"
                style={{
                  float: "right", color: '#46A0FC',
                  backgroundColor: "#ECF5FF", borderRadius: 5, marginLeft: 20
                }}
        onClick={vertifyListRepeat}>列表验重
        </Button>
      ]}
    />
  );
}


export default PageHeader
