/*
 * @Description: 项目度量指标 - 概览
 * @Author: jieTan
 * @Date: 2021-11-19 17:37:56
 * @LastEditTime: 2021-12-22 10:32:24
 * @LastEditors: jieTan
 * @LastModify:
 */

import { PageContainer } from '@ant-design/pro-layout';
import Selector from './Selector';
import TableList from './TableList';
import KpiCheckBox from './KpiCheckBox';

export default () => {
  /* 变量定义 */

  /* 数据处理 */

  /* DOM绘制 */
  return (
    <>
      <PageContainer title="指标概览" subTitle={<KpiCheckBox />}>
        <Selector />
      </PageContainer>
      <TableList />
    </>
  );
};
