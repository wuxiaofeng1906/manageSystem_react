import React, {useEffect} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {Card, Alert} from 'antd';
import {useIntl} from 'umi';
import {useModel} from "@@/plugin-model/useModel";


const getUsersInfo = (windowURL: any) => {
  let userCode = "";
  if (windowURL.indexOf("?") !== -1) {
    const firstGroup = windowURL.split("?"); // 区分问号后面的内容
    const secondGroup = firstGroup[1].split("&"); // 区分code和其他属性
    const thirdGroup = secondGroup[0].split("="); // 获取到=后面的值
    userCode = thirdGroup[1].toString();
  }

  console.log("userCode", userCode);


  return {
    name: "admins",
    group: "蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED",
    userid: "00000001"
  };

};


export default (): React.ReactNode => {

  const userInfo = getUsersInfo(window.location.href);

  const {initialState, setInitialState} = useModel('@@initialState');


  const intl = useIntl();
  useEffect(() => {
    setInitialState({
      ...initialState,
      currentUser: userInfo,
    });
  }, [1]);
  return (
    <PageContainer>
      <Card>
        <Alert
          message={intl.formatMessage({
            id: 'firstPages',
            defaultMessage: '欢迎使用企企研发管理平台',
          })}
          type="success"
          showIcon
          banner
          style={{
            fontSize: "20px"
          }}
        />
      </Card>
    </PageContainer>
  );
};
