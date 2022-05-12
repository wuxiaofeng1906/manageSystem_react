import React from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';

function TitleElement(props: {
  nodeName: React.ReactNode;
  delNode: ((event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void) | undefined;
}) {
  return (
    <div className="title-element">
      <span className="editable-title">{props.nodeName}</span>
      <CloseCircleOutlined onClick={props.delNode} />
    </div>
  );
}

export default TitleElement;
