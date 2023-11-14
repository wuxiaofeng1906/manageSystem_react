import React, {useState, useMemo, useCallback} from 'react';

// useMemo用于缓存计算结果，确保只有在依赖项发生变化时才会重新计算。
// useCallback用于缓存函数，确保只有在依赖项发生变化时才会重新创建函数。
// useMemo优化的是计算结果的缓存，而useCallback优化的是函数的缓存。

function CallbackExample(props) {
  const [count, setCount] = useState(0);
  // useMemo 优化计算结果的缓存
  const expensiveFunction = useMemo(() => {
    console.log('calculating...');
    let result = 0;
    for (let i = 0; i < count * 100000; i++) {
      result += i;
    }
    return result;
  }, [count]);


  // useCallback 优化函数的缓存
  const handleClick = useCallback(() => {
    console.log('clicked...');
    setCount(count + 1);
  }, [count]);

  return (
    <div>
      <p>count: {count}</p>
      <p>expensiveFunction: {expensiveFunction}</p>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}

export default CallbackExample;
