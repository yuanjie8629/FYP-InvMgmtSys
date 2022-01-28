import moment from 'moment';

const getTdyDt = moment().format('DD-MM-YYYY');

const getYtdDt = moment().subtract(1, 'days').format('DD-MM-YYYY');

const getPast7Days = `${moment()
  .subtract(7, 'd')
  .format('DD-MM-YYYY')} ~ ${moment().format('DD-MM-YYYY')}`;

const getPast30Days = `${moment()
  .subtract(30, 'd')
  .format('DD-MM-YYYY')} ~ ${moment().format('DD-MM-YYYY')}`;

const getDayOfWeek = (date: string, format?: string) =>
  moment(date, format).format('dddd');

const getWeekOfYear = (date: string, format?: string) =>
  `Week ${moment(date, format).format('w')}`;

const getMthNm = (date: string, format?: string) =>
  moment(date, format).format('MMMM');

const getYr = (date: string, format?: string) =>
  moment(date, format).format('YYYY');

const getNextDt = (date: string, format?: string) =>
  moment(date, format).add(1, 'day');

const getNextWeek = (date: string, format?: string) =>
  `${moment(date, format)
    .add(1, 'week')
    .startOf('week')
    .format('DD-MM-YYYY')} ~ ${moment(date, format)
    .add(1, 'week')
    .endOf('week')
    .format('DD-MM-YYYY')}`;

const getThisWeekTilTdy = (date: string, format?: string) =>
  `${moment(date, format)
    .startOf('week')
    .format('DD-MM-YYYY')} ~ ${moment().format('DD-MM-YYYY')}`;

const getNextMth = (date: string, format?: string) =>
  `${moment(date, format)
    .add(1, 'month')
    .startOf('month')
    .format('DD-MM-YYYY')} ~ ${moment(date, format)
    .add(1, 'month')
    .endOf('month')
    .format('DD-MM-YYYY')}`;

const getThisMthTilTdy = (date: string, format?: string) =>
  `${moment(date, 'DD-MM-YYYY')
    .startOf('month')
    .format('DD-MM-YYYY')} ~ ${moment().format('DD-MM-YYYY')}`;

const getNextYr = (date: string, format?: string) =>
  `${moment(date, format)
    .add(1, 'year')
    .startOf('year')
    .format('DD-MM-YYYY')} ~ ${moment(date, format)
    .add(1, 'year')
    .endOf('year')
    .format('DD-MM-YYYY')}`;

const getThisYrTilTdy = (date: string, format?: string) =>
  `${moment(date, format)
    .startOf('year')
    .format('DD-MM-YYYY')} ~ ${moment().format('DD-MM-YYYY')}`;

const getPrevDt = (date: string, format?: string) =>
  moment(date, format).subtract(1, 'day');

const getPrevWeek = (date: string, format?: string) =>
  `${moment(date, format)
    .subtract(1, 'week')
    .startOf('week')
    .format('DD-MM-YYYY')} ~ ${moment(date, format)
    .subtract(1, 'week')
    .endOf('week')
    .format('DD-MM-YYYY')}`;

const getPrevMth = (date: string, format?: string) =>
  `${moment(date, format)
    .subtract(1, 'month')
    .startOf('month')
    .format('DD-MM-YYYY')} ~ ${moment(date, format)
    .subtract(1, 'month')
    .endOf('month')
    .format('DD-MM-YYYY')}`;

const getPrevYr = (date: string, format?: string) =>
  `${moment(date, format)
    .subtract(1, 'year')
    .startOf('year')
    .format('DD-MM-YYYY')} ~ ${moment(date, format)
    .subtract(1, 'year')
    .endOf('year')
    .format('DD-MM-YYYY')}`;

export {
  getTdyDt,
  getYtdDt,
  getPast7Days,
  getPast30Days,
  getDayOfWeek,
  getWeekOfYear,
  getMthNm,
  getYr,
  getNextDt,
  getNextWeek,
  getThisWeekTilTdy,
  getNextMth,
  getThisMthTilTdy,
  getNextYr,
  getThisYrTilTdy,
  getPrevDt,
  getPrevWeek,
  getPrevMth,
  getPrevYr,
};
