import React from "react";
import ReactDom from "react-dom";
import TodoList from "./TodoList";
import {Provider} from "react-redux"; // 提供器：包裹要使用的组件
import store from "@/pages/reactRedux/store";

// store.subscribe(
//   () => ReactDom.render(<TodoList/>, document.getElementById('root'))
// )

// 使用了react-redux
const App = (
  <Provider store={store}>
    <TodoList/>
  </Provider>);
ReactDom.render(App, document.getElementById('root'));



