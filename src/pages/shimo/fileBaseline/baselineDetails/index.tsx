import Header from "./components/Header";
import Tab from "./components/Tabs";
import QueryBar from "./components/QueryBar";
import GridList from "./components/GridList";
import {useModel} from "@@/plugin-model/useModel";
import {useEffect} from "react";

const BaseDetails: React.FC<any> = (props: any) => {

  const {listData, setQueryDetailsInfo} = useModel("iterateList.index");

  useEffect(() => {
    let infos: any = {};
    const shimoId = props.location.query.shimo;
    for (let index = 0; index < listData.length; index += 1) {
      const dts: any = listData[index];
      if (Number(shimoId) === dts.shimo_id) {
        infos = dts;
        break;
      }
    }

    setQueryDetailsInfo({
      iterName: infos.execution_name,
      SQA: infos.execution_sqa_name,
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
