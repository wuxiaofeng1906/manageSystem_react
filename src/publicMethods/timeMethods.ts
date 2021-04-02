import * as dayjs from 'dayjs'; // 使用dayjs
import moment from 'moment'; // 使用moment

function formatMomentTime(time: any) {
  return time === null ? null : moment(time, "YYYY-MM-DD");
}

// 计算近几周的日期范围
function getWeeksRange(weekCounts: number) {
  const ranges = new Array();
  // 最近几周
  for (let idx = 0; idx < weekCounts; idx += 1) {
    const week = dayjs().startOf('w').subtract(idx, 'w');
    const from = week;
    const to = week.endOf('w');
    const range = {
      from: dayjs(from).add(1, 'day').format('YYYY-MM-DD'),
      to: dayjs(to).add(1, 'day').format('YYYY-MM-DD'),
    };

    ranges.unshift(range);
  }
  console.log('ranges', ranges);

  return ranges;
}

// 计算第几月第几周
function getMonthWeek(starttime: string) {
  // starttime  为周一的日期
  // 求周四的日期
  const date = new Date(starttime.replace(/-/, '/'));
  date.setDate(date.getDate() + 3); // 增加3天，求周四的日期
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const newDates = new Date(year, month - 1, day);
  const d = newDates.getDate();
  let w = newDates.getDay();
  if (w === 0) {
    w = 7;
  }

  const config = {
    getMonth: date.getMonth() + 1,
    getYear: date.getFullYear(),
    getWeek: Math.ceil((d + 4 - w) / 7),
  };

  let monthStr = (config.getMonth).toString();
  if (config.getMonth < 10) {
    monthStr = `0${config.getMonth}`;
  }
  const week = `${monthStr}月0${config.getWeek}周`;
  // console.log('weeks', week);
  return week;
}

// 获取最近一个月
function getRecentMonth() {
  // 获取当前时间

  const currentTime = dayjs().format("YYYY-MM-DD");

  const recentTime = dayjs(currentTime).subtract(1, 'month').format("YYYY-MM-DD");
  const range = {
    start: recentTime,
    end: `${currentTime} 23:59:59`
  };
  return range;
}


// 获取12个月的 开始和结束时间
function getTwelveMonthTime() {
  const monthArray = [];
  for (let index = 0; index < 12; index += 1) {
    const currentMonth = dayjs().subtract(index, 'month');
    const from = dayjs(currentMonth).startOf('month').format('YYYY-MM-DD');
    const to = dayjs(currentMonth).endOf('month').format('YYYY-MM-DD');
    let month = "";
    if (currentMonth.month() + 1 > 9) {
      month = (currentMonth.month() + 1).toString();
    } else {
      month = `0${currentMonth.month() + 1}`;
    }
    monthArray.push({
      title: `${currentMonth.year()}年${month}月`,
      start: from,
      end: `${to}`
    });
  }

  return monthArray;
}


// 获取季度 的开始和结束时间
function getFourQuarterTime() {


  const quarterArray = [];
  for (let index = 0; index < 12; index += 3) {   // 0,3,6,9
    // const currentMonth = dayjs().subtract(index, 'month');  // 正常的季度显示
    const currentMonth = dayjs().subtract(index + 1, 'month');  // 只有本季度已经过了一个月，才显示本季度数据

    let currentQuarter = 0;
    let from = "";
    let to = "";
    switch (currentMonth.format("M")) {
      case "1":
      case "2":
      case "3":
        currentQuarter = 1;
        from = "01-01";
        to = "03-31";
        break;
      case "4":
      case "5":
      case "6":
        currentQuarter = 2;
        from = "04-01";
        to = "06-30";
        break;
      case "7":
      case "8":
      case "9":
        currentQuarter = 3;
        from = "07-01";
        to = "09-30";
        break;
      case "10":
      case "11":
      case "12":
        currentQuarter = 4;
        from = "10-01";
        to = "12-31";
        break;

      default:
        break;
    }

    const currentYear = currentMonth.year();
    quarterArray.push({
      title: `${currentYear}年${currentQuarter}季度`,
      start: `${currentYear}-${from}`,
      end: `${currentYear}-${to}`,
    });
  }

  return quarterArray;
}

// 获取当前季度 的开始和结束时间
function getCurrentQuarterTime() {
  let from = "";
  let to = "";
  const currentYear = dayjs().year();
  const currentMonth = dayjs().month();
  switch (currentMonth.toString()) {
    case "1":
    case "2":
    case "3":

      from = "01-01";
      to = "03-31";
      break;
    case "4":
    case "5":
    case "6":

      from = "04-01";
      to = "06-30";
      break;
    case "7":
    case "8":
    case "9":

      from = "07-01";
      to = "09-30";
      break;
    case "10":
    case "11":
    case "12":

      from = "10-01";
      to = "12-31";
      break;

    default:
      break;
  }

  return {start: `${currentYear}-${from}`, end: `${currentYear}-${to}`};
}


const getParamsByType = (params: any) => {
  let typeFlag = 0;
  let ends = "";
  if (params === 'week') {
    const weekRanges = getWeeksRange(8);
    const timeRange = new Array();
    for (let index = 0; index < weekRanges.length; index += 1) {
      timeRange.push(`"${weekRanges[index].to}"`);
    }
    ends = `[${timeRange.join(",")}]`;
    typeFlag = 1;

  } else if (params === 'month') {
    const monthRanges = getTwelveMonthTime();
    const timeRange = new Array();
    for (let index = 0; index < monthRanges.length; index += 1) {
      timeRange.push(`"${monthRanges[index].end}"`);
    }
    ends = `[${timeRange.join(",")}]`;
    typeFlag = 2;

  } else if (params === 'quarter') {
    const timeRange = new Array();
    const quarterTime = getFourQuarterTime();
    for (let index = 0; index < quarterTime.length; index += 1) {
      timeRange.push(`"${quarterTime[index].end}"`);
    }
    ends = `[${timeRange.join(",")}]`;
    typeFlag = 3;
  }

  return {typeFlag, ends};
};

export {
  getWeeksRange,
  getMonthWeek,
  getRecentMonth,
  getTwelveMonthTime,
  getFourQuarterTime,
  formatMomentTime,
  getParamsByType,
  getCurrentQuarterTime
};
