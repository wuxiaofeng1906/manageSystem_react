/*
 * @Description: 过程质量
 * @Author: jieTan
 * @Date: 2021-11-19 17:37:56
 * @LastEditTime: 2021-11-19 18:15:28
 * @LastEditors: jieTan
 * @LastModify: 
 */

import { Select } from "antd"
import { PageContainer } from "@ant-design/pro-layout"
import ProCard from '@ant-design/pro-card';
// import { AgGridColumn, AgGridReact } from "ag-grid-react";

const { Option } = Select;

export default () => {
    /* 变量定义 */

    /* 数据处理 */

    /* DOM绘制 */
    return (
        <PageContainer>
            <ProCard direction="column" gutter={[0, 2]}>
                <Select defaultValue="lucy" style={{ width: 200 }} onChange={() => { }}>
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="Yiminghe">yiminghe</Option>
                </Select>
            </ProCard>
        </PageContainer>
    )
}
