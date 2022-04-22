import React from "react";
import {Tabs} from "antd";
import {myTabs, myTabPane} from "./style.css";
import {useModel} from "@@/plugin-model/useModel";
import {getIterDetailsData} from "@/pages/shimo/fileBaseline/baselineDetails/components/GridList/gridData";

const {TabPane} = Tabs;

const Tab: React.FC<any> = (props: any) => {
  const {setTabsData} = useModel("iterateList.index");
  const {setDetailsData, setColumns} = useModel("iterateList.index");


  const prjInfo = props.hrefParams;

  // 切换Tabs
  const tabChanged = async (activeKey: string) => {
    setTabsData(activeKey);

    let queryType = "demand";
    if (activeKey === "概设基线") {
      queryType = "design"
    }
    const result: any = await getIterDetailsData(queryType, prjInfo.iterID);
    setColumns(result?.columnsData); // 设置列
    setDetailsData(result?.gridData); // 设置数据
  };

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
