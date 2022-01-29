import moment from 'moment';

const getDt = (
  date?: moment.Moment | string,
  inputFormat?: string,
  format: string = 'DD-MM-YYYY'
) => moment(date, inputFormat).format(format);

const getDayOfWeek = (date?: moment.Moment | string, inputFormat?: string) =>
  moment(date, inputFormat).format('dddd');

const getWeekOfYear = (date?: moment.Moment | string, inputFormat?: string) =>
  `Week ${moment(date, inputFormat).format('w')} of ${moment(date, inputFormat)
    .endOf('week')
    .format('YYYY')}`;

const getMth = (
  date?: moment.Moment | string,
  inputFormat?: string,
  format: string = 'MMMM'
) => moment(date, inputFormat).format(format);

const getYr = (
  date?: moment.Moment | string,
  inputFormat?: string,
  format: string = 'YYYY'
) => moment(date, inputFormat).format(format);

const getPastDays = (num: number, format: string = 'DD-MM-YYYY') =>
  `${moment().subtract(num, 'd').format(format)} ~ ${moment().format(format)}`;

const getNextDt = (
  date?: moment.Moment | string,
  inputFormat?: string,
  format: string = 'DD-MM-YYYY'
) => moment(date, inputFormat).add(1, 'day').format(format);

const getMomentNextDt = (
  date?: moment.Moment | string,
  inputFormat?: string,
  format: string = 'DD-MM-YYYY'
) => moment(date, inputFormat).add(1, 'day');

const getNextWeek = (
  date?: moment.Moment | string,
  inputFormat?: string,
  format: string = 'DD-MM-YYYY'
) =>
  `${moment(date, inputFormat)
    .add(1, 'week')
    .startOf('week')
    .format(format)} ~ ${moment(date, inputFormat)
    .add(1, 'week')
    .endOf('week')
    .format(format)}`;

const getThisWeekTilYtd = (
  date?: moment.Moment | string,
  inputFormat?: string,
  format: string = 'DD-MM-YYYY'
) =>
  `${moment(date, inputFormat).startOf('week').format(format)} ~ ${moment()
    .subtract(1, 'day')
    .format(format)}`;

const getNextMth = (
  date?: moment.Moment | string,
  inputFormat?: string,
  format: string = 'DD-MM-YYYY'
) =>
  `${moment(date, inputFormat)
    .add(1, 'month')
    .startOf('month')
    .format(format)} ~ ${moment(date, inputFormat)
    .add(1, 'month')
    .endOf('month')
    .format(format)}`;

const getThisMthTilYtd = (
  date?: moment.Moment | string,
  inputFormat?: string,
  format: string = 'DD-MM-YYYY'
) =>
  `${moment(date, inputFormat).startOf('month').format(format)} ~ ${moment()
    .subtract(1, 'day')
    .format('DD-MM-YYYY')}`;

const getNextYr = (
  date?: moment.Moment | string,
  inputFormat?: string,
  format: string = 'DD-MM-YYYY'
) =>
  `${moment(date, inputFormat)
    .add(1, 'year')
    .startOf('year')
    .format(format)} ~ ${moment(date, inputFormat)
    .add(1, 'year')
    .endOf('year')
    .format(format)}`;

const getThisYrTilYtd = (
  date?: moment.Moment | string,
  inputFormat?: string,
  format: string = 'DD-MM-YYYY'
) =>
  `${moment(date, inputFormat).startOf('year').format(format)} ~ ${moment()
    .subtract(1, 'day')
    .format(format)}`;

const getPrevDt = (
  date?: moment.Moment | string,
  inputFormat?: string,
  format: string = 'DD-MM-YYYY'
) => moment(date, inputFormat).subtract(1, 'day').format(format);

const getMomentPrevDt = (
  date?: moment.Moment | string,
  inputFormat?: string,
  format: string = 'DD-MM-YYYY'
) => moment(date, inputFormat).subtract(1, 'day');

const getPrevWeek = (
  date?: moment.Moment | string,
  inputFormat?: string,
  format: string = 'DD-MM-YYYY'
) =>
  `${moment(date, inputFormat)
    .subtract(1, 'week')
    .startOf('week')
    .format(format)} ~ ${moment(date, inputFormat)
    .subtract(1, 'week')
    .endOf('week')
    .format(format)}`;

const getPrevMth = (
  date?: moment.Moment | string,
  inputFormat?: string,
  format: string = 'DD-MM-YYYY'
) =>
  `${moment(date, inputFormat)
    .subtract(1, 'month')
    .startOf('month')
    .format(format)} ~ ${moment(date, inputFormat)
    .subtract(1, 'month')
    .endOf('month')
    .format(format)}`;

const getPrevYr = (
  date?: moment.Moment | string,
  inputFormat?: string,
  format: string = 'DD-MM-YYYY'
) =>
  `${moment(date, inputFormat)
    .subtract(1, 'year')
    .startOf('year')
    .format(format)} ~ ${moment(date, inputFormat)
    .subtract(1, 'year')
    .endOf('year')
    .format(format)}`;

export {
  getDt,
  getDayOfWeek,
  getWeekOfYear,
  getMth,
  getYr,
  getPastDays,
  getNextDt,
  getMomentNextDt,
  getNextWeek,
  getThisWeekTilYtd,
  getNextMth,
  getThisMthTilYtd,
  getNextYr,
  getThisYrTilYtd,
  getPrevDt,
  getMomentPrevDt,
  getPrevWeek,
  getPrevMth,
  getPrevYr,
};
