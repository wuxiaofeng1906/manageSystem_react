import {Select, TreeSelect} from 'antd';
import React, {useEffect, useState} from "react";
import {modifyListContent} from "./rowChanged";
import {useRequest} from "ahooks";
import {getTreeSelectData} from "./selector";
import {getIterListData} from "@/pages/shimo/fileBaseline/iterateList/components/GridList/gridData";
import {useModel} from "@@/plugin-model/useModel";

const {TreeNode} = TreeSelect;


const ShimoStoryContent: React.FC<any> = (props: any) => {
  const {data} = props;
  const {setListData, queryInfo} = useModel("iterateList.index");

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

    const modifyResult = await modifyListContent("story", {shimo: data.shimo_id, id: enValue, dir: result.join("/")});
    if (modifyResult.code === 200) {
      const dts = await getIterListData(queryInfo);
      setListData(dts);
    }
  };


  // 动态加载子文件
  const loadChildTree = async (params: any) => {
    const childs = await getTreeSelectData(params.value, params.id);
    const oraTree = [...tree.treeData];
    setTreeData({
      ...tree,
      treeData: oraTree.concat(childs)
    });
  };

  const treeList: any = useRequest(() => getTreeSelectData()).data;

  useEffect(() => {

    setTreeData({
      values: data.demand_directory,
      treeData: treeList
    });
  }, [treeList]);


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
