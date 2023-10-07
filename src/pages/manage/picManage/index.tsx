import React from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {Carousel} from 'antd';
import imgUrl1 from './pic/1.jpg';
import imgUrl2 from './pic/2.jpg';
import imgUrl3 from './pic/3.jpg';
import imgUrl4 from './pic/4.jpg';
import imgUrl5 from './pic/5.jpg';
import imgUrl6 from './pic/6.jpg';

export default () => {
  const urlArray = [imgUrl1, imgUrl2, imgUrl3, imgUrl4, imgUrl5, imgUrl6]

  return (
    <PageContainer>
      <Carousel style={{backgroundColor: "blueviolet", width: '90%'}}>
        {
          urlArray.map((item: any) => {
            return (<div>
              <img
                width={'100%'}
                height={'30%'}
                src={item}
              />
            </div>);
          })
        }
      </Carousel>
    </PageContainer>
  );
};

