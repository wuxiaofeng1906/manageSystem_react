const initConfig = {
  nodeName: '发起人',
  type: 0,
  conditionList: {},
  nodeUserList: [
    {
      id: '00001',
      name: '张三',
    },
  ],
  childNode: {
    nodeName: '审核人',
    error: false,
    type: 1,
    childNode: {
      nodeName: '路由',
      type: 4,
      conditionList: {},
      nodeUserList: [],
      childNode: {
        nodeName: '抄送人',
        type: 2,
        ccSelfSelectFlag: 1,
        childNode: null,
        nodeUserList: [],
        error: false,
      },
      conditionNodes: [
        {
          nodeName: '条件1',
          type: 3,
          conditionList: {},
          nodeUserList: [
            {
              id: 85,
              type: 1,
              name: '天李四旭',
            },
          ],
          childNode: {
            nodeName: '审核人',
            type: 1,
            conditionList: {},
            nodeUserList: [
              {
                id: 2515744,
                name: '哈哈哈哈',
              },
            ],
            childNode: null,
            conditionNodes: [],
            error: false,
          },
          conditionNodes: [],
          error: false,
        },
        {
          nodeName: '条件2',
          type: 3,
          conditionList: {},
          nodeUserList: [],
          childNode: null,
          conditionNodes: [],
          error: false,
        },
      ],
    },
    rule: '1',
    nodeUserList: [],
    conditionList: {},
  },
  conditionNodes: [],
};
export { initConfig };
