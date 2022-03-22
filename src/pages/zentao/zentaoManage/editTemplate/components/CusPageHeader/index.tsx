import React from "react";
import {Breadcrumb, PageHeader} from "antd";
import {Link} from "react-router-dom";

const Header: React.FC<any> = (props: any) => {

  const breadcrumbItems = [
    <Breadcrumb.Item key="禅道管理">禅道管理</Breadcrumb.Item>,
    <Breadcrumb.Item key="禅道管理Details">
      <Link to="/zentao/templateList">禅道管理</Link>
    </Breadcrumb.Item>,
    <Breadcrumb.Item key="禅道任务模板">禅道任务模板</Breadcrumb.Item>];

  let titles = "禅道任务模板（新增）";
  if (props.templateInfo && props.templateInfo.id) {
    titles = `${props.templateInfo.name}（修改）`;
  }
  return (
    <PageHeader
      ghost={false}
      title={titles}
      style={{height: "85px"}}
      breadcrumbRender={() => {
        return <Breadcrumb>{breadcrumbItems}</Breadcrumb>;
      }}
    />
  );
};

export default Header;
