import { useState } from 'react';

export default () => {
  const [global, setGlobal] = useState({ locked: true, finished: false, step: 1 });

  return { global, setGlobal };
};
