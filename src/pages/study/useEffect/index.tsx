import React, {useState,useEffect} from 'react'

function EffectExample() {
  const [number, setNumber] = useState(0)

  const lazy1 = () => {
    setTimeout(() => {
      // 获取点击按钮时的 state
      setNumber(number + 1)
    }, 3000)
  }

  const lazy2 = () => {
    setTimeout(() => {
      // 每次执行时都会再去获取新的 state，而不是使用点击触发时的 state
      setNumber(number => {

        return number + 1
      })
    }, 3000)
  }
  useEffect(() => {
    // 在此可以执行任何带副作用操作
    return () => { // 在组件卸载前执行

      // 在此做一些收尾工作, 比如清除定时器/取消订阅等
    }
  }) // 如果指定的是[], 回调函数只会在第一次render()后执行

  return (
    <div>
      <p>{number}</p>
      <button onClick={() => setNumber(number + 1)}>+</button>
      <br/>
      <button onClick={lazy1}>lazy1:只能获取点击按钮时候的状态</button>
      <br/>
      <button onClick={lazy2}>lazy2:每次执行都会重新获取state, 所以获取的都是最新的state</button>
    </div>
  )
}

export default EffectExample


