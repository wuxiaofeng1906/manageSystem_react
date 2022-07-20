import LockServices from '@/services/lock';
import { useModel } from 'umi';
import { useState } from 'react';

const useLock = () => {
  const [lockList, setLockList] = useState<any[]>([]);
  const [singleLock, setsingleLock] = useState<any>();
  const [currentUser] = useModel('@@initialState', (app) => [app.initialState?.currentUser]);

  // 加锁、删锁
  const updateLockStatus = async (id: string, method: 'post' | 'delete', page = 'duty') => {
    await LockServices.updateLockStatus(
      {
        user_id: currentUser?.userid,
        user_name: currentUser?.name,
        param: `${page}_${id}`,
      },
      method,
    );
  };
  // 获取所有锁、单行锁
  const getAllLock = async (page: string, isSingle = false) => {
    const res = await LockServices.getLockAll(page);
    setLockList(res);
    isSingle && setsingleLock(res[0] ?? null);
    return res;
  };
  return { updateLockStatus, getAllLock, lockList, singleLock };
};
export default useLock;
