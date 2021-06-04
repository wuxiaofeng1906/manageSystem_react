import React, {useEffect, useState} from 'react';
import {getHeight} from '@/publicMethods/pageSet';
import {PageContainer} from "@ant-design/pro-layout";
import {Button, Checkbox, Row, Col, Tree} from 'antd';
import {history} from "@@/core/history";
import {DownOutlined} from "@ant-design/icons";
import {GqlClient, useGqlClient} from "@/hooks";
import {useRequest} from "ahooks";

const queryDeptment = async (client: GqlClient<object>) => {
  const {data} = await client.query(`
      {

      }
  `);

  return data;
};

// 组里面已存在的有权限的成员
const alasSelectedUser = (oraDatas: any) => {
  const {users} = oraDatas[0];

  const seletecArray: any = [];
  users.forEach((user: any) => {
    seletecArray.push(user.userName);
  });

  return seletecArray;
};

const queryAuthUsers = async (client: GqlClient<object>, groupId: any) => {
  const {data} = await client.query(`
      {
        roleGroup (group:${groupId}){
          id,
          name,
          description,
          users{
            id,
            userName
          }
        }
      }
  `);
  return alasSelectedUser(data?.roleGroup);
};


const queryGroupAllUsers = async (client: GqlClient<object>, groupId: any) => {
  // const {data} = await client.query(`
  //     {
  //     }
  // `);
  // return data;

  return ['胡玉', '吴晓凤', '何江', '陈欢', '谭杰','哈哈'];
};


// 组件初始化
const UserDetails: React.FC<any> = () => {

  // region title获取
  let pageTitle: string = '';
  let groupId = 0;
  const location = history.location.query;

  if (location !== null && location !== undefined && location.groupname !== undefined && location.groupname !== null) {
    pageTitle = location.groupname.toString();
    groupId = location.groupid === null ? 0 : Number(location.groupid);
  }

  // endregion

  /* region 获取默认显示的人员和组 */
  const gqlClient = useGqlClient();
  // 查询部门组织架构
  // const {data} = useRequest(() => queryDeptment(gqlClient));
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

  // 查询组织架构对应的所有成员
  const allGroupMember: any = useRequest(() => queryGroupAllUsers(gqlClient, 1)).data;

  // 查询已勾选的成员
  const initSelectedUser: any = useRequest(() => queryAuthUsers(gqlClient, groupId)).data;


  /* endregion */

  /* region 部门树选择事件 */

  const [allMember, setAllMember] = useState(['']);

  const onSelect = async (selectedKeys: any, info: any) => {
    console.log('selected', selectedKeys, info);
    const deptMember = await queryGroupAllUsers(gqlClient, 1);
    setAllMember(deptMember);

  };

  /* endregion */

  /* region 人员选择触发事件 */
  const [selectedUser, setSelectedUser] = useState(['']);

  const userSelectChange = (checkedValues: any) => {
    setSelectedUser(checkedValues);
  };

  /* endregion */


  /* region 按钮点击事件 */
  const saveUsers = () => {
    // 保存人员
  };
  const returns = () => {
    history.push(`/authority/main`);
  };
  /* endregion */

  useEffect(() => {
    setAllMember(allGroupMember);
    setSelectedUser(initSelectedUser);
  }, [initSelectedUser]);
  return (
    <PageContainer title={pageTitle} style={{height: window.innerHeight, backgroundColor: "white"}}>

      <div style={{height: getHeight()}}>

        <Row gutter={16}>
          {/* 部门tree */}
          <Col span={6}
               style={{backgroundColor: "white"}}>

            <div>
              <Tree
                showLine
                switcherIcon={<DownOutlined/>}
                defaultExpandAll={true}
                onSelect={onSelect}
                treeData={groups}
                style={{boxShadow: '-2px -2px 0px 0px #F2F2F2,2px 2px 0px 0px #F2F2F2'}} // 左 上
              />
            </div>

          </Col>

          {/* 组内成员 */}
          <Col span={18}
               style={{backgroundColor: "white", boxShadow: '-2px -2px 0px 0px #F2F2F2,2px 2px 0px 0px #F2F2F2'}}>
            <div>
              <div>
                <Checkbox.Group options={allMember} value={selectedUser} onChange={userSelectChange}/>
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
