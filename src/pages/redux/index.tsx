import React from "react";
import ReactDom from "react-dom";
import TodoList from "./TodoList";
import store from "@/pages/redux/store";

// store.subscribe(
//   () => ReactDom.render(<TodoList/>, document.getElementById('root'))
// )

ReactDom.render(<TodoList/>, document.getElementById('root'));



