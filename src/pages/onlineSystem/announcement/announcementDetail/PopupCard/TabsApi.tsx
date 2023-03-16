import type {TabsProps} from 'antd';
import {Tabs} from 'antd';
import React, {useRef, useState} from 'react';
import {DndProvider, useDrag, useDrop} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {useModel} from "@@/plugin-model/useModel";

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
    <div ref={ref} style={{marginRight: 24}} className={isOver ? dropClassName : ''}>
      {children}
    </div>
  );
};

// 拖拽的功能
const DraggableTabs: React.FC<TabsProps> = (props: any) => {

  let {items, commonData, anPopData, setAnnPopData, tabOrder, setTabOrder}: any = props;


  // 移动tab时，获取移动后的id顺序
  const moveTabNode = (dragKey: React.Key, hoverKey: React.Key) => {
    const newOrder = tabOrder.slice();

    items.forEach((item: any) => {
      if (item.key && newOrder.indexOf(item.key) === -1) {
        newOrder.push(item.key);
      }
    });

    const dragIndex = newOrder.indexOf(dragKey);
    const hoverIndex = newOrder.indexOf(hoverKey);

    newOrder.splice(dragIndex, 1);
    newOrder.splice(hoverIndex, 0, dragKey);

    setTabOrder(newOrder);
  };

  //  更新数据源
  const updatePopData = () => {
    console.log(anPopData, setAnnPopData, tabOrder);


  };
  // 重新获得Tabs顺序
  const getRealSort = () => {
    // updatePopData();

    /* 要改变上面的展示顺序 */
    // 如果order里面有数据，就用order里面的数据（排序后的数据）
    let pageArray = [...tabOrder];
    if (!tabOrder || tabOrder.length === 0) {
      // order 没有数据则使用初始数据
      const {carouselNum} = commonData;
      new Array(carouselNum).fill(null).map((_, i) => {
        pageArray.push((i + 1).toString())
      })
    }

    let oraData: any = [];
    pageArray.forEach((key: any) => {
      oraData.push(<TabPane tab={<label style={{fontSize: "medium"}}> 第{key}张 </label>} key={key.toString()}
                            style={{fontWeight: "bold"}}/>)
    });

    // 不改变tab的展示顺序，只改变内部数据的排序
    // let oraData: any = [];
    // // order 没有数据则使用初始数据
    // const {carouselNum} = commonData;
    // new Array(carouselNum).fill(null).map((_, i) => {
    //   oraData.push(<TabPane tab={<label style={{fontSize: "medium"}}> 第{(i + 1)}张 </label>} key={(i + 1).toString()}
    //                         style={{fontWeight: "bold"}}/>)
    // });
    return oraData;
  }


  // 渲染Tabs
  const renderTabBar: TabsProps['renderTabBar'] = (tabBarProps, DefaultTabBar) => (
    <DefaultTabBar {...tabBarProps}>
      {node => (
        <DraggableTabNode key={node.key} index={node.key!} moveNode={moveTabNode}>
          {node}
        </DraggableTabNode>
      )}
    </DefaultTabBar>
  );


  return (
    <DndProvider backend={HTML5Backend}>
      <Tabs
        onChange={props.onChange}
        renderTabBar={renderTabBar}
        {...props}
        style={{
          width: '100%',
          marginLeft: 80,
          display: commonData.announce_carousel === 1 ? "inline-block" : "none"
        }}>
        {getRealSort()}
      </Tabs>
    </DndProvider>
  );
};

// 获取拖拽的原始顺序
const getItem = (carouselNum: number) => {
  const items: any = new Array(carouselNum).fill(null).map((_, i) => {
    return {key: String(i + 1)};
  })
  return items;
};


export const DragTabs: React.FC = (props: {}) => {

  const {commonData, anPopData, setAnnPopData, tabOrder, setTabOrder} = useModel('announcement');

  if (!commonData) return <div></div>;
  return (
    <DraggableTabs
      items={getItem(commonData.carouselNum)}
      commonData={commonData}
      anPopData={anPopData}
      setMethod={setAnnPopData}
      tabOrder={tabOrder}
      setTabOrder={setTabOrder}
      {...props}


    />
  )
};


