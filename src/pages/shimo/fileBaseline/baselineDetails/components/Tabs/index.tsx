import React, {useEffect} from "react";
import {Tabs} from "antd";
import {myTabs, myTabPane} from "./style.css";
import {useModel} from "@@/plugin-model/useModel";

const {TabPane} = Tabs;

const Tab: React.FC<any> = (props: any) => {
  const {setTabsData} = useModel("iterateList.index");

  // 切换Tabs
  const tabChanged = (activeKey: string) => {
    setTabsData(activeKey);
  };

  // useEffect(() => {
  //   setTabsData("需求基线");
  // });
  return (
    <>
      <Tabs className={myTabs} onChange={tabChanged} type="card" size={"small"}>
        <TabPane tab="需求基线" key="需求基线" className={myTabPane}/>
        <TabPane tab="概设基线" key="概设基线" className={myTabPane}/>
      </Tabs>
    </>
  );
};


export default Tab;
