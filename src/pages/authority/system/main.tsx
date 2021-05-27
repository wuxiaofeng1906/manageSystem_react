import React, {useState} from 'react';
// import {useRequest} from 'ahooks';
// import {GqlClient, useGqlClient} from '@/hooks';
import {getHeight} from '@/publicMethods/pageSet';
import {PageContainer} from "@ant-design/pro-layout";
import {
  LockTwoTone,
  IdcardTwoTone,
  EditTwoTone,
  DeleteTwoTone,
  FolderAddTwoTone
} from '@ant-design/icons';

import {Table, Space, Button, Tooltip, message, Modal, Form, Input} from 'antd';
import axios from "axios";

const authorityClick = (params: any) => {
  console.log("权限维护：", params);
  return "";
};

const memberClick = (params: any) => {
  console.log("成员维护：", params);
  return "";
};


const data = [
  {
    id: '1',
    groupName: '管理员',
    describe: '系统管理员',
    userList: '陈欢，胡玉，何江，谭杰，吴晓凤',
  },
  {
    id: '2',
    groupName: '研发',
    describe: '研发人员',
    userList: '邬波，那超，陈楷，王东帆，李昕宇，李小雷，胡小雯，丁鑫，欧兴扬，时新威，朱秀杰，刘学斌，张学鹏，贾洋，张燕茹，任毅，周毅，黄义森，杨小美，龙喻，刘云鹏，陈泽鹏，赵增辉，陈震华，郎志强，杨志强，许智远，王濯'
  }, {
    id: '3',
    groupName: '测试',
    describe: '测试人员',
    userList: '刘潮，徐超，胡志立，谭国治，王鹄，左江令，邓九洲，袁俊，胡李，冯林，周丽莎，刘梦，张倩，孟庆双，龚蓉蓉，罗天刚，自动化测试账号，陈雯静，帅霞，吴小兰，董绪瀚，徐睿，焦艳秋，赵宇飞，余志强，冯紫琳'
  }, {
    id: '4',
    groupName: '项目经理',
    describe: '项目经理',
    userList: '黄朝阳，曾晨，陈锴，王东帆，李昕宇，闫坤杰，郭俊，何羽，胡敬华，唐力，袁烈权，刘黎明，罗林，欧治成，任航，蒲姣，杨期成，吴生祥，雷远亮，郑江，蒋宗良，李小雷，欧兴扬，朱秀杰，刘学斌，张燕茹，任毅，杨小美，刘云鹏，赵增辉'
  },
];

// 组件初始化
const Authority: React.FC<any> = () => {
  // 删除提醒表单

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
      groupDesc: params.describe
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
      console.log("调用新增接口");
    } else {
      console.log("调用修改接口");
    }
  };
  /* endregion 删除组 */

  /* region 删除组 */
  const [formForDel] = Form.useForm();
  const [isdelModalVisible, setIsDelModalVisible] = useState(false);

  // 删除组

  // 点击删除按钮
  const deleteClick = (params: any) => {
    console.log("删除：", params);
    setIsDelModalVisible(true);
  };

  // 取消删除
  const DelCancel = () => {
    setIsDelModalVisible(false);
  };

  // 确定删除
  const delGroup = () => {

    const url = ``;
    axios
      .delete(url)
      .then(function (res) {
        if (res.data.ok === true) {
          setIsDelModalVisible(false);
          message.info({
            content: res.data.message,
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
        message.error({
          content: error.toString(),
          duration: 1,
          style: {
            marginTop: '50vh',
          },
        });
      });
  };

  /* endregion */


  const columns = [
    {
      title: <span style={{fontWeight: "bold", fontSize: "16px"}}> 编号</span>,
      dataIndex: 'id',
      key: 'id',
      width: 50
    },
    {
      title: <span style={{fontWeight: "bold", fontSize: "16px"}}> 组名</span>,
      dataIndex: 'groupName',
      key: 'groupName',
      width: 50
    },
    {
      title: <span style={{fontWeight: "bold", fontSize: "16px"}}> 描述</span>,
      dataIndex: 'describe',
      key: 'describe',
      width: 50
    },
    {
      title: <span style={{fontWeight: "bold", fontSize: "16px"}}> 用户列表</span>,
      dataIndex: 'userList',
      key: 'userList',
    },
    {
      title: <span style={{fontWeight: "bold", fontSize: "16px"}}> 操作</span>,
      key: 'action',
      // fixed: 'right',
      render: (text: any) => (

        <Space size="middle">

          <Tooltip title="权限维护">
            <Button shape="circle" icon={<LockTwoTone/>} onClick={() => authorityClick(text)}/>
          </Tooltip>
          <Tooltip title="成员维护">
            <Button shape="circle" icon={<IdcardTwoTone/>} onClick={() => memberClick(text)}/>
          </Tooltip>
          <Tooltip title="编辑">
            <Button shape="circle" icon={<EditTwoTone/>} onClick={() => editClick(text)}/>
          </Tooltip>
          <Tooltip title="删除" style={{marginTop: "100px"}}>
            <Button shape="circle" icon={<DeleteTwoTone/>} onClick={() => deleteClick(text)}/>
          </Tooltip>
        </Space>
      ),
    },
  ];
  return (
    <PageContainer style={{height: getHeight(), backgroundColor: "#F2F2F2"}}>
      {/* 新增分组按钮 */}
      <div style={{width: "100%", height: "40px", background: 'white'}}>
        <Button></Button>
        <Button type="text" style={{color: '#1890FF', float: 'right'}} icon={<FolderAddTwoTone/>}
                size={'large'} onClick={addGroup}>新增分组</Button>
      </div>
      {/* 表格控件 */}
      <div>

        <Table columns={columns}
               dataSource={data}
               pagination={false}  // 禁止分页
               size="small"  // 紧凑型
        />
      </div>

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
              <Button type="primary" style={{marginLeft: '200px'}} onClick={confirmAdd}>
                保存
              </Button>

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
          </Form>
        </Modal>
      </div>

    </PageContainer>
  );
};
export default Authority;
