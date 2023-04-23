// 查询数据
import {ExternalGqlClient} from '@/hooks/externalGql';

// 获取列表数据
export const queryAnnounceDetail = async (id: string) => {

  const {data} = await ExternalGqlClient.noticeGQLQuery(`
  {
    NoticeEdition(criteriaStr:"id='${id}'") {
    modifiedTime
    isDeleted
    id
    iteration
    updatedTime
    templateTypeId
    description
    isCarousel
    pageSize
    pages(sorts:[{name:"createdTime"},{name:"modifiedTime"},{name:"id"}]){
      modifiedTime
      id
      yuQue
      image
      pageNum
      layoutTypeId
      contents(sorts:[{name:"createdTime"},{name:"modifiedTime"},{name:"id"}]){
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



