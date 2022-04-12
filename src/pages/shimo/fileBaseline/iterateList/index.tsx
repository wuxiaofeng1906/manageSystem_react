import PageHeader from './components/PageHeader';
import QueryBar from './components/QueryBar';
import GridList from './components/GridList'
import {useRequest} from "ahooks";
import {getTreeSelectData} from "@/pages/shimo/fileBaseline/iterateList/components/GridList/gridComponents/ShimoStoryContent/selector";
import {useModel} from "@@/plugin-model/useModel";
import {useEffect} from "react";

const IterateList: React.FC<any> = () => {
  const {setInitTree} = useModel("iterateList.index");


  const treeList: any = useRequest(() => getTreeSelectData()).data;

  useEffect(() => {
    setInitTree(treeList);
  }, [treeList])
  return (
    <>
      {/*  header  */}
      <PageHeader/>
      {/*  query  */}
      <QueryBar/>
      {/*  table */}
      <GridList/>
    </>
  );
};


export default IterateList;
