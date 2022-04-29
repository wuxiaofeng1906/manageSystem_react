import React from "react";
import {Breadcrumb, PageHeader} from "antd";

const Header: React.FC<any> = () => {

  const breadcrumbItems = [
    <Breadcrumb.Item key="禅道管理">禅道管理</Breadcrumb.Item>,
    <Breadcrumb.Item key="禅道任务分解">禅道任务分解</Breadcrumb.Item>];

  return (
    <PageHeader
      ghost={false}
      title={<div>禅道任务分解</div>}
      style={{height: "65px", marginTop: -30}}
      breadcrumbRender={() => {
        return <Breadcrumb style={{height: 10}}>{breadcrumbItems}</Breadcrumb>;
      }}
    />
  );
};


export default Header;
