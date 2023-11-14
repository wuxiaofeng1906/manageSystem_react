import {CHANGE_INPUT, ADD_INPUT, DEAL_ITEM,GET_LIST} from "./constant";
import axios from "axios";
// 修改
export const changeInputAction = (value: string) => {
  return {
    type: CHANGE_INPUT,
    value
  }
}

export const addItemAction = () => {
  return {type: ADD_INPUT}
}

export const delItemAction = (index) => {
  return {
    type: DEAL_ITEM,
    index
  }
}

export const getListAction = (data) => {
  debugger
  return {
    type: GET_LIST,
    data
  }
}

// 异步获取后端数据，并返回界面
export const getToDoList=()=>{
  // 只有安装了thunk，这里才能返回函数，如果没有安装，这里会报错。
  return (dispatch)=>{
    // axios.get('').then((res) => {
    //   dispatch(getListAction(res.data));
    // });

    const res = {
      data: {
        inputValue: "test",
        list: [1, 2, 3]
      }
    }
    dispatch(getListAction(res.data));
  }
}
