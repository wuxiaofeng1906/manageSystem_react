import Header from "./components/Header";
import Tab from "./components/Tabs";
import QueryBar from "./components/QueryBar";

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
    </>
  );
};


export default BaseDetails;
