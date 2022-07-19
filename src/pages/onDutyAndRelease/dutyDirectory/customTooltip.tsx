import { useEffect } from 'react';
import LockServices from '@/services/lock';

function CustomTooltip() {}

CustomTooltip.prototype.init = function (param: any) {
  // eslint-disable-next-line no-multi-assign
  const eGui = (this.eGui = document.createElement('div'));

  eGui.classList.add('custom-tooltip');
  console.log(param.data.editer, param.data);
  if (param.data.editer) {
    eGui.innerHTML = `<strong>${param.data.editer}</strong> `;
  } else {
    eGui.innerHTML = 'sssss';
  }
};

CustomTooltip.prototype.getGui = function () {
  return this.eGui;
};

export { CustomTooltip };
