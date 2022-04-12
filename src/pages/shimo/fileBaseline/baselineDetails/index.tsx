import Header from "./components/Header";
import Tab from "./components/Tabs";
import QueryBar from "./components/QueryBar";
import GridList from "./components/GridList";

const BaseDetails: React.FC<any> = (props: any) => {

  return (
    <>
      {/* header */}
      <Header hrefParams={props.location.query}/>
      {/*  tab  */}
      <Tab hrefParams={props.location.query}/>
      {/*  查询条件  */}
      <QueryBar hrefParams={props.location.query}/>
      {/* 列表 */}
      <GridList hrefParams={props.location.query}/>
    </>
  );
};


export default BaseDetails;
