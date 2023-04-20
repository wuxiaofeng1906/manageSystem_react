import {Spin, Tabs} from "antd";
import React, {useEffect, useState} from "react";
import PreReleaseServices from "@/services/preRelease";
import {useLocation, useParams} from "umi";
import {history} from "@@/core/history";

export const ProcessTabs = ({finished}: { finished: boolean }) => {

  const [list, setList] = useState<any>([]);
  const {release_num, release_name} = useParams() as { release_num: string; release_name: string }; // 非积压发布获取参数
  const {id} = useParams() as { id: string; }; // 灰度推线上获取参数

  const onTabChange = (v: any) => {
    debugger
    // 跳转链接需要找到下一个数据的subtab和tab
    let p = list.find((e: any) => {
      return e.release_num === v
    });

    let replaceUrl = `/onlineSystem/prePublish/${p.release_num}/${p.branch}/${p.is_delete}/${p.release_name}`;
    if (p.release_type == 'backlog_release') {  // 灰度推生产
      replaceUrl = `/onlineSystem/releaseOrder/${p.release_num}/${p.is_delete}/${p.release_name}`;
    }
    history.replace(replaceUrl);
  };

  //获取发布列表
  const getTabsList = async () => {
    let tabList = [{release_num, release_name}];
    // 如果是历史记录，则只展示一个Tab
    if (!finished) {
      tabList = await PreReleaseServices.releaseList();
    }
    setList(tabList);
  }
  useEffect(() => {
    getTabsList();
  }, [release_num, id, finished]);

  return (<Tabs
    activeKey={release_num || id || list?.[0]?.release_num}
    type="editable-card"
    hideAdd={true}
    onChange={(v) => onTabChange(v)}
  >
    {list.map((it: any) => (  //
      <Tabs.TabPane tab={it.release_name} key={it.release_num} closable={false}/>
    ))}
  </Tabs>);

};
