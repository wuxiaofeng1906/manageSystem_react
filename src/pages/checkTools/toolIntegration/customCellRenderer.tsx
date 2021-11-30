import React, {useEffect, useRef} from 'react';


const CustomCellRenderer = (props: any) => {


  const myRef = useRef(null);

  useEffect(() => {

    if(props.registerRowDragger){
      props.registerRowDragger(myRef.current, 0);
    }

  },[myRef]);

  return (
    <div>
      {/*
      <span>
         <img src="../edit.png" width="20" height="20" alt="执行参数" title="执行参数" onClick={() => modifyUrl(props)}/>
      </span>

      <span style={{marginLeft: 10}}>
        {/* react中，要传参数的函数写法 */}
      {/*   <img src="../delete.png" width="20" height="20" alt="执行参数" title="执行参数" onClick={() => deleteUrl(props)}/> */}

      {/* react 中不传参数的函数写法 */}
      {/* <img src="../delete.png" width="20" height="20" alt="执行参数" title="执行参数" onClick={deleteUrl}/>
      </span>  */}

      <span>
         <img src="../move.png" width="20" height="20" alt="移动" title="移动" ref={myRef}/>
      </span>


    </div>
  );
};
export default CustomCellRenderer;
