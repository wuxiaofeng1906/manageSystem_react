/*
 * @Description:
 * @Author: jieTan
 * @Date: 2021-12-28 10:07:16
 * @LastEditTime: 2021-12-29 10:00:52
 * @LastEditors: jieTan
 * @LastModify:
 */
import { toTree } from '../utils/tree';

/**
 * @description - 获取所有项目信息
 * @author JieTan
 * @date 2021/11/30 11:11:14
 * @param {{ project: { id: string; name: string } }[]} datas - 待解析的源数据
 * @param {Function} setState - 修改相应state值的函数
 * @param {any[]} selectDepts - 当前被选中的项目ID列表
 * @returns {*} {*}
 */
export const projOptsElems = (
  datas: { project: { id: string; name: string } }[],
  setState: Function,
  selectDepts: any[], // 当前被选中的项目ID列表
): any => {
  setState((prev: any[]) => {
    // 规避先选择项目，后选择部门导致的tag失效的问题
    if (datas.length === 0 && selectDepts.length !== 0 && prev)
      return prev.map((d) => ({
        title: d.title,
        value: d.value,
        key: d.key,
      }));

    //
    return datas.map((d) => ({
      title: d.project.name,
      value: d.project.id,
      key: d.project.id,
    }));
  });
};

/**
 * @description -
 * @author JieTan
 * @date 2021/12/01 17:12:33
 * @param {*} data
 * @param {any[]} val
 * @param {Function} setVal
 * @returns {*}  {void}
 */
export const deptTreeNodes = (data: any, val: any[], setVal: Function): void => {
  if (val.length !== 0) return;
  const ret = toTree(data?.organization, 'id', 'parent', [
    ['name', 'title'],
    ['id', 'value'],
  ])
    ?.shift()
    ?.children?.shift();
  setVal(ret ? [ret as never] : []);
};

/**
 * @description - 多选时：<TreeSelect>的onChange事件的处理
 * @author JieTan
 * @date 2021/12/29 09:12:39
 * @param {string} values - 多选的值列表
 * @param {Function} setState - 更新查询参数
 * @param {string} item - 查询类别：[部门|项目]
 * @returns {*} {boolean}
 */
export const onTreeMultiChange = (values: string, setState: Function, item: string): boolean => {
  //
  setState((prev: any) =>
    Object.assign(
      { ...prev },
      {
        [item]: values,
        doQuery: prev[item].length > values.length ? true : false, // 添加时不查询，移除时查询
      },
    ),
  );
  //
  return true;
};
