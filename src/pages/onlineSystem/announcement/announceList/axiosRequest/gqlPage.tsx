// 查询数据
import {ExternalGqlClient} from '@/hooks/externalGql';

// 获取列表数据
export const queryAnnounceList = async (page: number, pageSize: number) => {
  const {data} = await ExternalGqlClient.noticeGQLQuery(`
  {
    NoticeEdition(firstResult: ${page - 1}, maxResult: ${pageSize}) {
        id
        iteration
        updatedTime
        templateTypeId
        description
        isCarousel
        pageSize
    }

    AggregateQueryOne(entity: "NoticeEdition") {
      count: aggr(expr: "count(*)")
    }
  }`);

  return data;
};



