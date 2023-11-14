import {useRef, useEffect} from "react";

const RefExample = () => {
  let inputRef: any = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  })
  return (
    <input type="text" ref={inputRef}/>
  )
}

export default RefExample;
