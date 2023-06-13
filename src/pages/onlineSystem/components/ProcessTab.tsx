import type {TabsProps} from 'antd';
import {Tabs} from 'antd';
import React, {useEffect, useRef, useState, useImperativeHandle, forwardRef} from 'react';
import {DndProvider, useDrag, useDrop} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {history} from "@@/core/history";
import {useParams} from "umi";
import PreReleaseServices from "@/services/preRelease";
import {intersectionBy} from "lodash";
import {setTabsLocalStorage} from "@/pages/onlineSystem/commonFunction";

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

  const {setTabList, tabList, activeKey}: any = props;

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
  const onEdit = (e: string, types: string) => {

    if (types === "remove") {
      debugger
      const pageArray = [...tabList];
      const exitedArray = pageArray.filter(item => item.key !== e);
      setTabList(exitedArray);
      const storages = JSON.parse(localStorage.getItem("onlineSystem_tab") as string);
      const new_storages = storages.filter((item: any) => item.release_num !== e);
      localStorage.setItem("onlineSystem_tab", JSON.stringify(new_storages));
      //  减少缓存之后，需要删除当前页面，
      // 如果删除的是当前所看的tab页。则下一个展示链接需要跳转到第一个
      if (activeKey === e) {
        const currentPage = new_storages[0];
        let replaceUrl = `/onlineSystem/prePublish/${currentPage.release_num}/${currentPage.branch}/${currentPage.is_delete}/${currentPage.release_name}`;
        if (currentPage.release_type == 'backlog_release') {  // 灰度推生产
          replaceUrl = `/onlineSystem/releaseOrder/${currentPage.release_num}/${currentPage.is_delete}/${currentPage.release_name}`;
        }
        history.replace(replaceUrl);
      }
    }
  };
  // 重新获得Tabs顺序
  const getRealSort = () => {

    const pageArray = [...tabList];
    const oraData: any = [];
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

const ProcessTab: React.FC = (props: any, ref: any) => {

  // tab的数据
  const [tabList, setTabList] = useState<any>([]);
  let {release_num, release_name} = useParams() as { release_num: string; release_name: string }; // 非积压发布获取参数
  const {id} = useParams() as { id: string; }; // 灰度推线上获取参数

  if (history.location.pathname.includes("/onlineSystem/releaseOrder/")) { //  releaseOrder 的工单编号不是release_num
    release_num = id;
  }

  // 获取需要展示的tab
  const getFinalTabList = async (oraList: any) => {

    // 也要获取列表数据，取交集。才得到最终Tab展示的数据。并且删除不存在的缓存

    let storageList = JSON.parse(localStorage.getItem("onlineSystem_tab") as string);
    const newTabList: any = intersectionBy(oraList, storageList, "release_num");
    // 需要删除的tab
    if (newTabList && newTabList.length) {
      const forDelete = storageList.filter((v: any) => {
        return newTabList.every((e: any) => e.release_num != v.release_num);
      });
      if (forDelete && forDelete.length) {
        forDelete.map((e: any) => {
          setTabsLocalStorage({
            "release_num": e.release_num,
            "release_name": e.release_name,
          }, "delete");
        })
      }
    }

    // 是通过别人的链接进来的，本地缓存可能没有数据，就要手动添加到Tablist中
    // 判断当前单号是否存在newTabList中，不存在需要添加进去
    const filterdArray = newTabList.filter((e: any) => {
      return e.release_num === release_num;
    });

    // 不存在。则添加
    if (!filterdArray || filterdArray.length == 0) {
      const detailsData = oraList.filter((e: any) => {
        return e.release_num === release_num;
      });
      if (detailsData && detailsData.length > 0) {
        const item = detailsData[0];
        newTabList.push(item);

        // 并添加到缓存
        setTabsLocalStorage({
          "release_num": item.release_num,
          "release_name": item.release_name,
          "branch": item.branch,
          "is_delete": item.is_delete,
          "release_type": item.release_type,
        });
      }
    }

    return newTabList;
  };

  // 判断当前单号是否为发布成功
  const releaseFinshed = () => {
    //   不能用单据原有的finished参数，多次渲染导致展示效果不好

  };
  //获取发布列表
  const getTabsList = async (refresh: boolean = false) => {

    debugger
    let oraList = await PreReleaseServices.releaseList();
    let newTabList: any;

    // 如果是历史记录，则只展示一个Tab,
    if (props.finished) {
      newTabList = [{release_num, release_name}];
    } else {
      newTabList = await getFinalTabList(oraList);

      if (history.location.pathname.includes("/onlineSystem/releaseOrder/")) {
        // 判断当前page是否为正式发布的新增页面，是的话需要添加到tabLst中展示出来（灰度推生产在创建的时候没有放到缓存，因为这里不点击保存，数据库就没这条记录，就不必在缓存中。
        // 这里不用判断非积压发布的新增，因为非积压发布在新增的时候默认数据库就会有记录，在建立的时候就必须加入缓存）
        // 如果是新增的话，正式发布的工单名称为空  刷新的时候不再判断是否为新增项
        if (release_name === "undefined" && !refresh) {

          if (newTabList && newTabList.length) {
            newTabList.push({
              release_num,
              release_name: release_num + "灰度推生产"
            })
          } else {
            newTabList = [{
              release_num,
              release_name: release_num + "灰度推生产"
            }]
          }

        }
      }
    }

    debugger
    if (newTabList && newTabList.length) {
      const items = newTabList.map((it: any) => {
        return {
          ...it,
          label: it.release_name,
          key: it.release_num
        };
      });
      setTabList(items);
    }

  };

  useImperativeHandle(ref, () => ({onTabsRefresh: getTabsList}));


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

export default forwardRef(ProcessTab);

