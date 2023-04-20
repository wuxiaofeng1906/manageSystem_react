import {Spin, Tabs} from "antd";
import React, {useEffect, useState} from "react";
import PreReleaseServices from "@/services/preRelease";
import {useLocation, useParams} from "umi";
import {history} from "@@/core/history";

export const ProcessTabs = ({finished}: { finished: boolean }) => {
  // tab的数据
  const [list, setList] = useState<any>([]);
  const {release_num, release_name} = useParams() as { release_num: string; release_name: string }; // 非积压发布获取参数
  const {id} = useParams() as { id: string; }; // 灰度推线上获取参数

  // 切换tab
  const onTabChange = (v: any) => {
    // 跳转链接需要找到下一个数据的subtab和tab
    const p = list.find((e: any) => {
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
    // effect 中调用异步信息时间延迟可能导致最终获取的数据不正确。
    let tabList = await PreReleaseServices.releaseList();
    // 如果是历史记录，则只展示一个Tab
    if (finished) {
      const path = history.location.pathname;
      if (path.includes("/onlineSystem/releaseOrder/")) { //  releaseOrder 的工单编号不是release_num
        tabList = [{release_num: id, release_name}];
      } else {
        tabList = [{release_num, release_name}];
      }
    }

    setList(tabList);
  };

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
