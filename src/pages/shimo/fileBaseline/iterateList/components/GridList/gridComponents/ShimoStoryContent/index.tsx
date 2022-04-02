import {Select, TreeSelect} from 'antd';
import React from "react";

const {TreeNode} = TreeSelect;


const ShimoStoryContent: React.FC<any> = (props: any) => {

  return (<div>
    <TreeSelect
      treeDataSimpleMode
      style={{width: '120%'}}
      bordered={false}
      // value={this.state.value}
      dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
      placeholder="请选择"
      // onChange={this.onChange}
      // loadData={this.onLoadData}
      // treeData={treeData}
    />
  </div>);
};


export {ShimoStoryContent};
