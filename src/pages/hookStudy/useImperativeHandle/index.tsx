import {useRef, useImperativeHandle} from "react";
import {forwardRef} from "react";

// 子组件
const ChildComponent = (props, ref) => {
  const buttonRef = useRef();
  const showMsg = () => alert("这是ImperativeHandle测试！");
  useImperativeHandle(ref, () => ({
    showChildMsg: () => {
      // 抛出button事件
      showMsg();
    },
  }));
  return <button ref={buttonRef} onClick={showMsg}>子组件button测试</button>;
}
const FancyInputRef = forwardRef(ChildComponent);

// 父组件
const ImperativeHandleExample = () => {
  const ref = useRef() as React.MutableRefObject<{ showChildMsg: Function; }>;

  // 调用子组件的click方法
  const parentClick = () => ref.current?.showChildMsg();
  return (
    <div>
      <button onClick={parentClick}>这是父组件的button</button>
      <FancyInputRef ref={ref}/>
    </div>

  )
}
export default ImperativeHandleExample
