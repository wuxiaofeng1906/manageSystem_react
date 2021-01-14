import * as dayjs from 'dayjs'; // 使用dayjs

// 计算近几周的日期范围
function getWeeksRange(weekCounts: number) {
  const ranges = new Array();

  // 最近几周
  for (let idx = 0; idx < weekCounts; idx += 1) {
    const week = dayjs().startOf('w').subtract(idx, 'w');
    const from = week;
    const to = week.endOf('w');
    const range = {
      from: dayjs(from).format('YYYY-MM-DD'),
      to: dayjs(to).format('YYYY-MM-DD'),
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

  const week = `${config.getYear}年${config.getMonth}月0${config.getWeek}周`;
  console.log('weeks', week);
  return week;
}
export { getWeeksRange, getMonthWeek };
