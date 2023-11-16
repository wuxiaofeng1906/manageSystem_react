import React, {useMemo, useState} from 'react'

const SonFn = ({name, age}) => {
  const isAdult = (age1) => {
    return age1 >= 18 ? "已成年" : "未成年";
  }

  //加上useMemo后，表示只有age发生变化，才调用isAdult函数,修改name，则不会变。
  let adultStr = useMemo(() => {
    return isAdult(age);
  }, [age]);

  return (
    <div>
      <h5>子组件(函数式组件)</h5>
      <p>姓名：{name}</p>
      <p>年龄：{age}</p>
      <p>是否成年:{adultStr}</p>
    </div>
  )
}

const MemoExample = () => {
  console.log("父组件");

  const [name, setName] = useState('张三疯')
  const [age, setAge] = useState(12)

  return (
    <>
      <h1>useMemo</h1>
      <input type="button"
             value="修改name"
             onClick={() => setName(name + "1")}/>
      <input type="button"
             value="修改age"
             onClick={() => setAge(age + 1)}/>
      <hr/>
      <SonFn name={name} age={age}/>
    </>
  )
}


export default MemoExample;
