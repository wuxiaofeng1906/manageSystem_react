// treeSelect 默认参数
const defaultTreeSelectParams: any = {
  showArrow: true,
  treeDefaultExpandAll:true,
  allowClear: 'allowClear',
  placeholder: '默认选择全部',
  multiple: 'multiple',
  dropdownStyle: {maxHeight: 400, overflow: 'auto'},
  treeCheckable: true,
  maxTagCount: 'responsive',
  showCheckedStrategy: 'SHOW_PARENT',
  filterTreeNode: (inputValue: string, treeNode: any) =>
    !!treeNode.title.includes(inputValue), // 返回true or false
};

export default defaultTreeSelectParams;
