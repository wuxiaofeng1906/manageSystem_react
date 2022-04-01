import React from "react";
import {LinkOutlined} from '@ant-design/icons';
import {ztExectionUrl} from "@/namespaces";

const myUrls: React.FC<any> = (props: any) => {
  return (
    <a href={ztExectionUrl(6)} target="_blank">
      <LinkOutlined/>
    </a>
  );
};


export {myUrls};
