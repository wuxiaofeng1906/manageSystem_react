import { useCallback } from 'react';
import { userSelfAuthority } from '@/services/user';
import { useModel } from 'umi';

export const useUser = () => {
  const { setInitialState, initialState } = useModel('@@initialState');

  const setUser = useCallback(async (user = initialState) => {
    const res = await userSelfAuthority({ client: initialState?.gqlClient });
    const auth =
      (res?.data?.[0]?.authorities ?? [])?.map((it: any, i: number) => ({
        id: it.id,
        name: it.name,
        level: it.level ?? 1,
        description: it.description,
        parentId: it.parent?.id,
        path: it.path,
        method: it.method,
        RdSysRolePermission: { id: 997 + i + 1, permissionId: it.id, roleId: 1 },
      })) ?? [];
    localStorage.setItem('authority', JSON.stringify(auth));
    localStorage.setItem(
      'userLogins',
      JSON.stringify({ ...(user?.currentUser ?? {}), authority: auth }),
    );
    setInitialState({
      ...user,
      currentUser: { ...user?.currentUser, authority: auth },
    });
  }, []);

  return { setUser };
};
