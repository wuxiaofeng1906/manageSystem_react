import React, { useEffect, useRef } from 'react';

const DragIcon = (props: any) => {
  const myRef = useRef(null);

  useEffect(() => {
    if (props.registerRowDragger) {
      props.registerRowDragger(myRef.current, 0);
    }
  }, [myRef]);

  return (
    <span>
      <img
        src={require('../../../public/move.png')}
        width="20"
        height="20"
        alt="移动"
        title="移动"
        ref={myRef}
      />
    </span>
  );
};
export default DragIcon;
