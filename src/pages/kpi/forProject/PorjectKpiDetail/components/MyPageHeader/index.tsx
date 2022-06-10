import React from 'react';
import {Breadcrumb, PageHeader,} from 'antd';
import {Link} from "react-router-dom";
import "./indexStyle.css";

const MyPageHeader: React.FC<any> = (currentProject: any) => {

  const breadcrumbItems = [
    <Breadcrumb.Item key="研发过程数据">研发过程数据</Breadcrumb.Item>,
    <Breadcrumb.Item key="研发过程数据">度量指标</Breadcrumb.Item>,
    <Breadcrumb.Item key="项目">
      <Link to="/kpi/performance/project/overview">项目</Link>
    </Breadcrumb.Item>,
    <Breadcrumb.Item key="项目指标">项目指标</Breadcrumb.Item>];

  return (
    <PageHeader
      className="pageHeader"
      ghost={false}
      title={currentProject.name}
      breadcrumbRender={() => {
        return <Breadcrumb>{breadcrumbItems}</Breadcrumb>;
      }}
    />
  );
};

export default MyPageHeader;
