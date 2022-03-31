import PageHeader from './components/PageHeader';
import QueryBar from './components/QueryBar';
import GridList from './components/GridList'


const IterateList: React.FC<any> = () => {

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
