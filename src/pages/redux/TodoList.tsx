import React, {Component} from "react";
import {Input, Button, List} from 'antd';
import store from "@/pages/redux/store";
import {changeInputAction, addItemAction, delItemAction, getListAction,getToDoList} from "./store/actionCreators";



class TodoList extends Component {
  constructor(props) {
    super(props);

    this.state = store.getState();

    // 绑定this
    this.onValueChanged = this.onValueChanged.bind(this);

    // 订阅更新state(最好写在首页index中，这样就不用每个组件都订阅一次)
    store.subscribe(() => this.setState(store.getState()))
  }


  // input框修改
  onValueChanged(e) {
    store.dispatch(changeInputAction(e.target.value));
  }

  // 添加
  addValue() {
    store.dispatch(addItemAction());
  }

  // 删除
  delItem = (index) => {
    store.dispatch(delItemAction(index));
  }

  componentDidMount() {
    // 这里最好不要去直接请求后端拿取数据，利用thunk，栽在action中去请求数据返回。
    store.dispatch(getToDoList());
  }


  render() {
    return (<div style={{marginLeft: 10}}>
      <div>
        <Input placeholder={this.state?.inputValue} style={{width: 250, marginRight: 10}}
               onChange={this.onValueChanged}
               value={this.state.inputValue}
        ></Input>
        <Button type={"primary"} onClick={this.addValue}>增加</Button>
      </div>
      <div style={{margin: 10, width: 300}}>
        <List bordered dataSource={this.state?.list}
              renderItem={(item, index) => (
                <List.Item onClick={this.delItem.bind(this, index)}>{item}</List.Item>
              )}>
        </List>

      </div>

    </div>);
  }
}

export default TodoList;
