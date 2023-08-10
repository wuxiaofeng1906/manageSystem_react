import { FormInstance } from 'antd';

/* table选中项变化时,更新checkbox */
export const modifyCheckboxOnTableSelectedChange = (
  form: FormInstance<any>,
  envAppServices: string[],
  selectedApps: string[],
  setFuncsRecord: Partial<Record<'setCheckedList' | 'setSelectedProjApps', Function>>,
  checkedAppServices?: string[],
) => {
  const uniqueApps: string[] = [];
  for (const _app of selectedApps) {
    if (uniqueApps.includes(_app)) continue;
    if (!envAppServices.includes(_app)) continue;
    uniqueApps.push(_app);
  }
  form.setFieldsValue({ app_services: checkedAppServices ?? uniqueApps });
  if (setFuncsRecord.setSelectedProjApps) setFuncsRecord.setSelectedProjApps(uniqueApps);
  if (setFuncsRecord.setCheckedList)
    setFuncsRecord.setCheckedList(checkedAppServices ?? uniqueApps);
  if (uniqueApps.length === 0) form.validateFields(['app_services']); // 规避"setFieldsValue"操作后,验证失效的问题
};

/* checkbox变化时,更新table中的选中项 */
export const modifyTableSelectedOnCheckboxChange = (
  form: FormInstance<any>,
  checkedValues: any[],
  dataList: any[],
  setFuncsRecord: Partial<Record<'setCheckedList' | 'setSelected', Function>>,
) => {
  const selectedList: any[] = [];
  for (const da of dataList) {
    if (da.disabled) continue;
    const app_services = da.apps.split(',');
    for (const checkedVal of checkedValues)
      if (app_services.includes(checkedVal)) {
        selectedList.push(da);
        break;
      }
  }
  //
  form.setFieldsValue({ app_services: checkedValues });
  if (setFuncsRecord.setCheckedList) setFuncsRecord.setCheckedList(checkedValues);
  if (setFuncsRecord.setSelected) setFuncsRecord.setSelected(selectedList);
  if (checkedValues.length === 0) form.validateFields(['app_services']); // 规避"setFieldsValue"操作后,验证失效的问题
};

/* table选中项改变时 */
export const onTableCheckboxChange = (props: any) => {
  // 更新选中项
  props.setSelected(props.selectedRows);

  // checkbox关联修改
  const releaseEnvType = props.form.getFieldValue('release_env_type');
  if (!releaseEnvType) return;
  const selectedApps: string[] = [];
  for (const item of props.selectedRows) selectedApps.push(...item.apps.split(','));
  modifyCheckboxOnTableSelectedChange(
    props.form,
    props.appServers?.[releaseEnvType] ?? [],
    selectedApps,
    {
      setCheckedList: props.setCheckedList,
    },
  );
};

/* checkboxGroup选中项改变时 */
export const onFormCheckboxChange = (props: any) => {
  const dataList: any[] =
    props.checkedValues.length > (props.checkedList ?? []).length
      ? props.list // 增加时
      : props.selected; // 减少时
  modifyTableSelectedOnCheckboxChange(props.form, props.checkedValues, dataList, {
    setCheckedList: props.setCheckedList,
    setSelected: props.setSelected,
  });
};
