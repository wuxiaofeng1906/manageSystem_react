import * as moment from "moment";

export const thisMonthValue = () => {
  return [moment().startOf('month'), moment().endOf('month')]
}

export const thisWeekValue = () => {
  return [moment().startOf('week'), moment().endOf('week')]
}

export const todayValue = () => {
  return [moment(), moment()]
}

export const lastWeeksValue = (offset: number = 0) => {
  return [moment().startOf('week').subtract(offset, "week"), moment().endOf('week')]
}

export const lastMonthsValue = (offset: number = 0) => {
  return [moment().startOf('month').subtract(offset, "month"), moment().endOf('month')]
}

export const getRanges = () => {
  return {
    '今天': todayValue(),
    '本周': thisWeekValue(),
    '本月': thisMonthValue(),
    '近八周': lastWeeksValue(7),
  }
}
