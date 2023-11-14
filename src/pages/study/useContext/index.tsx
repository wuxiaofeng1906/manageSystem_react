import React, {useContext} from "react";

interface DataType {
  name: string;
}

const ContextExample = () => {

  const AppContext = React.createContext<DataType>({name: ""});
  const A = () => {
    const {name} = useContext(AppContext)
    return (
      <p>
        我是A组件,我的名字是：{name}；
      </p>
    )
  }
  const B = () => {
    const {name} = useContext(AppContext);
    return (
      <p>我是B组件,名字是： {name}</p>
    )
  }
  return (
    <AppContext.Provider value={{name: '张三'}}>
      <A/>
      <B/>
    </AppContext.Provider>
  )
}
export default ContextExample;
