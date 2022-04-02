import React from "react";
import {Tabs} from "antd";

import "./style.css";

const {TabPane} = Tabs;

const Tab: React.FC<any> = (props: any) => {

  const tabChanged = () => {

  };

  return (
    <>
      <Tabs className="myTabs" onChange={tabChanged} type="card" size={"small"}>
        <TabPane tab="需求基线" key="需求基线" className="myTabPane">

        </TabPane>
        <TabPane tab="概设基线" key="概设基线" className="myTabPane">

        </TabPane>
      </Tabs>
    </>
  );
};


export default Tab;
