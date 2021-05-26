import React from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {Card, Alert} from 'antd';
import {useIntl} from 'umi';

export default (): React.ReactNode => {
  const intl = useIntl();
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
