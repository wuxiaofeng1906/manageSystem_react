import {CHANGE_INPUT, ADD_INPUT, DEAL_ITEM, GET_LIST} from "./constant";

const defaultState = {
  inputValue: "Write Something",
  list: []
}

// 这个必须是纯函数，比如这里面不能用ajax，不能返回跟参数无关的结果
export default (state = defaultState, action) => {
  let newState = JSON.parse(JSON.stringify(state));
  // reducer 里只能接受state，不能改变state
  switch (action.type) {
    case CHANGE_INPUT:
      newState.inputValue = action.value;
      break;
    case ADD_INPUT:
      newState.list.push(newState.inputValue);
      newState.inputValue = undefined;
      break;
    case DEAL_ITEM:
      newState.list.splice(action.index, 1);
      break;
    case GET_LIST:
      newState.inputValue = action.data.inputValue;
      newState.list = action.data.list;
      break;
    default:
      break;
  }
  return newState;
}
