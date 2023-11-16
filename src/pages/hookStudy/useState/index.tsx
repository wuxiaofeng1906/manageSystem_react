import React, {useState} from 'react'

function StateExample() {
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

export default StateExample


