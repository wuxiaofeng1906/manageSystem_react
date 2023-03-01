// 查询数据
import {ExternalGqlClient} from '@/hooks/externalGql';

// 获取列表数据
export const queryAnnounceList = async (page: number, pageSize: number) => {
  debugger
  const {data} = await ExternalGqlClient.noticeGQLQuery(`
  {
    NoticeEdition(firstResult: 0, maxResult: 10) {
        id
        iteration
        updatedTime
        templateTypeId
        description
        isCarousel
        pageSize
    }
  }`);

  console.log(data);
  debugger

};


// // 获取列表总数
// export const queryAnnounceListCount = async (client: GqlClient<object>, page: number, pageSize: number) => {
//   const {data} = await client.query(`
//   {
//     AggregateQueryOne(entity: "NoticeEdition") {
//       count: aggr(expr: "count(*)")
//     }
//   }`);
//
//   console.log(data);
//   debugger
//
// };
