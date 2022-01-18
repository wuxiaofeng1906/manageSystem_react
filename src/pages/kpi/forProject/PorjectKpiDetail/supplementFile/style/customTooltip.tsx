function CustomTooltip() {

}

CustomTooltip.prototype.init = function (params: any) {
  // eslint-disable-next-line no-multi-assign
  const eGui = (this.eGui = document.createElement('div'));

  eGui.classList.add('custom-tooltip');

  if (params.location === 'setFilterValue') {
    eGui.innerHTML = `<strong>Full value:</strong> ${params.value}`;
  } else {
    eGui.innerHTML = params.value;
  }
};

CustomTooltip.prototype.getGui = function () {
  return this.eGui;
};


export {CustomTooltip};