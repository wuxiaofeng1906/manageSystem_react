// 查询数据
import {ExternalGqlClient} from '@/hooks/externalGql';

// 获取列表数据
export const queryAnnounceDetail = async (iteration: string, id: string) => {

  const {data} = await ExternalGqlClient.noticeGQLQuery(`
  {
    NoticeEdition(criteriaStr:"iteration='${iteration}'&&id='${id}'") {
    modifiedTime
    isDeleted
    id
    iteration
    updatedTime
    templateTypeId
    description
    isCarousel
    pageSize
    pages{
      modifiedTime
      id
      yuQue
      image
      pageNum
      layoutTypeId
      contents{
        modifiedTime
        parentId
        id
        speciality
      }
    }
    }
  }`);

  return data;
};



