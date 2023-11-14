import {legacy_createStore as createStore, applyMiddleware} from 'redux'
import reducer from "./reducer";
import thunk from "redux-thunk"; // 配置thunk

const store = createStore(
  reducer,
  // 配置thunk中间件
  applyMiddleware(thunk),


  // window.__REDUX_DEVTOOLS_EXTENSTION__ && window.__REDUX_DEVTOOLS_EXTENSTION__()
);

export default store;
