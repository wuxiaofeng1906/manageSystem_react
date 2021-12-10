/*
 * @Description: 按需加载项目指标数据
 * @Author: jieTan
 * @Date: 2021-12-08 17:53:12
 * @LastEditTime: 2021-12-10 16:17:55
 * @LastEditors: jieTan
 * @LastModify:
 */
import { Checkbox, Divider } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const CheckboxGroup = Checkbox.Group;

const plainOptions = ['Apple', 'Pear', 'Orange'];

export default () => {
  /*  */
  const [checkedList, setCheckedList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const { gqlData, setGqlData, pqCols, setPqCols } = useModel('projectMetric');

  /*  */
  const onChange = (list: any) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
  };

  const onCheckAllChange = (e: any) => {
    setCheckedList(e.target.checked ? (plainOptions as never[]) : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  /*  */
  return (
    <>
      <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
        Check all
      </Checkbox>
      <Divider type="vertical" />
      <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
    </>
  );
};
