import React from 'react';
import {Spin, Tabs} from "antd";
import MyPageHeader from "./components/MyPageHeader";
import OperateBar from "./components/OperateBar";
import ProjectIndicator1 from "./components/ProjectIndicator1";
import ProjectIndicator2 from "./components/ProjectIndicator2";
import ProjectIndicator3 from "./components/ProjectIndicator3";
import {useModel} from "@@/plugin-model/useModel";
import "./indexStyle.css";

const {TabPane} = Tabs;
const WeekCodeTableList: React.FC<any> = (props: any) => {
  const {browserHeight, setBrowserHeight, refreshState, setCurrentTab} = useModel('projectIndex.index');

  const prjInfo = {
    id: props.location.query.id,
    name: props.location.query.name
  };
  window.onresize = function () {
    setBrowserHeight(document.body.clientHeight - 140);
  };

  return (
    <div className="mainDiv">
      <MyPageHeader {...prjInfo}/>
      <Spin size="large" tip="数据加载中..." spinning={refreshState}>
        <OperateBar {...prjInfo}/>
        <Tabs className="tabs" tabPosition={'bottom'} type="card" style={{height: browserHeight}}
              defaultActiveKey="target_1"
              onChange={(params: any) => {
                setCurrentTab(params)
              }}>
          <TabPane tab="度量指标 1" key="target_1">
            <ProjectIndicator1  {...prjInfo}/>
          </TabPane>
          <TabPane tab="度量指标 2" key="target_2">
            <ProjectIndicator2  {...prjInfo}/>
          </TabPane>
          <TabPane tab="度量指标 3" key="target_3">
            <ProjectIndicator3 {...prjInfo}/>
          </TabPane>
        </Tabs>
      </Spin>
    </div>
  );
};

export default WeekCodeTableList;
