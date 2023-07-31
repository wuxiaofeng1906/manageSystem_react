import {useState} from 'react';
import PreReleaseServices from '@/services/preRelease';

export default () => {
  const [releaseOrderEnv, setReleaseOrderEnv] = useState<any[]>([]);
  const [globalEnv, setGlobalEnv] = useState<any[]>([]);
  const [mergeEnv, setMergeEnv] = useState<any>();

  // “灰度推线上”的发布单，发布环境要去掉“全部灰度租户集群”与“全部租户集群”
  const getEnvs = async () => {
    const res = await PreReleaseServices.environment();
    let orderResult: any[] = [];
    let result: any[] = [];
    let obj = {};
    res?.forEach((it: any) => {
      // 不展示的环境
      const ignoreEnv = ['cn-northwest-0,cn-northwest-1',
        'cn-northwest-0,cn-northwest-1,cn-apnorthbj-0,cn-northwest-2,cn-northwest-3,cn-northwest-4,cn-northwest-5,cn-northwest-6,cn-northwest-7'];
      if (!ignoreEnv.includes(it.online_environment_id)) {
        // bug 89924
        orderResult.push({
          label: it.online_environment_name ?? '',
          value: it.online_environment_id,
          key: it.online_environment_id,
        });
      }
      result.push({
        label: it.online_environment_name ?? '',
        value: it.online_environment_id,
        key: it.online_environment_id,
      });
      obj = {...obj, [it.online_environment_id]: it.online_environment_name ?? ''};
    });

    setReleaseOrderEnv(orderResult);
    setGlobalEnv(result);
    setMergeEnv(obj);
  };

  return {globalEnv, mergeEnv, releaseOrderEnv, getEnvs};
};
