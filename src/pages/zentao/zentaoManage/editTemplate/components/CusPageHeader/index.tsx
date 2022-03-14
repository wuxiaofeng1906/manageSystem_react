import React from "react";
import {Breadcrumb, PageHeader} from "antd";
import {Link} from "react-router-dom";

const Header: React.FC<any> = () => {

  const breadcrumbItems = [
    <Breadcrumb.Item key="禅道管理">禅道管理</Breadcrumb.Item>,
    <Breadcrumb.Item key="禅道管理Details">
      <Link to="/zentao/templateList">禅道管理</Link>
    </Breadcrumb.Item>,
    <Breadcrumb.Item key="禅道任务模板">禅道任务模板</Breadcrumb.Item>];

  return (
    <PageHeader
      ghost={false}
      title={"禅道任务模板"}
      style={{height: "85px"}}
      breadcrumbRender={() => {
        return <Breadcrumb>{breadcrumbItems}</Breadcrumb>;
      }}
    />
  );
};

export default Header;
