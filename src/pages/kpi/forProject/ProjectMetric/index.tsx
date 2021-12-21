/*
 * @Description: 项目度量指标 - 概览
 * @Author: jieTan
 * @Date: 2021-11-19 17:37:56
 * @LastEditTime: 2021-12-21 09:56:03
 * @LastEditors: jieTan
 * @LastModify:
 */

import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import Selector from './Selector';
import TableList from './TableList';
import KpiCheckBox from './KpiCheckBox';

export default () => {
  /* 变量定义 */

  /* 数据处理 */

  /* DOM绘制 */
  return (
    <>
      <PageContainer style={{ marginBottom: 4 }} title="指标概览">
        <ProCard>
          <Selector />
          <br />
          <KpiCheckBox />
        </ProCard>
      </PageContainer>
      <TableList />
    </>
  );
};
