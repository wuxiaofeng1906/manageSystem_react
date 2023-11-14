const defaultState = {
  inputValue: "hello",
  list: []
}

// 这个必须是纯函数，比如这里面不能用ajax，不能返回跟参数无关的结果
export default (state = defaultState, action) => {
  let newState = JSON.parse(JSON.stringify(state));
  // reducer 里只能接受state，不能改变state
  switch (action.type) {
    case "change_input":
      newState.inputValue = action.value;
      break;
    case "add_item":
      newState.list.push(newState.inputValue);
      newState.inputValue = undefined;
      break;

    default:
      break;
  }
  return newState;
}
