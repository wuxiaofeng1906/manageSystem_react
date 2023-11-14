import {useReducer} from "react";

const ReducerExample = () => {
  const reducer = (state, action) => {
    if (action.type === 'add') {
      return {
        ...state,
        count: state.count + 1
      }
    } else if (action.type === 'sub') {
      return {
        ...state,
        count: state.count - 1
      }
    } else {
      return state
    }
  }
  const addCount = () => {
    dispatch({
      type: 'add'
    })
  }
  const subCount = () => {
    dispatch({
      type: 'sub'
    })
  }
  const [state, dispatch] = useReducer(reducer, {count: 0})
  return (
    <>
      <p>{state.count}</p>
      <button onClick={addCount}>Add</button>
      <button onClick={subCount}>Sub</button>
    </>
  )
}
export default ReducerExample;
