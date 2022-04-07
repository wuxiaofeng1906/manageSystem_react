import React from "react";
import {Link} from "umi";

const NameUrl: React.FC<any> = (props: any) => {

  return (
    <span>
        <Link to={`/shimo/fileBaseline/baselineDetails?shimo=${props.data?.shimo_id}`}>{props.value}</Link>
    </span>

  );
};


export {NameUrl};
