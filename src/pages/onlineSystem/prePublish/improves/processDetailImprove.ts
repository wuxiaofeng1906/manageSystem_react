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
  //
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

/* table移除选中的数据 */
const getRemoveDataOfTableSelected = <T extends { apps: string }>(
  prevSelectedRows: T[],
  currSelectedRows: T[],
  envAppServices: string[],
  prevCheckList: string[],
) => {
  // list to map
  const prevSelectedMap: Map<string, T> = new Map(
    prevSelectedRows.map((item: any) => [`${item.story}${item.pro_id}`, item]),
  );
  const currSelectedMap: Map<string, T> = new Map(
    currSelectedRows.map((item: any) => [`${item.story}${item.pro_id}`, item]),
  );
  // find diff
  const removedApps: string[] = [];
  const alreadyExistApps: string[] = [];
  for (const [k, item] of prevSelectedMap.entries()) {
    if (!currSelectedMap.get(k)) {
      removedApps.push(...item.apps.split(',')?.filter((app) => envAppServices.includes(app)));
      continue;
    }
    alreadyExistApps.push(...item.apps.split(',')?.filter((app) => envAppServices.includes(app)));
  }
  // generate new checklist apps
  const newCheckedApps: string[] = [];
  for (const prevCheckedApp of prevCheckList) {
    if (removedApps.includes(prevCheckedApp) && !alreadyExistApps.includes(prevCheckedApp))
      continue;
    newCheckedApps.push(prevCheckedApp);
  }

  return Array.from(new Set(newCheckedApps));
};

/* table新增选中的数据 */
const getAddDataOfTableSelected = <T extends { apps: string }>(
  prevSelectedRows: T[],
  currSelectedRows: T[],
  envAppServices: string[],
  prevCheckList: string[],
) => {
  // list to map
  const prevSelectedMap: Map<string, T> = new Map(
    prevSelectedRows.map((item: any) => [`${item.story}${item.pro_id}`, item]),
  );
  const currSelectedMap: Map<string, T> = new Map(
    currSelectedRows.map((item: any) => [`${item.story}${item.pro_id}`, item]),
  );
  // find diff
  const addedApps: string[] = [];
  for (const [k, item] of currSelectedMap.entries()) {
    if (prevSelectedMap.get(k)) continue;
    addedApps.push(
      ...item.apps
        .split(',')
        ?.filter((app) => envAppServices.includes(app) && !prevCheckList.includes(app)),
    );
  }

  return Array.from(new Set([...prevCheckList, ...addedApps]));
};

/* table选中项改变时 */
export const onTableCheckboxChange = (props: any) => {
  const prevSelectedRows = [...props.selected];
  const isRemoveAction = prevSelectedRows.length > props.selectedRows.length;
  // 更新选中项
  props.setSelected(props.selectedRows);
  //
  const releaseEnvType = props.form.getFieldValue('release_env_type');
  if (!releaseEnvType) return;
  const envAppServices = props.appServers?.[releaseEnvType] ?? [];
  const selectedApps: string[] = [];
  for (const item of props.selectedRows) selectedApps.push(...item.apps.split(','));
  // 获取table选中前后的差异项
  const newCheckedApps = (
    isRemoveAction ? getRemoveDataOfTableSelected : getAddDataOfTableSelected
  )(prevSelectedRows, props.selectedRows, envAppServices, props.checkedList);
  // checkbox关联修改
  modifyCheckboxOnTableSelectedChange(
    props.form,
    envAppServices,
    selectedApps,
    {
      setCheckedList: props.setCheckedList,
    },
    Array.from(newCheckedApps),
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

/* 修改页 - table打开时, 默认勾选的选项判定 */
export const setSelectedRowsOnUpdateTableInitOpen = (
  sourceDatas: any[],
  checkList: string[] = [],
) => {
  if (!sourceDatas || sourceDatas.length === 0) return [];
  //
  const selectedList: string[] = [];
  for (const da of sourceDatas) {
    const apps = da.apps.split(',');
    let isNeedToBeSelected = false;
    for (const app of apps)
      if (checkList.includes(app)) {
        isNeedToBeSelected = true;
        break;
      }
    if (isNeedToBeSelected) selectedList.push(`${da.story}&${da.pro_id}`);
  }

  return selectedList;
};
