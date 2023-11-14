import React from 'react';
import {Divider} from "antd";
import StateExample from "@/pages/study/useState";
import ContextExample from "@/pages/study/useContext";
import EffectExample from "@/pages/study/useEffect";
import RefExample from "@/pages/study/useRef";
import ImperativeHandleExample from "@/pages/study/useImperativeHandle";
import MemoExample from "@/pages/study/useMemo";
import CallbackExample from "@/pages/study/useCallback";
import ReducerExample from "@/pages/study/useReducer";

function TotalExample() {


  return (
    <div>
      {/* useState */}
      <Divider>useState</Divider>
      <StateExample/>
      <Divider>useContext </Divider>
      <ContextExample/>
      <Divider>useEffect </Divider>
      <EffectExample/>
      <Divider>useRef </Divider>
      <RefExample/>
      <Divider>ImperativeHandle </Divider>
      <ImperativeHandleExample/>
      <Divider>useMemo </Divider>
      <MemoExample/>
      <Divider>CallbackExample </Divider>
      <CallbackExample/>
      <Divider>ReducerExample </Divider>
      <ReducerExample/>
    </div>
  )
}

export default TotalExample


