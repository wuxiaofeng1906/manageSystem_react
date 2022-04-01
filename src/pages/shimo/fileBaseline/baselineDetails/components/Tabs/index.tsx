import React from "react";
import {Tabs} from "antd";

import "./style.css";

const {TabPane} = Tabs;

const Tab: React.FC<any> = (props: any) => {

  const tabChanged = () => {

  };

  return (
    <>
      <Tabs onChange={tabChanged} type="card">
        <TabPane tab="需求基线" key="需求基线">
          Content of Tab Pane 1
        </TabPane>
        <TabPane tab="概设基线" key="概设基线">
          Content of Tab Pane 2
        </TabPane>
      </Tabs>
    </>
  );
};


export default Tab;
