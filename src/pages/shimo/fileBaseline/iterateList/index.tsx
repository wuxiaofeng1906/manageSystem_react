import PageHeader from './components/PageHeader';
import QueryBar from './components/QueryBar';
import GridList from './components/GridList'
import {useRequest} from "ahooks";
import {getTreeSelectData} from "@/pages/shimo/fileBaseline/iterateList/components/GridList/gridComponents/ShimoStoryContent/selector";
import {useModel} from "@@/plugin-model/useModel";
import {useEffect} from "react";

const IterateList: React.FC<any> = () => {
  const {setInitStoryTree, setInitDesignTree} = useModel("iterateList.index");

  const storyTreeList: any = useRequest(() => getTreeSelectData("", "", "demand")).data;
  const designTreeList: any = useRequest(() => getTreeSelectData("", "", "design")).data;

  useEffect(() => {
    setInitStoryTree(storyTreeList);
    setInitDesignTree(designTreeList);
  }, [storyTreeList, designTreeList]);
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
