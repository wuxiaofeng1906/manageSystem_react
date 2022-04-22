import React from "react";
import {LinkOutlined} from '@ant-design/icons';
import {warnMessage} from '@/publicMethods/showMessages'

const myUrls: React.FC<any> = (props: any) => {

  if (props.value) {
    return (
      <a href={props.value} target="_blank">
        <LinkOutlined/>
      </a>
    );
  }

  const showErrorMessage = () => {
    if (props.column?.colId === "demand_directory_url") {
      warnMessage("请选择石墨需求目录！");
    } else if (props.column?.colId === "design_directory_url") {
      warnMessage("请选择石墨概设目录！");
    }
  }
  return (
    <a onClick={showErrorMessage}>
      <LinkOutlined/>
    </a>
  );
};


export {myUrls};
