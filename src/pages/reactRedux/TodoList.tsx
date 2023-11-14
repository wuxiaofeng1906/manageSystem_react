import React, {Component} from "react";
import {connect} from "react-redux";

// 这个函数也可以写成无状态组件，就是不用state的组件，也就是函数组件
class TodoList extends Component {
  render() {
    const {inputValue, inputChange, clickButton, list} = this.props;
    return (<div style={{marginLeft: 10}}>

      <div>
        <input value={inputValue}
               onChange={inputChange}/>
        <button onClick={clickButton}>提交</button>
      </div>
      <div>
        <ul>
          {
            list.map((item, index) => {
              return (<li key={index}>{item}</li>)
            })
          }
        </ul>
      </div>

    </div>);
  }
}

const stateToProps = (state) => {
  // 值渲染到props中
  return {
    inputValue: state.inputValue,
    list: state.list
  }
};

const dispatchToProps = (dispatch) => {
  return {
    inputChange(e) {
      let action = {
        type: 'change_input',
        value: e.target.value
      };
      dispatch(action)
    },
    clickButton() {
      let action = {
        type: 'add_item'
      };
      dispatch(action)

    }
  }
}
// connect 连接器传送命令
export default connect(stateToProps, dispatchToProps)(TodoList);
