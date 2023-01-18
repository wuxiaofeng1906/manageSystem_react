import React, {useEffect, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {errorMessage, sucMessage} from '@/publicMethods/showMessages';
import {Button, DatePicker, Form, Input, Radio, Tabs, Popconfirm} from 'antd';
import style from './style.less';
import {isEmpty} from "lodash";


const {TextArea} = Input;
const {TabPane} = Tabs;

const MessageCard: React.FC<any> = (props: any) => {

  const [announcementNameForm] = Form.useForm();

  return (
    <div>
      <Form form={announcementNameForm}>
        <Form.Item
          label={'公告名称'}
          name={'announce_name'}
          rules={[
            {
              required: true,
              validator: (r, v, callback) => {
                if (isEmpty(v?.trim())) callback('请填写公告批次名称！');
                else callback();
              },
            },
          ]}
        >
          <Input style={{minWidth: 300, width: "50%"}}/>
        </Form.Item>
        <Form.Item
          label={'升级时间'}
          name={'announce_time'}
          rules={[{required: true}]}
        >
          <DatePicker style={{minWidth: 300, width: "50%"}}/>
        </Form.Item>
        <Form.Item label={'公告详情'} name="announce_content" rules={[{required: true}]}>
          <TextArea autoSize style={{minWidth: 300, width: "50%"}}/>
        </Form.Item>
        <Form.Item label={'是否轮播'} name="announce_carousel" rules={[{required: true}]}>
          <Radio.Group>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>

        </Form.Item>
      </Form>
    </div>
  );
};

export default MessageCard;
