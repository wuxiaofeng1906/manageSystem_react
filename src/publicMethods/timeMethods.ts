import * as dayjs from 'dayjs'; // 使用dayjs
import moment from 'moment'; // 使用moment

function formatDayjsTime(time: any) {
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
  const week = `${config.getYear}年${monthStr}月0${config.getWeek}周`;
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
    monthArray.push({
      title: `${currentMonth.year()}年${currentMonth.month() + 1}月`,
      start: from,
      end: `${to} 23:59:59`
    });
  }

  return monthArray;
}


// 获取季度 的开始和结束时间
function getFourQuarterTime() {
  const quarterArray = [];
  for (let index = 0; index < 12; index += 3) {
    const currentMonth = dayjs().subtract(index, 'month');
    let currentQuarter = 0;
    let from = "";
    let to = "";
    switch (currentMonth.format("M")) {
      case "1":
      case "2":
      case "3":
        currentQuarter = 1;
        from = "01-01";
        to = "03-31 23:59:59";
        break;
      case "4":
      case "5":
      case "6":
        currentQuarter = 2;
        from = "04-01";
        to = "06-30 23:59:59";
        break;
      case "7":
      case "8":
      case "9":
        currentQuarter = 3;
        from = "07-01";
        to = "09-30 23:59:59";
        break;
      case "10":
      case "11":
      case "12":
        currentQuarter = 4;
        from = "10-01";
        to = "12-31 23:59:59";
        break;

      default:
        break;
    }
    quarterArray.push({
      title: `${currentMonth.year()}年${currentQuarter}季度`,
      start: `${currentMonth.year()}-${from}`,
      end: `${currentMonth.year()}-${to}`,
    });
  }

  return quarterArray;
}

export {getWeeksRange, getMonthWeek, getRecentMonth, getTwelveMonthTime, getFourQuarterTime, formatDayjsTime};
