/*
 * @Description: 项目度量指标 - 明细
 * @Author: jieTan
 * @Date: 2021-12-21 09:53:05
 * @LastEditTime: 2021-12-21 10:11:44
 * @LastEditors: jieTan
 * @LastModify:
 */

import { PageContainer } from '@ant-design/pro-layout';

export default (props: any) => {
  /* 变量定义 */

  /* 数据处理 */

  /* DOM绘制 */
  return (
    <>
      <PageContainer title="指标明细">
        此处绘制项目[{props.location.query.id}]指标明细的数据！ 待实现......
      </PageContainer>
    </>
  );
};
