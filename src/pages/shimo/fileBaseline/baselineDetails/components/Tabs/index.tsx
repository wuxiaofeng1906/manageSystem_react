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
        <TabPane tab="需求基线" key="需求基线" style={{height:50}}>

        </TabPane>
        <TabPane tab="概设基线" key="概设基线">

        </TabPane>
      </Tabs>
    </>
  );
};


export default Tab;
