import React from 'react';
import {divStyle, buttonStyle, buttonStyle2, buttonStyle3,
  buttonStyle4} from "./style.css"

const SassExample = () => {

  return <div className={divStyle}>
    <button>left</button>
    <button className={buttonStyle}>按钮1</button>
    <button className={buttonStyle2}>按钮2</button>
    <button className={buttonStyle3}>按钮3</button>
    <button className={buttonStyle4}>按钮4</button>

  </div>
}


export default SassExample;
