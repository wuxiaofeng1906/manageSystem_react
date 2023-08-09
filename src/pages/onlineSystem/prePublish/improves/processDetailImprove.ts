import { FormInstance } from 'antd';

/* table选中项变化时,更新checkbox */
export const modifyCheckboxOnTableSelectedChange = (
  form: FormInstance<any>,
  envAppServers: string[],
  selectedApps: string[],
  setFuncsRecord: Partial<Record<'setCheckedList' | 'setSelectedProjApps', Function>>,
) => {
  const uniqueApps: string[] = [];
  for (const _app of selectedApps) {
    if (uniqueApps.includes(_app)) continue;
    if (!envAppServers.includes(_app)) continue;
    uniqueApps.push(_app);
  }
  if (setFuncsRecord.setSelectedProjApps) setFuncsRecord.setSelectedProjApps(uniqueApps);
  if (setFuncsRecord.setCheckedList) setFuncsRecord.setCheckedList(uniqueApps);
  form.setFieldsValue({ app_services: uniqueApps });
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
