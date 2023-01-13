import { useState } from 'react';
import PreReleaseServices from '@/services/preRelease';

export default () => {
  const [globalEnv, setGlobalEnv] = useState<any[]>([]);
  const [mergeEnv, setMergeEnv] = useState<any>();

  const getEnvs = async () => {
    const res = await PreReleaseServices.environment();
    let result: any[] = [];
    let obj = {};
    res?.forEach((it: any) => {
      result.push({
        label: it.online_environment_name ?? '',
        value: it.online_environment_id,
        key: it.online_environment_id,
      });
      obj = { ...obj, [it.online_environment_id]: it.online_environment_name ?? '' };
    });
    setGlobalEnv(result);
    setMergeEnv(obj);
  };

  return { globalEnv, mergeEnv, getEnvs };
};
