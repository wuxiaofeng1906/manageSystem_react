import React, {useEffect, useRef} from 'react';


// 删除URL
const deleteUrl = (params: any) => {
  console.log("删除数据", params.data);
  return "";
}

// 修改URL
const modifyUrl = (params: any) => {
  console.log("修改数据", params.data);
  return "";
}


const CustomCellRenderer = (props: any) => {


  const myRef = useRef(null);

  useEffect(() => {
    props.registerRowDragger(myRef.current, 0);
  });

  return (
    <div>
      <span>
         <img src="../edit.png" width="20" height="20" alt="执行参数" title="执行参数" onClick={() => modifyUrl(props)}/>
      </span>

      <span style={{marginLeft: 10}}>
        {/* react中，要传参数的函数写法 */}
        <img src="../delete.png" width="20" height="20" alt="执行参数" title="执行参数" onClick={() => deleteUrl(props)}/>

        {/* react 中不传参数的函数写法 */}
        {/* <img src="../delete.png" width="20" height="20" alt="执行参数" title="执行参数" onClick={deleteUrl}/> */}
      </span>
      <span style={{marginLeft: 10}}>
         <img src="../move.png" width="20" height="20" alt="执行参数" title="执行参数" ref={myRef}/>
      </span>


    </div>
  );
};
export default CustomCellRenderer;
