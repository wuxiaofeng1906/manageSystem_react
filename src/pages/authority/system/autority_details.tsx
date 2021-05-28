import React, {useState} from 'react';
import {getHeight} from '@/publicMethods/pageSet';
import {PageContainer} from "@ant-design/pro-layout";
import {Table, Space, Button, Checkbox} from 'antd';
import {history} from "@@/core/history";

const CheckboxGroup = Checkbox.Group;


// 组件初始化
const AuthorityDetails: React.FC<any> = () => {
  let pageTitle: string = '';
  const location = history.location.query;
  if (location !== null && location !== undefined && location.groupname !== undefined && location.groupname !== null) {
    pageTitle = location.groupname.toString();
  }

  // 测试数据
  const datas = [
    {id: 1, module: "首页", method: ['功能一']},
    {id: 2, module: "我的地盘", method: ['功能二', '功能三']},
    {id: 3, module: "代办", method: ['功能四', '功能五', '功能六']}
  ];


  /* region 全选功能 */
  const [checkedList, setCheckedList] = useState(['']);
  const [checkAll, setCheckAll] = useState(false);
  // 所有功能全选
  const selectAll = (params: any) => {
    if (params.target.checked === true) {

      setCheckAll(true);
      setCheckedList(['功能一', '功能二', '功能三', '功能四', '功能五', '功能六']);
    } else {
      setCheckAll(false);
      setCheckedList([]);
    }
  };

  /* endregion */

  // 模块勾选动作
  const onModuleChange = (params: any) => {
    console.log(params);

    // console.log('checked = ', e.target.checked);
    // this.setState({
    //   checked: e.target.checked,
    // });
  };

  // 功能勾选动作
  const onMethodChange = (params: any) => {

    // 获取原有的所有数据，勾选的时候新增，去掉勾选的时候删除

    debugger;
    console.log(params);

    setCheckedList([params[0].toString()]);
  };

  const columns = [
    {
      title: <span style={{fontWeight: "bold", fontSize: "17px"}}> 编号</span>,
      dataIndex: 'id',
      key: 'id',
      width: 60
    },
    {
      title: <span style={{fontWeight: "bold", fontSize: "17px"}}> 模块</span>,
      key: 'module',
      width: 200,
      render: (text: any) => (
        <Space size="middle">
          <Checkbox checked={false} onChange={() => onModuleChange(text)}>
            {text.module}
          </Checkbox>
        </Space>
      ),
    },
    {
      title: <span style={{fontWeight: "bold", fontSize: "17px"}}> 方法</span>,
      key: 'method',
      render: (text: any) => (
        <Space size="middle">
          <CheckboxGroup options={text.method} value={checkedList} onChange={onMethodChange}/>
        </Space>
      ),
    },
  ];

  // 保存权限按钮
  const saveAuthority = () => {
    console.log("保存权限");
  };

  // 点击返回按钮
  const returns = () => {
    history.push(`/authority/main`);
  };


  return (
    <PageContainer title={pageTitle} style={{height: getHeight(), backgroundColor: "#F2F2F2"}}>
      {/* 表格控件 */}
      <div>
        <Table columns={columns}
               dataSource={datas}
               pagination={false}  // 禁止分页
               size="small"  // 紧凑型
               bordered={true}
               summary={() => (
                 <Table.Summary.Row>
                   <Table.Summary.Cell index={0}>4</Table.Summary.Cell>
                   <Table.Summary.Cell index={1}>
                     <Checkbox checked={checkAll} onChange={selectAll}>全选</Checkbox>
                   </Table.Summary.Cell>
                   <Table.Summary.Cell index={2}>
                     <div><Button type="primary" onClick={saveAuthority}> 保存 </Button> <Button
                       onClick={returns}> 返回 </Button></div>
                   </Table.Summary.Cell>
                 </Table.Summary.Row>
               )}
        />
      </div>
    </PageContainer>
  );
};

export default AuthorityDetails;
