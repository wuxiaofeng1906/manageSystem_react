// 工单信息
const getWorkOrderColumns = () => {
  const firstListColumn: any = [
    {
      headerName: '序号',
      field: 'No',
      minWidth: 65,
      maxWidth: 70,
      cellRenderer: (params: any) => {
        return Number(params.node.id) + 1;
      },
    },
    {
      headerName: '工单类型',
      field: 'repair_order_type',
    },
    {
      headerName: '工单编号',
      field: 'repair_order_num',
    },
    {
      headerName: '审批名称',
      field: 'approval_name',
    },
    {
      headerName: '审批说明',
      field: 'approval_instructions',
    },
    {
      headerName: '申请人',
      field: 'applicant_name',
    },
    {
      headerName: '创建时间',
      field: 'apply_create_time',
    },
    {
      headerName: '更新时间',
      field: 'apply_update_time',
    },
    {
      headerName: '工单状态',
      field: 'repair_order_status',
    },
    {
      headerName: '上步已审批人',
      field: 'before_approval_name',
      minWidth: 120,
    },
    {
      headerName: '当前待审批人',
      field: 'current_approval_name',
      minWidth: 120,
    },
  ];
  return firstListColumn;
};

export {getWorkOrderColumns}
