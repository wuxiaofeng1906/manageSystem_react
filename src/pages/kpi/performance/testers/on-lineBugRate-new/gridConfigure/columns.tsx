/* region 列的定义和渲染 */
// 数据渲染
import { customRound } from '@/publicMethods/pageSet';
import {
  getFourQuarterTime,
  getMonthWeek,
  getTwelveMonthTime,
  getWeeksRange,
  getYearsTime,
} from '@/publicMethods/timeMethods';

// 数据渲染
const dataRender = (params: any) => {
  const node = params.data;
  if (params.value) {
    let result = customRound(params.value, 3);
    if ((params.column?.colId).indexOf('_kpi') < 0) {
      result = params.value;
    }

    if (node && node.isDept === true) {
      return `<span style="font-weight: bold"> ${result}</span>`;
    }
    return `<span> ${result}</span>`;
  }

  if (node && node.isDept === true) {
    return `<span style="font-weight: bold"> ${0}</span>`;
  }

  return `<span style="color: silver"> ${0}</span>`;
};

// 周
export const columsForWeeks = () => {
  const weekRanges = getWeeksRange(8);
  const component = new Array();
  for (let index = weekRanges.length - 1; index >= 0; index -= 1) {
    const starttime = weekRanges[index].from;
    const weekName = getMonthWeek(starttime);
    component.push({
      headerName: weekName,
      children: [
        {
          headerName: 'bug率',
          field: `${starttime}_kpi`,
          cellRenderer: dataRender,
        },
        {
          headerName: '代码量',
          field: `${starttime}_codes`,
          cellRenderer: dataRender,
          columnGroupShow: 'open',
        },
        // {
        //   headerName: "bug数",
        //   field: `${starttime}_bugs`,
        //   cellRenderer: dataRender,
        //   columnGroupShow: 'open'
        // },
        // {
        //   headerName: "加权bug数",
        //   field: `${starttime}_weightBugs`,
        //   cellRenderer: dataRender,
        //   columnGroupShow: 'open'
        // }
      ],
    });
  }
  return component;
};

// 月
export const columsForMonths = () => {
  const monthRanges = getTwelveMonthTime();
  const component = new Array();
  for (let index = 0; index < monthRanges.length; index += 1) {
    component.push({
      headerName: monthRanges[index].title,
      children: [
        {
          headerName: 'bug率',
          field: `${monthRanges[index].start}_kpi`,
          cellRenderer: dataRender,
        },
        {
          headerName: '代码量',
          field: `${monthRanges[index].start}_codes`,
          cellRenderer: dataRender,
          columnGroupShow: 'open',
        },
        // {
        //   headerName: "bug数",
        //   field: `${monthRanges[index].start}_bugs`,
        //   cellRenderer: dataRender,
        //   columnGroupShow: 'open'
        // },
        // {
        //   headerName: "加权bug数",
        //   field: `${monthRanges[index].start}_weightBugs`,
        //   cellRenderer: dataRender,
        //   columnGroupShow: 'open'
        // }
      ],
    });
  }
  return component;
};

// 季
export const columsForQuarters = () => {
  const quarterTime = getFourQuarterTime();
  const component = new Array();
  for (let index = 0; index < quarterTime.length; index += 1) {
    component.push({
      headerName: quarterTime[index].title,
      children: [
        {
          headerName: 'bug率',
          field: `${quarterTime[index].start}_kpi`,
          cellRenderer: dataRender,
        },
        {
          headerName: '代码量',
          field: `${quarterTime[index].start}_codes`,
          cellRenderer: dataRender,
          columnGroupShow: 'open',
        },
        // {
        //   headerName: "bug数",
        //   field: `${quarterTime[index].start}_bugs`,
        //   cellRenderer: dataRender,
        //   columnGroupShow: 'open'
        // },
        // {
        //   headerName: "加权bug数",
        //   field: `${quarterTime[index].start}_weightBugs`,
        //   cellRenderer: dataRender,
        //   columnGroupShow: 'open'
        // }
      ],
    });
  }
  return component;
};

// 年
export const columsForYears = () => {
  const yearsTime = getYearsTime();
  const component = new Array();
  for (let index = 0; index < yearsTime.length; index += 1) {
    // component.push({
    //   headerName: yearsTime[index].title,
    //   field: yearsTime[index].start,
    //   cellRenderer: dataRender
    // });

    component.push({
      headerName: yearsTime[index].title,
      children: [
        {
          headerName: 'bug率',
          field: `${yearsTime[index].start}_kpi`,
          cellRenderer: dataRender,
        },
        {
          headerName: '代码量',
          field: `${yearsTime[index].start}_codes`,
          cellRenderer: dataRender,
          columnGroupShow: 'open',
        },
        // {
        //   headerName: "bug数",
        //   field: `${yearsTime[index].start}_bugs`,
        //   cellRenderer: dataRender,
        //   columnGroupShow: 'open'
        // },
        // {
        //   headerName: "加权bug数",
        //   field: `${yearsTime[index].start}_weightBugs`,
        //   cellRenderer: dataRender,
        //   columnGroupShow: 'open'
        // }
      ],
    });
  }
  return component;
};
/* endregion */
