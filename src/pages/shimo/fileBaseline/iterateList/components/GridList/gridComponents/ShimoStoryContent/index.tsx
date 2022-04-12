import {TreeSelect} from 'antd';
import React, {useEffect, useState} from "react";
import {modifyListContent} from "./rowChanged";
import {getTreeSelectData} from "./selector";
import {getIterListData} from "@/pages/shimo/fileBaseline/iterateList/components/GridList/gridData";
import {useModel} from "@@/plugin-model/useModel";

const ShimoStoryContent: React.FC<any> = (props: any) => {

  const {data, column} = props;
  const {setListData, queryInfo, initStoryTree} = useModel("iterateList.index");

  const [tree, setTreeData] = useState({
    values: "",
    treeData: []
  });

  // 获取父组件的数据
  const getParentName = (id: string, result: any = []) => {
    const oraData = [...tree.treeData];
    oraData.forEach((ele: any) => {
      if (ele.id === id) {
        result.unshift(ele.title);
        getParentName(ele.pId, result);
      }
    });
  };


  // 目录修改
  const storyContentChanged = async (enValue: any) => {

    const result: any = [];
    getParentName(enValue, result);

    const modifyResult = await modifyListContent(column.colId, {
      shimo: data.shimo_id,
      id: enValue,
      dir: result.join("/")
    });
    if (modifyResult.code === 200) {
      const dts = await getIterListData(queryInfo);
      setListData(dts);
    }
  };

  // 动态加载子文件
  const loadChildTree = async (params: any) => {
    const childs = await getTreeSelectData(params.value, params.id, "demand");
    const oraTree = [...tree.treeData];
    setTreeData({
      ...tree,
      treeData: oraTree.concat(childs)
    });
  };


  useEffect(() => {

    setTreeData({
      values: data.demand_directory,
      treeData: initStoryTree
    });
  }, [initStoryTree]);


  return (<div>
    <TreeSelect
      treeDataSimpleMode
      style={{width: '100%'}}
      bordered={false}
      value={tree.values}
      placeholder="请选择"
      onChange={storyContentChanged}
      loadData={loadChildTree}
      treeData={tree.treeData}
    />
  </div>);
};


export {ShimoStoryContent};
