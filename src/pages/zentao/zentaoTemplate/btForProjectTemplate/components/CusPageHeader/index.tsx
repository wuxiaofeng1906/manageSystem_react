import React from "react";
import {Breadcrumb, PageHeader} from "antd";
import {Link} from "react-router-dom";

const Header: React.FC<any> = (props: any) => {

  const breadcrumbItems = [
    <Breadcrumb.Item key="禅道管理">禅道管理</Breadcrumb.Item>,
    <Breadcrumb.Item key="禅道管理Details">
      <Link to="/zentao/templateList">禅道管理</Link>
    </Breadcrumb.Item>,
    <Breadcrumb.Item key="禅道任务生成">禅道任务生成</Breadcrumb.Item>];

  return (
    <PageHeader
      ghost={false}
      title={<div>项目计划任务生成<label style={{fontSize: "medium",fontFamily:"黑体"}}>-{props.tempName}</label></div>}
      style={{height: "85px"}}
      breadcrumbRender={() => {
        return <Breadcrumb>{breadcrumbItems}</Breadcrumb>;
      }}
    />
  );
};

export default Header;
