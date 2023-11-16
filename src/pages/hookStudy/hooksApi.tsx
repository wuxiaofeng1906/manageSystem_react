import React from 'react';
import {Divider} from "antd";
import StateExample from "@/pages/hookStudy/useState";
import ContextExample from "@/pages/hookStudy/useContext";
import EffectExample from "@/pages/hookStudy/useEffect";
import RefExample from "@/pages/hookStudy/useRef";
import ImperativeHandleExample from "@/pages/hookStudy/useImperativeHandle";
import MemoExample from "@/pages/hookStudy/useMemo";
import CallbackExample from "@/pages/hookStudy/useCallback";
import ReducerExample from "@/pages/hookStudy/useReducer";

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


