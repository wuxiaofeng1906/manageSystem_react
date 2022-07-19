function CustomTooltip() {}

CustomTooltip.prototype.init = function (params: any) {
  // eslint-disable-next-line no-multi-assign
  const eGui = (this.eGui = document.createElement('div'));

  eGui.classList.add('custom-tooltip');
  console.log(params);
  if (params.editer) {
    if (params.location === 'cell') {
      eGui.innerHTML = `<strong>${params.value}</strong> `;
    }
  }
};

CustomTooltip.prototype.getGui = function () {
  return this.eGui;
};

export { CustomTooltip };
