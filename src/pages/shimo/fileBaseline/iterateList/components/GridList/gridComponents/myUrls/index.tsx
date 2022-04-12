import React from "react";
import {LinkOutlined} from '@ant-design/icons';

const myUrls: React.FC<any> = (props: any) => {
  return (
    <a href={props.value} target="_blank">
      <LinkOutlined/>
    </a>
  );
};


export {myUrls};
