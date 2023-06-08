import type {TabsProps} from 'antd';
import {Tabs} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {DndProvider, useDrag, useDrop} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import PreReleaseServices from "@/services/preRelease";
import {history} from "@@/core/history";
import {useParams} from "umi";
import {errorMessage} from "@/publicMethods/showMessages";

const type = 'DraggableTabNode';
const {TabPane} = Tabs;

interface DraggableTabPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  index: React.Key;
  moveNode: (dragIndex: React.Key, hoverIndex: React.Key) => void;
}

const DraggableTabNode = ({index, children, moveNode}: DraggableTabPaneProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{isOver, dropClassName}, drop] = useDrop({
    accept: type,
    collect: monitor => {
      const {index: dragIndex} = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: 'dropping',
      };
    },
    drop: (item: { index: React.Key }) => {
      moveNode(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: {index},
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));

  return (
    <div ref={ref} style={{marginRight: 2}} className={isOver ? dropClassName : ''}>
      {children}
    </div>
  );
};

// 拖拽的功能
const DraggableTabs: React.FC<TabsProps> = (props: any) => {

  let {setTabList, tabList, activeKey}: any = props;

  // 移动tab时，获取移动后的id顺序
  const moveTabNode = async (dragKey: React.Key, hoverKey: React.Key) => {
    const tabOrder = [...tabList];

    let dragedRow: any = {}; // 保存当前拖拽的数据（用于后面插入）
    const newTabOrderKey: any = [];
    tabOrder.forEach((item: any) => {
      newTabOrderKey.push(item.key);
      if (item.key === dragKey) {
        // 需要插入的数据
        dragedRow = item;
      }
    });

    // 拖拽的是第几个
    const dragIndex = newTabOrderKey.indexOf(dragKey);
    const hoverIndex = newTabOrderKey.indexOf(hoverKey);
    // 先删除
    tabOrder.splice(dragIndex, 1);
    // 后新增
    tabOrder.splice(hoverIndex, 0, dragedRow);
    // 不再请求后端保存排序功能
    if (tabOrder && tabOrder.length > 0) {
      setTabList(tabOrder);
      // 这里也要修改localstorage的数据
      localStorage.setItem("onlineSystem_tab", JSON.stringify(tabOrder));
    }

    // if (tabOrder && tabOrder.length > 0) {
    //   const sortArr: any = []; // 保存数据传值到后端
    //   tabOrder.map((it: any, index: number) => {
    //     sortArr.push({
    //       release_index: index + 1,
    //       release_num: it.key
    //     })
    //   })
    //   const saved = await PreReleaseServices.releaseOrder_own(sortArr);
    //   if (saved.code === 200) {
    //     setTabList(tabOrder);
    //     //   这里也要修改localstorage的数据
    //     localStorage.setItem("onlineSystem_tab", JSON.stringify(tabOrder));
    //
    //   } else {
    //     errorMessage("顺序保存错误：" + saved.msg);
    //   }
    // }
  };

  // 减少tab
  const onEdit = (e: string, type: string) => {

    if (type === "remove") {
      const pageArray = [...tabList];
      const exitedArray = pageArray.filter(item => item.key !== e);
      setTabList(exitedArray);
      const storages = JSON.parse(localStorage.getItem("onlineSystem_tab") as string);
      const new_storages = storages.filter((item: any) => item.release_num !== e);
      localStorage.setItem("onlineSystem_tab", JSON.stringify(new_storages));
    }
  };
  // 重新获得Tabs顺序
  const getRealSort = () => {

    const pageArray = [...tabList];
    let oraData: any = [];
    pageArray.forEach((page: any) => {
      oraData.push(<TabPane tab={page.label} key={page.key} closable={pageArray.length > 1 ? true : false}/>)
    });
    return oraData;
  }

  // 渲染Tabs
  const renderTabBar: TabsProps['renderTabBar'] = (tabBarProps: any, DefaultTabBar: any) => (
    <DefaultTabBar {...tabBarProps}>
      {(node: any) => (
        <DraggableTabNode key={node.key} index={node.key!} moveNode={moveTabNode}>
          {node}
        </DraggableTabNode>
      )}
    </DefaultTabBar>
  );

  // 切换tab
  const onTabChange = (v: any) => {
    // 跳转链接需要找到下一个数据的subtab和tab
    const p = tabList.find((e: any) => {
      return e.release_num === v
    });

    let replaceUrl = `/onlineSystem/prePublish/${p.release_num}/${p.branch}/${p.is_delete}/${p.release_name}`;
    if (p.release_type == 'backlog_release') {  // 灰度推生产
      replaceUrl = `/onlineSystem/releaseOrder/${p.release_num}/${p.is_delete}/${p.release_name}`;
    }
    history.replace(replaceUrl);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Tabs
        activeKey={activeKey}
        onChange={onTabChange}
        renderTabBar={renderTabBar}
        type="editable-card"
        hideAdd={true}
        onEdit={onEdit}
      >
        {getRealSort()}
      </Tabs>
    </DndProvider>
  );
};


export const ProcessTab: React.FC = (props: any) => {

  // tab的数据
  const [tabList, setTabList] = useState<any>([]);
  let {release_num, release_name} = useParams() as { release_num: string; release_name: string }; // 非积压发布获取参数
  const {id} = useParams() as { id: string; }; // 灰度推线上获取参数

  if (history.location.pathname.includes("/onlineSystem/releaseOrder/")) { //  releaseOrder 的工单编号不是release_num
    release_num = id;
  }

  //获取发布列表
  const getTabsList = async () => {
    // effect 中调用异步信息时间延迟可能导致最终获取的数据不正确。
    // let tabList = await PreReleaseServices.releaseList();
    let tabList = JSON.parse(localStorage.getItem("onlineSystem_tab") as string);

    // 如果是历史记录，则只展示一个Tab,
    if (props.finished) {
      // const path = history.location.pathname;
      // if (path.includes("/onlineSystem/releaseOrder/")) { //  releaseOrder 的工单编号不是release_num
      //   tabList = [{release_num: id, release_name}];
      // } else {
      tabList = [{release_num, release_name}];
      // }
    }
    debugger
    // 判断当前page是否为新增页面，是则只展示一个Tab
    if (tabList && tabList.length) {
      const currentNum = tabList.filter((e: any) => e.release_num === release_num);
      if (currentNum && currentNum.length) {
        const flag = currentNum[0].hasOwnProperty("newAdd")
        if (flag) {
          tabList = [{release_num, release_name: release_num + "新增"}];
        }
      }
    }
    if (tabList && tabList.length) {
      const items = tabList.map((it: any) => {
        return {
          ...it,
          label: it.release_name,
          key: it.release_num
        };
      });
      setTabList(items);
    }

  };

  useEffect(() => {
    getTabsList();

  }, [release_num, id, props.finished]);


  return (
    <DraggableTabs
      tabList={tabList}
      setTabList={setTabList}
      activeKey={release_num || id || tabList?.[0]?.release_num}
    />
  )
};


