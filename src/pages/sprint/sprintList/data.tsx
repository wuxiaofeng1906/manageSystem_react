// 查询数据
import { GqlClient } from '@/hooks';
import { orderBy } from 'lodash';

const queryDevelopViews = async (client: GqlClient<object>, params: any, syncData: boolean) => {
  const range = `{start:"${params.dateRange.start}", end:"${params.dateRange.end}"}`;
  const { data } = await client.query(`
      {
         project(name:"${params.projectName}",category:[${params.projectType}], range:${range},status:[${params.projectStatus}],order:ASC,doSync:${syncData}){
          id
          name
          type
          startAt
          testEnd
          testFinish
          expStage
          expOnline
          creator
          status
          createAt
          ztId
        }
      }
  `);

  return orderBy(data?.project ?? [], 'expStage', 'desc');
};

// 查询是否有重复数据
const queryRepeats = async (client: GqlClient<object>, prjName: string) => {
  const { data } = await client.query(`
      {
        proExist(name:"${prjName}"){
          ok
          data{
            id
            name
            type
            startAt
            testEnd
            testFinish
            expStage
            expOnline
            creator
            status
            createAt
            ztId
          }
          code
          message
        }
      }
  `);

  // console.log('data', data);
  return data?.proExist;
};

const queryDeleteCount = async (client: GqlClient<object>, params: any) => {
  const { data } = await client.query(`
      {
         proDetail(project:${params}){
            id
            category
            ztNo
          }
      }
  `);
  return data?.proDetail;
};

export { queryDevelopViews, queryRepeats, queryDeleteCount };
