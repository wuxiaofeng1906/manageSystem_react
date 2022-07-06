import { useCallback } from 'react';
import { useGqlClient } from '@/hooks/index';
// 统计
export type staticBy = 'year' | 'quarter' | 'month' | 'week';
export const useStatistic = () => {
  const gqlClient = useGqlClient();
  const handleStaticBy = useCallback(
    async (gridRef, weekColumn, queryFn, type: staticBy = 'week') => {
      gridRef.current?.setColumnDefs([]);
      gridRef.current?.setColumnDefs(weekColumn);
      const datas: any = await queryFn(gqlClient, type);
      gridRef.current?.setRowData(datas);
    },
    [],
  );

  return { handleStaticBy };
};
