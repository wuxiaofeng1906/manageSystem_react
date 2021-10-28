import React, {useEffect, useRef} from 'react';
import axios from "axios";
import {message} from "antd";


const CustomCellRenderer = (props: any) => {

  (window as any).deleteUrl = (params: any) => {

    console.log("22222222", params);
    return "";

  };

  const deleteUrl = (params: any) => {
    console.log("22222222", params);
    return "";
  }


  const myRef = useRef(null);

  useEffect(() => {
    props.registerRowDragger(myRef.current, 0);
  });

  return (
    <div>
      <span>
         <img src="../edit.png" width="20" height="20" alt="执行参数" title="执行参数"/>
      </span>

      <span style={{marginLeft: 10}}>

        <img src="../delete.png" width="20" height="20" alt="执行参数" title="执行参数" onClick={deleteUrl(props.datas)}/>
      </span>
      <span style={{marginLeft: 10}}>
         <img src="../move.png" width="20" height="20" alt="执行参数" title="执行参数" ref={myRef}/>
      </span>


    </div>
  );
};
export default CustomCellRenderer;
