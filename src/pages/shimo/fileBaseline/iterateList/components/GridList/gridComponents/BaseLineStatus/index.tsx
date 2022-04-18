import React from "react";
import {Tag} from 'antd';

import "../style.less";

const BaseLineStatus: React.FC<any> = (props: any) => {
  if (props.value === "未知" || props.value === "未基线") {
    return (<Tag style={{color: "gray", width: 65, textAlign: "center"}}>未基线</Tag>);
  }
  if (props.value === "已基线") {
    return (<Tag style={{width: 65, textAlign: "center"}} color={"green"}>已基线</Tag>);
  }
  if (props.value === "部分基线") {
    return (<Tag color={"blue"}>部分基线</Tag>);
  }
  return props.value;
};


export {BaseLineStatus};
