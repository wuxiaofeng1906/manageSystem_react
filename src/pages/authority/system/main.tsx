import React, {useEffect, useState} from 'react';
import {getHeight} from '@/publicMethods/pageSet';
import {PageContainer} from "@ant-design/pro-layout";
import {
  LockTwoTone,
  IdcardTwoTone,
  EditTwoTone,
  DeleteTwoTone,
  FolderAddTwoTone, ReloadOutlined
} from '@ant-design/icons';

import {Table, Space, Button, Tooltip, message, Modal, Form, Input, Spin} from 'antd';
import axios from "axios";
import {history} from "@@/core/history";
import {GqlClient, useGqlClient} from "@/hooks";
import {useRequest} from "ahooks";
import {judgeAuthority} from "@/publicMethods/authorityJudge";


const authorityClick = (params: any) => {
  history.push(`/authority/autority_details?groupid=${params.groupId}&groupname=${params.groupName}`);
};

const memberClick = (params: any) => {
  history.push(`/authority/user?groupid=${params.groupId}&groupname=${params.groupName}`);

};

const analAuthGroup = (params: any) => {
  const data = Array();

  for (let index = 0; index < params.length; index += 1) {
    const details = {
      id: index + 1,
      groupId: params[index].id,
      groupName: params[index].name,
      describe: params[index].description,
      userList: "",
    };

    const userlist = params[index].users;
    let userString: string = "";
    userlist.forEach((user: any) => {
      userString = userString === "" ? user.userName : `${user.userName}，${userString}`;
    });
    details.userList = userString;
    data.push(details);
  }

  return data;
};

const queryAuthGroupViews = async (client: GqlClient<object>) => {

  const {data} = await client.query(`
    {
      roleGroup {
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

  return analAuthGroup(data?.roleGroup);
};

const Authority: React.FC<any> = () => {

  const sys_accessToken = localStorage.getItem("accessId");
  axios.defaults.headers['Authorization'] = `Bearer ${sys_accessToken}`;

  /* region 数据查询 */
  const [tableData, setTableData] = useState([]);

  const gqlClient = useGqlClient();
  const {data}: any = useRequest(() => queryAuthGroupViews(gqlClient));

  const updateGrid = async () => {
    const datas: any = await queryAuthGroupViews(gqlClient);
    setTableData(datas);
  };

  /* endregion */

  /* region 新增/修改组 */
  const [formForAddAndModify] = Form.useForm();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [groupTitle, setGroupTitle] = useState({title: '新增分组'});

  const addGroup = () => {
    setGroupTitle({title: '新增分组'});
    formForAddAndModify.setFieldsValue({
      groupName: '',
      groupDesc: ''
    });
    setIsAddModalVisible(true);
  };

  const editClick = (params: any) => {
    setGroupTitle({title: '编辑分组'});
    formForAddAndModify.setFieldsValue({
      groupName: params.groupName,
      groupDesc: params.describe,
      groupId: params.groupId,
      oldGroupName: params.groupName
    });
    setIsAddModalVisible(true);
  };

  const addCancel = () => {
    setIsAddModalVisible(false);
  };

  // 确定保存
  const confirmAdd = () => {
    // 获取数据
    const groupInfo = formForAddAndModify.getFieldsValue();
    if (groupInfo.groupName === "" || groupInfo.groupName === undefined) {
      message.error({
        content: `分组名称不能为空！`,
        duration: 1,
        style: {
          marginTop: '50vh',
        },
      });
      return;
    }

    // 判断组名是否为空
    if (groupTitle.title === '新增分组') {
      const groupInfos = {
        "roleName": groupInfo.groupName,
        "roleDesc": groupInfo.groupDesc
      };
      axios
        .post('/api/role', groupInfos)
        .then(function (res) {

          if (res.data.ok === true) {
            setIsAddModalVisible(false);
            updateGrid();
            message.info({
              content: "新增分组成功！",
              duration: 1,
              style: {
                marginTop: '50vh',
              },
            });
          } else if (Number(res.data.code) === 403) {
            message.error({
              content: "您无新增权限！",
              duration: 1,
              style: {
                marginTop: '50vh',
              },
            });
          } else {
            message.error({
              content: res.data.message,
              duration: 1,
              style: {
                marginTop: '50vh',
              },
            });
          }
        })
        .catch(function (error) {
          if (error.toString().includes("403")) {
            message.error({
              content: "您无新增权限！",
              duration: 1,
              style: {
                marginTop: '50vh',
              },
            });
          } else {
            message.error({
              content: `异常信息:${error.toString()}`,
              duration: 1,
              style: {
                marginTop: '50vh',
              },
            });
          }

        });

    } else {

      const groupInfos = Object();
      if (groupInfo.oldGroupName !== groupInfo.groupName) {  // 新旧组名一致，则组名字段不进行上传
        groupInfos.roleName = groupInfo.groupName;
      }
      groupInfos.roleDesc = groupInfo.groupDesc;

      axios.put(`/api/role/${groupInfo.groupId}`, groupInfos)
        .then(function (res) {
          if (res.data.ok === true) {
            setIsAddModalVisible(false);
            updateGrid();
            message.info({
              content: "组名修改成功！",
              duration: 1,
              style: {
                marginTop: '50vh',
              },
            });
          } else if (Number(res.data.code) === 403) {
            message.info({
              content: "您无修改权限！",
              duration: 1,
              style: {
                marginTop: '50vh',
              },
            });
          } else {
            message.error({
              content: `${res.data.message}`,
              duration: 1,
              style: {
                marginTop: '50vh',
              },
            });
          }
        })
        .catch(function (error) {
          if (error.toString().includes("403")) {
            message.info({
              content: "您无修改权限！",
              duration: 1,
              style: {
                marginTop: '50vh',
              },
            });
          } else {
            message.error({
              content: `异常信息：${error.toString()}`,
              duration: 1,
              style: {
                marginTop: '50vh',
              },
            });
          }

        });
    }
  };
  /* endregion 删除组 */

  /* region 删除组 */
  const [formForDel] = Form.useForm();
  const [isdelModalVisible, setIsDelModalVisible] = useState(false);

  // 删除组

  // 点击删除按钮
  const deleteClick = (params: any) => {

    formForDel.setFieldsValue({
      groupId: params.groupId
    });
    setIsDelModalVisible(true);
  };

  // 取消删除
  const DelCancel = () => {
    setIsDelModalVisible(false);
  };

  // 确定删除
  const delGroup = () => {
    const groupInfo = formForDel.getFieldsValue();

    axios
      .delete(`/api/role/${groupInfo.groupId}`)
      .then(function (res) {
        if (res.data.ok === true) {
          setIsDelModalVisible(false);
          updateGrid();
          message.info({
            content: "组名删除成功！",
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        } else if (Number(res.data.code) === 403) {
          message.error({
            content: "您删除权限！",
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        } else {
          message.error({
            content: `${res.data.message}`,
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        }
      })
      .catch(function (error) {
        if (error.toString().includes("403")) {
          message.error({
            content: "您删除权限！",
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        } else {
          message.error({
            content: `异常信息：${error.toString()}`,
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        }

      });
  };

  /* endregion */

  /* region 刷新同步企业微信人员 */
  const [refreshState, setRefreshState] = useState(false);
  const refreshDeptUsers = async () => {
    setRefreshState(true);
    await axios.post('/api/project/system/sync/wechat/all')
      .then(function (res) {
        if (res.data.ok === true) {
          message.info({
            content: "人员数据刷新成功！",
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });

        } else {
          message.error({
            content: `错误：${res.data.message}`,
            duration: 1,
            style: {
              marginTop: '50vh',
            },
          });
        }
      })
      .catch(function (error) {
        message.error({
          content: `异常信息:${error.toString()}`,
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      });
    setRefreshState(false);
  };

  /* endregion */
  const columns = [
    {
      title: <span style={{fontWeight: "bold", fontSize: "17px"}}> 编号</span>,
      dataIndex: 'id',
      key: 'id',
      width: 60
    },
    {
      title: <span style={{fontWeight: "bold", fontSize: "17px"}}> 组名</span>,
      dataIndex: 'groupName',
      key: 'groupName',
      width: 150
    },
    {
      title: <span style={{fontWeight: "bold", fontSize: "17px"}}> 描述</span>,
      dataIndex: 'describe',
      key: 'describe',
      width: 150
    },
    {
      title: <span style={{fontWeight: "bold", fontSize: "17px"}}> 用户列表</span>,
      dataIndex: 'userList',
      key: 'userList',
    },
    {
      title: <span style={{fontWeight: "bold", fontSize: "17px"}}> 操作</span>,
      key: 'action',
      width: 150,
      render: (text: any) => (

        <Space size="middle">

          <Tooltip title="权限维护">
            <Button shape="circle" icon={<LockTwoTone/>} onClick={() => authorityClick(text)}/>
          </Tooltip>
          <Tooltip title="成员维护">
            <Button shape="circle" icon={<IdcardTwoTone/>} onClick={() => memberClick(text)}/>
          </Tooltip>
          <Tooltip title="编辑">
            <Button shape="circle" style={{display: judgeAuthority("修改权限组详情") === true ? "inline" : "none"}}
                    icon={<EditTwoTone/>} onClick={() => editClick(text)}/>
          </Tooltip>
          <Tooltip title="删除"
                   style={{marginTop: "100px"}}>
            <Button shape="circle" style={{display: judgeAuthority("修改权限组详情") === true ? "inline" : "none"}}
                    icon={<DeleteTwoTone/>} onClick={() => deleteClick(text)}/>
          </Tooltip>
        </Space>
      ),
    },
  ];

  useEffect(() => {

    setTableData(data);
  }, [data]);
  return (
    <PageContainer style={{height: getHeight(), backgroundColor: "#F2F2F2"}}>
      <Spin spinning={refreshState} tip="数据同步中..." size={"large"}>

        {/* 新增分组按钮 */}
        <div style={{width: "100%", height: "40px", background: 'white'}}>

          <Button type="text"
                  style={{
                    color: '#1890FF',
                    float: 'right',
                    display: judgeAuthority("增加权限组") === true ? "inline" : "none"
                  }}
                  icon={<FolderAddTwoTone/>}
                  size={'large'} onClick={addGroup}>新增分组</Button>


          <Button type="text" icon={<ReloadOutlined/>} onClick={refreshDeptUsers} size={'large'}
                  style={{float: "right"}}>刷新</Button>

        </div>
        {/* 表格控件 */}
        <div>

          <Table columns={columns}
                 dataSource={tableData}
                 pagination={false}  // 禁止分页
                 size="small"  // 紧凑型
                 bordered={true}
          />
        </div>
      </Spin>
      {/* 弹出层集合 */}
      <div>

        {/* 组的新增和修改 */}
        <Modal
          title={groupTitle.title}
          visible={isAddModalVisible}
          onCancel={addCancel}
          centered={true}
          footer={null}
          width={500}
        >
          <Form form={formForAddAndModify}>
            <Form.Item name="groupName" label="分组名称:" rules={[{required: true}]}>
              <Input/>
            </Form.Item>
            <Form.Item name="groupDesc" label="分组描述:">
              <Input.TextArea/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" style={{marginLeft: '190px'}} onClick={confirmAdd}>
                保存
              </Button>
            </Form.Item>

            <Form.Item name="groupId" style={{display: "none", width: "32px", marginTop: "-55px", marginLeft: "270px"}}>
              <Input/>
            </Form.Item>
            <Form.Item name="oldGroupName"
                       style={{display: "none", width: "32px", marginTop: "-55px", marginLeft: "320px"}}>
              <Input/>
            </Form.Item>
          </Form>
        </Modal>

        {/* 组的删除 */}
        <Modal
          title={'删除组'}
          visible={isdelModalVisible}
          onCancel={DelCancel}
          centered={true}
          footer={null}
          width={400}
        >
          <Form form={formForDel}>
            <Form.Item>
              <label style={{marginLeft: '90px'}}>您确定删除该用户分组吗？</label>
            </Form.Item>

            <Form.Item>
              <Button type="primary" style={{marginLeft: '100px'}} onClick={delGroup}>
                确定
              </Button>
              <Button type="primary" style={{marginLeft: '20px'}} onClick={DelCancel}>
                取消
              </Button>
            </Form.Item>

            <Form.Item name="groupId" style={{display: "none", width: "32px", marginTop: "-55px", marginLeft: "270px"}}>
              <Input/>
            </Form.Item>
          </Form>
        </Modal>
      </div>

    </PageContainer>
  );
};
export default Authority;
