/*
 * @Description: 过程质量
 * @Author: jieTan
 * @Date: 2021-11-19 17:37:56
 * @LastEditTime: 2021-12-16 12:22:20
 * @LastEditors: jieTan
 * @LastModify: 
 */

import { PageContainer } from "@ant-design/pro-layout"
import ProCard from '@ant-design/pro-card';
import Selector from "./Selector";
import TableList from "./TableList";

export default () => {
    /* 变量定义 */

    /* 数据处理 */

    /* DOM绘制 */
    return (
        <PageContainer>
            <ProCard direction="column" ghost gutter={[0, 2]}>
                <ProCard bordered><Selector /></ProCard>
                <ProCard bordered><TableList /></ProCard>
            </ProCard>
        </PageContainer>
    )
}
