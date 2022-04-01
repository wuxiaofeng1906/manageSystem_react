import React from "react";
import {Link} from "umi";

const NameUrl: React.FC<any> = (props: any) => {
  return (
    <span>
        <Link to={"/shimo/fileBaseline/baselineDetails"}>{props.value}</Link>
    </span>

  );
};


export {NameUrl};
