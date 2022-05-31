import { IRecord, PreUpgradeItem,PreSql,PreServices } from '@/namespaces';
import OnlineServices from '@/services/online';
import { replaceKeyMap } from '@/utils/utils';
import { useState,useCallback,useEffect} from 'react';
interface IProInfo {
  release_project: IRecord;
  upgrade_project: PreUpgradeItem[];
  upgrade_app: PreServices[];
  upgrade_api: PreSql[];
  upgrade_review: IRecord[];
}
export default () => {
  const [state, setState] = useState({
    typeSelectors:[]    as IRecord[],     // 发布类型
    methodSelectors:[]  as IRecord[],   // 发布方式
    projectSelectors:[] as IRecord[],  // 发布项目
    branchSelectors:[]  as IRecord[],    // 发布分支
    frontSelector:[]    as  IRecord[]     // 前端应用
  })
  const [proInfo,setProInfo] = useState<IProInfo |null>()

  const init = useCallback(async()=>{

    const [typeSelectors, methodSelectors, branchSelectors, projectSelectors,frontSelector] = await Promise.all([
      OnlineServices.releaseType(),
      OnlineServices.releaseMethod(),
      OnlineServices.releaseBranch(),
      OnlineServices.releasePro(),
      OnlineServices.frontApp()
    ])

    setState({
      typeSelectors: replaceKeyMap(typeSelectors,[{release_name:'label',release_type:'value'}]),
      methodSelectors: replaceKeyMap(methodSelectors,[{release_name:'label',release_method:'value'}]), 
      branchSelectors: replaceKeyMap(branchSelectors,[{image_branch:'label',branch_id:'value'}]),
      projectSelectors: replaceKeyMap(projectSelectors,[{execution_name:'label',execution_id:'value'}]),
      frontSelector:frontSelector
    })

  },[])


  useEffect(() => {
    init()
  }, [])

  const getProInfo =useCallback(async(data)=>{
    const result = await OnlineServices.proDetail(data);
    setProInfo(result)
    return result;
  },[])
  const updateColumn =useCallback(async(data)=>{
    await OnlineServices.releaseColumn(data);
  },[])

  return { init,...state,proInfo, getProInfo,updateColumn};
};