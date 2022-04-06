import React from "react";
import {Breadcrumb, PageHeader} from "antd";
import {Link} from "react-router-dom";
import {pageHeader} from "./style.css";
import {useModel} from "@@/plugin-model/useModel";

const Header: React.FC<any> = (props: any) => {
  const {tabsInfo} = useModel("iterateList.index");
  //  点击需求基线，title就显示  需求基线/迭代名称
  //  点击概设基线，title就显示  概设基线/迭代名称

  const pageTitle = `${tabsInfo.activeKey}/迭代名称`;

  const breadcrumbItems = [
    <Breadcrumb.Item key="石墨管理">石墨管理</Breadcrumb.Item>,
    <Breadcrumb.Item key="文档基线">文档基线</Breadcrumb.Item>,
    <Breadcrumb.Item key="迭代列表">
      <Link to="/shimo/fileBaseline/iterateList">迭代列表</Link>
    </Breadcrumb.Item>,
    <Breadcrumb.Item key="迭代基线详情">迭代基线详情</Breadcrumb.Item>];

  return (
    <PageHeader
      className={pageHeader}
      ghost={false}
      title={pageTitle}
      breadcrumbRender={() => {
        return <Breadcrumb>{breadcrumbItems}</Breadcrumb>;
      }}
    />
  );
};


export default Header;
