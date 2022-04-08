import Header from "./components/Header";
import Tab from "./components/Tabs";
import QueryBar from "./components/QueryBar";
import GridList from "./components/GridList";
import {useModel} from "@@/plugin-model/useModel";
import {useEffect} from "react";

const BaseDetails: React.FC<any> = (props: any) => {

  const {setListParams} = useModel("iterateList.index");

  useEffect(() => {
    const prjInfo = props.location.query;

    setListParams({
      iterId: Number(prjInfo.iterID),
      iterName: prjInfo.iterName,
      SQA: prjInfo.SQA === "null" ? "" : prjInfo.SQA,
      designId: prjInfo.designId,
      storyId: prjInfo.storyId
    });

  }, [1]);

  return (
    <>
      {/* header */}
      <Header/>
      {/*  tab  */}
      <Tab/>
      {/*  查询条件  */}
      <QueryBar/>
      {/* 列表 */}
      <GridList/>
    </>
  );
};


export default BaseDetails;
