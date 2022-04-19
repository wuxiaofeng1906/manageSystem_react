import React from "react";

const BaseFlag: React.FC<any> = (props: any, prjInfo: any) => {

  //  最新基线标识中的项目名与当前项目名不匹配，则标记颜色。
  const baseFlag = props.value;
  if (!baseFlag) {
    return (<div></div>);
  }
  if (baseFlag.startsWith(prjInfo.iterName)) {
    return (<div>{baseFlag}</div>);
  }

  // 如果不是选中的项目，则把原先的名字标红。
  const baseLineInfo = baseFlag.split("_");
  const tailInfo = baseFlag.replace(baseLineInfo[0], "");
  return (
    <div>
      <label style={{color: "orange"}}>{baseLineInfo[0]}</label>_
      <label>{tailInfo}</label>
    </div>

  );
};


export {BaseFlag};
