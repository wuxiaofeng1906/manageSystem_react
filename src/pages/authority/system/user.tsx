import React, {useState} from 'react';
import {getHeight} from '@/publicMethods/pageSet';
import {PageContainer} from "@ant-design/pro-layout";
import {Button, Checkbox, Row, Col, Tree} from 'antd';
import {history} from "@@/core/history";
import {DownOutlined} from "@ant-design/icons";

// 组件初始化
const UserDetails: React.FC<any> = () => {

  // region title获取
  let pageTitle: string = '';
  const location = history.location.query;
  if (location !== null && location !== undefined && location.groupname !== undefined && location.groupname !== null) {
    pageTitle = location.groupname.toString();
  }

  // endregion

  /* region 获取默认显示的人员和组 */
  const users = ['何江', '胡玉', '陈欢', '谭杰', '吴晓凤'];
  const groups = [
    {
      title: 'parent 1',
      key: '0-0',
      children: [
        {
          title: 'parent 1-0',
          key: '0-0-0',
          children: [
            {
              title: 'leaf',
              key: '0-0-0-0',
            },
            {
              title: 'leaf',
              key: '0-0-0-1',
            },
            {
              title: 'leaf',
              key: '0-0-0-2',
            },
          ],
        },
        {
          title: 'parent 1-1',
          key: '0-0-1',
          children: [
            {
              title: 'leaf',
              key: '0-0-1-0',
            },
          ],
        },
        {
          title: 'parent 1-2',
          key: '0-0-2',
          children: [
            {
              title: 'leaf',
              key: '0-0-2-0',
            },
            {
              title: 'leaf',
              key: '0-0-2-1',
            },
          ],
        },
      ],
    },
  ];

  const initSelectedUser = ['陈欢', '胡玉'];
  /* endregion */

  /* region 部门树选择事件 */
  const onSelect = (selectedKeys: any, info: any) => {
    console.log('selected', selectedKeys, info);
  };

  /* endregion */

  /* region 人员选择触发事件 */
  const [selectedUser, setSelectedUser] = useState(initSelectedUser);

  const userSelectChange = (checkedValues: any) => {
    // console.log('checked = ', checkedValues);

    setSelectedUser(checkedValues);
  };

  /* endregion */


  /* region 按钮点击事件 */
  const saveUsers = () => {
    history.push(`/authority/main`);
  };
  const returns = () => {
    history.push(`/authority/main`);
  };
  /* endregion */
  return (
    <PageContainer title={pageTitle} style={{height: window.innerHeight, backgroundColor: "white"}}>

      <div style={{height: getHeight()}}>

        <Row gutter={16}>
          {/* 部门tree */}
          <Col span={6}
               style={{backgroundColor: "white", boxShadow: '-2px -2px 0px 0px #F2F2F2,2px 2px 0px 0px #F2F2F2'}}>

            <div style={{marginTop: "5px"}}>
              <Tree
                showLine
                switcherIcon={<DownOutlined/>}
                // defaultExpandedKeys={['0-0-0']}
                defaultExpandAll={true}
                onSelect={onSelect}
                treeData={groups}
                // style={{boxShadow: '-2px -2px 0px 0px #F2F2F2,2px 2px 0px 0px #F2F2F2'}} // 左 上
              />
            </div>

          </Col>

          {/* 组内成员 */}
          <Col span={18}
               style={{backgroundColor: "white", boxShadow: '-2px -2px 0px 0px #F2F2F2,2px 2px 0px 0px #F2F2F2'}}>
            <div>
              <div>
                <Checkbox.Group options={users} value={selectedUser} onChange={userSelectChange}/>
              </div>
              {/* <div style={{position: "absolute", bottom: 0}}> */}
              <div style={{
                marginLeft: "-6px",
                width: "100%",
                boxShadow: '-2px -2px 0px 0px #F2F2F2,2px 2px 0px 0px #F2F2F2',
                marginTop: "50px",
                backgroundColor: "#F2F2F2",
                position: "absolute",
                bottom: 0
              }}>
                <Button style={{marginLeft: '40%'}} type="primary" onClick={saveUsers}> 保存 </Button>
                <Button style={{marginLeft: "30px"}} type="primary" onClick={returns}> 返回 </Button>
              </div>
            </div>

          </Col>
        </Row>

      </div>
    </PageContainer>
  );
};

export default UserDetails;
