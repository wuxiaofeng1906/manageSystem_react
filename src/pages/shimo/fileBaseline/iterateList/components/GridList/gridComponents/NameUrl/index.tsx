import React from "react";
import {Link} from "umi";

const NameUrl: React.FC<any> = (props: any) => {

  const {data} = props;
  debugger;
  // 参数需要 迭代名称，迭代ID、SQA、需求和概设的基线ID
  return (
    <span>
        <Link
          to={`/shimo/fileBaseline/baselineDetails?iterID=${data.execution_id}&iterName=${data.execution_name}&SQA=${data.execution_sqa_name}&storyId=${data.demand_directory_guid}&designId=${data.design_directory_guid}`}>{props.value}</Link>
    </span>

  );
};


export {NameUrl};
