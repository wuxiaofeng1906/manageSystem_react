/*
 * @Description:
 * @Author: jieTan
 * @Date: 2021-12-28 10:07:16
 * @LastEditTime: 2021-12-28 10:07:16
 * @LastEditors: jieTan
 * @LastModify:
 */
import { Select } from 'antd';
const { Option } = Select;
import { toTree } from '../utils/tree';

/**
 * @description - 构建<Select>的<Option>元素
 * @author JieTan
 * @date 2021/11/30 11:11:15
 * @param {any[]} datas - 待解析的源数据
 * @param {string} valueKey - <Option>的value值
 * @param {string} textkey - <Option>的text值
 * @param {*} [target] - 从datas的target元素中取之
 * @returns {*}  {any[]} - 返回构建的<Option>数组元素
 */
const childrenElems = (datas: any[], valueKey: string, textkey: string, target?: any): any[] => {
  //
  const children: any[] = [];
  datas.map((da, i) => {
    const item = target ? da[target] : da;
    children.push(
      <Option key={i} value={`${item[valueKey]}`}>
        {item[textkey]}
      </Option>,
    );
  });
  //
  return children;
};

/**
 * @description - 获取所有项目信息
 * @author JieTan
 * @date 2021/11/30 11:11:14
 * @param {any[]} datas - 待解析的源数据
 * @param {*} val - 存储proj数据的state值
 * @param {Function} setVal - 修改相应state值的函数
 * @returns {*} {void}
 */
export const projOptsElems = (datas: any[], val: any, setVal: Function): void => {
  if (datas === undefined || val !== null) return;
  setVal(childrenElems(datas, 'id', 'name', 'project'));
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
