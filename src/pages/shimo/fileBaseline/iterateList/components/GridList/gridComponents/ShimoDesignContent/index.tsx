import {TreeSelect} from 'antd';
import {useModel} from "@@/plugin-model/useModel";
import React, {useEffect, useState} from "react";
import {modifyListContent} from "../ShimoStoryContent/rowChanged" ;
import {getTreeSelectData} from "../ShimoStoryContent/selector";
import {getIterListData} from "@/pages/shimo/fileBaseline/iterateList/components/GridList/gridData";
import "../style.less";

const ShimoDesignContent: React.FC<any> = (props: any) => {

  const {data, column} = props;
  const {setListData, queryInfo, initDesignTree} = useModel("iterateList.index");

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
  const designContentChanged = async (enValue: any) => {

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
    const childs = await getTreeSelectData(params.value, params.id, "design");
    const oraTree = [...tree.treeData];
    setTreeData({
      ...tree,
      treeData: oraTree.concat(childs)
    });
  };


  useEffect(() => {
    setTreeData({
      values: data.design_directory,
      treeData: initDesignTree
    });
  }, [initDesignTree]);

  // 只有管理员才能操作按钮
  let hideOperate = true;
  if ((JSON.parse(localStorage.getItem('userLogins') as string)).group === "superGroup") {
    hideOperate = false;
  }

  return (<div className={"treeSelectStyle"}>
    <TreeSelect
      treeDataSimpleMode
      style={{width: '100%'}}
      dropdownStyle={{overflow: 'auto', minWidth: 150}}
      bordered={false}
      value={tree.values}
      placeholder="请选择"
      onChange={designContentChanged}
      loadData={loadChildTree}
      treeData={tree.treeData}
      disabled={hideOperate}
    />
  </div>);
};


export {ShimoDesignContent};
