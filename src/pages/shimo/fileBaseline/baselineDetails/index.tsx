import Header from "./components/Header";
import Tab from "./components/Tabs";
import QueryBar from "./components/QueryBar";
import GridList from "./components/GridList";

const BaseDetails: React.FC<any> = () => {

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
