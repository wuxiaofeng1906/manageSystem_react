// 获取近四周的时间范围
import {
  getFourQuarterTime,
  getMonthWeek,
  getTwelveMonthTime,
  getWeeksRange,
  getYearsTime
} from "@/publicMethods/timeMethods";
import {customRound} from "@/publicMethods/pageSet";

const weekRanges = getWeeksRange(8);
const monthRanges = getTwelveMonthTime();
const quarterTime = getFourQuarterTime();

/* region 列的定义和渲染 */

// 数据渲染
const dataRender = (params: any) => {
  const node = params.data;

  if (params.value || params.value === 0) {
    const currentTime = params.column?.colId;
    // 2022-04-01_denominator: 19035.9
    // 2022-04-01_numerator: 164.5
    let numerator = node[`${currentTime}_numerator`]; // 分子
    numerator = numerator === null ? 0 : numerator;
    let denominator = node[`${currentTime}_denominator`]; // 分母
    denominator = denominator === null ? 0 : denominator;
    let result = params.value;
    if (params.value !== 0) {
      result = customRound(result, 2);
    }
    if (node && node.isDept === true) {
      return `<span>
                <label style="font-weight: bold">${result}</label>
                <label style="color: gray"> (${numerator},${denominator})</label>
            </span>`;
    }

    return `<span>  ${result}
                <label style="color: gray"> (${numerator},${denominator})</label>
            </span>`;
  }

  if (node && node.isDept === true) {
    return `<span style="font-weight: bold"> ${0}</span>`;
  }

  return `<span style="color: silver"> ${0}</span>`;

}

const columsForWeeks = () => {
  const component = new Array();
  for (let index = weekRanges.length - 1; index >= 0; index -= 1) {
    const starttime = weekRanges[index].from;
    const weekName = getMonthWeek(starttime);
    component.push({
      headerName: weekName,
      field: starttime.toString(),
      cellRenderer: dataRender,
      minWidth: 100
    });

  }
  return component;
};

const columsForMonths = () => {
  const component = new Array();
  for (let index = 0; index < monthRanges.length; index += 1) {
    component.push({
      headerName: monthRanges[index].title,
      field: monthRanges[index].start,
      cellRenderer: dataRender,
      minWidth: 110
    });

  }
  return component;
};

const columsForQuarters = () => {
  const component = new Array();
  for (let index = 0; index < quarterTime.length; index += 1) {
    component.push({
      headerName: quarterTime[index].title,
      field: quarterTime[index].start,
      cellRenderer: dataRender
    });

  }
  return component;
};

const columsForYears = () => {
  const yearsTime = getYearsTime();
  const component = new Array();
  for (let index = 0; index < yearsTime.length; index += 1) {
    component.push({
      headerName: yearsTime[index].title,
      field: yearsTime[index].start,
      cellRenderer: dataRender
    });

  }
  return component;
};

/* endregion */

export {columsForWeeks, columsForMonths, columsForQuarters, columsForYears}
