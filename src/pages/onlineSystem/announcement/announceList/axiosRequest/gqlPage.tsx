// 查询数据
import {GqlClient} from '@/hooks';

// 获取列表数据
export const queryAnnounceList = async (client: GqlClient<object>, page: number, pageSize: number) => {
  debugger
  // {
  //    proDetail(project:123){
  //       id
  //       category
  //       ztNo
  //     }
  // }
  const {data} = await client.query(`
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


// 获取列表总数
export const queryAnnounceListCount = async (client: GqlClient<object>, page: number, pageSize: number) => {
  const {data} = await client.query(`
  {
    AggregateQueryOne(entity: "NoticeEdition") {
      count: aggr(expr: "count(*)")
    }
  }`);

  console.log(data);
  debugger

};
