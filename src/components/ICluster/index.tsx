import { useModel } from 'umi';

export default ({ data }: { data?: string }) => {
  const [mergeEnv] = useModel('env', (env) => [env.mergeEnv]);
  const envs = data?.split(',');
  return (
    <>
      {envs?.map((cluster, i) => {
        return (
          <span>
            {mergeEnv[cluster] || cluster}
            {i + 1 == envs?.length ? '' : ','}
          </span>
        );
      }) || ''}
    </>
  );
};
