import React from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {Button} from 'antd';

const PageHeader: React.FC<any> = () => {


  return (
    <PageContainer
      extra={[
        <Button type="primary"
                style={{
                  float: "right", color: '#46A0FC',
                  backgroundColor: "#ECF5FF", borderRadius: 5, marginLeft: 20
                }}>点击生成
        </Button>
      ]}
    />
  );
}


export default PageHeader
