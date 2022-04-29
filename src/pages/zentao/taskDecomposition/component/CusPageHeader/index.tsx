import React from "react";
import {Breadcrumb, PageHeader} from "antd";

const Header: React.FC<any> = () => {

  const breadcrumbItems = [
    <Breadcrumb.Item key="禅道管理">禅道管理</Breadcrumb.Item>,
    <Breadcrumb.Item key="禅道任务分解">禅道任务分解</Breadcrumb.Item>];

  return (
    <PageHeader
      ghost={false}
      title={"禅道任务分解"}
      style={{height: "85px", marginTop: -30}}
      breadcrumbRender={() => {
        return <Breadcrumb>{breadcrumbItems}</Breadcrumb>;
      }}
    />
  );
};

export default Header;
