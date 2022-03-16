import moment from 'moment';

export const getDt = (
  date?: moment.Moment | string,
  inputFormat?: string,
  outputFormat: string = 'DD-MM-YYYY'
) => moment(date, inputFormat).format(outputFormat);

export const getWeekDt = (
  date?: moment.Moment | string,
  inputFormat?: string,
  outputFormat: string = 'DD-MM-YYYY'
) =>
  `${moment(date, inputFormat).startOf('week').format(outputFormat)} ~ ${moment(
    date,
    inputFormat
  )
    .endOf('week')
    .format(outputFormat)}`;

export const getDayOfWeek = (
  date?: moment.Moment | string,
  inputFormat?: string
) => moment(date, inputFormat).format('dddd');

export const getWeekOfYear = (
  date?: moment.Moment | string,
  inputFormat?: string
) =>
  `Week ${moment(date, inputFormat).format('w')} of ${moment(date, inputFormat)
    .endOf('week')
    .format('YYYY')}`;

export const getMth = (
  date?: moment.Moment | string,
  inputFormat?: string,
  outputFormat: string = 'MMMM'
) => moment(date, inputFormat).format(outputFormat);

export const getMthDt = (
  date?: moment.Moment | string,
  inputFormat?: string,
  outputFormat: string = 'DD-MM-YYYY'
) =>
  `${moment(date, inputFormat)
    .startOf('month')
    .format(outputFormat)} ~ ${moment(date, inputFormat)
    .endOf('month')
    .format(outputFormat)}`;

export const getYr = (
  date?: moment.Moment | string,
  inputFormat?: string,
  outputFormat: string = 'YYYY'
) => moment(date, inputFormat).format(outputFormat);

export const getYrDt = (
  date?: moment.Moment | string,
  inputFormat?: string,
  outputFormat: string = 'DD-MM-YYYY'
) =>
  `${moment(date, inputFormat).startOf('year').format(outputFormat)} ~ ${moment(
    date,
    inputFormat
  )
    .endOf('year')
    .format(outputFormat)}`;

export const getPastDays = (num: number, outputFormat: string = 'DD-MM-YYYY') =>
  `${moment().subtract(num, 'd').format(outputFormat)} ~ ${moment().format(
    outputFormat
  )}`;

export const getNextDt = (
  date?: moment.Moment | string,
  inputFormat?: string,
  outputFormat: string = 'DD-MM-YYYY'
) => moment(date, inputFormat).add(1, 'day').format(outputFormat);

export const getMomentNextDt = (
  date?: moment.Moment | string,
  inputFormat?: string,
  outputFormat: string = 'DD-MM-YYYY'
) => moment(date, inputFormat).add(1, 'day');

export const getNextWeek = (
  date?: moment.Moment | string,
  inputFormat?: string,
  outputFormat: string = 'DD-MM-YYYY'
) =>
  `${moment(date, inputFormat)
    .add(1, 'week')
    .startOf('week')
    .format(outputFormat)} ~ ${moment(date, inputFormat)
    .add(1, 'week')
    .endOf('week')
    .format(outputFormat)}`;

export const getThisWeekTilYtd = (
  date?: moment.Moment | string,
  inputFormat?: string,
  outputFormat: string = 'DD-MM-YYYY'
) =>
  `${moment(date, inputFormat)
    .startOf('week')
    .format(outputFormat)} ~ ${moment()
    .subtract(1, 'day')
    .format(outputFormat)}`;

export const getNextMth = (
  date?: moment.Moment | string,
  inputFormat?: string,
  outputFormat: string = 'DD-MM-YYYY'
) =>
  `${moment(date, inputFormat)
    .add(1, 'month')
    .startOf('month')
    .format(outputFormat)} ~ ${moment(date, inputFormat)
    .add(1, 'month')
    .endOf('month')
    .format(outputFormat)}`;

export const getThisMthTilYtd = (
  date?: moment.Moment | string,
  inputFormat?: string,
  outputFormat: string = 'DD-MM-YYYY'
) =>
  `${moment(date, inputFormat)
    .startOf('month')
    .format(outputFormat)} ~ ${moment()
    .subtract(1, 'day')
    .format('DD-MM-YYYY')}`;

export const getNextYr = (
  date?: moment.Moment | string,
  inputFormat?: string,
  outputFormat: string = 'DD-MM-YYYY'
) =>
  `${moment(date, inputFormat)
    .add(1, 'year')
    .startOf('year')
    .format(outputFormat)} ~ ${moment(date, inputFormat)
    .add(1, 'year')
    .endOf('year')
    .format(outputFormat)}`;

export const getThisYrTilYtd = (
  date?: moment.Moment | string,
  inputFormat?: string,
  outputFormat: string = 'DD-MM-YYYY'
) =>
  `${moment(date, inputFormat)
    .startOf('year')
    .format(outputFormat)} ~ ${moment()
    .subtract(1, 'day')
    .format(outputFormat)}`;

export const getPrevDt = (
  date?: moment.Moment | string,
  inputFormat?: string,
  outputFormat: string = 'DD-MM-YYYY'
) => moment(date, inputFormat).subtract(1, 'day').format(outputFormat);

export const getMomentPrevDt = (
  date?: moment.Moment | string,
  inputFormat?: string,
  outputFormat: string = 'DD-MM-YYYY'
) => moment(date, inputFormat).subtract(1, 'day');

export const getPrevWeek = (
  date?: moment.Moment | string,
  inputFormat?: string,
  outputFormat: string = 'DD-MM-YYYY'
) =>
  `${moment(date, inputFormat)
    .subtract(1, 'week')
    .startOf('week')
    .format(outputFormat)} ~ ${moment(date, inputFormat)
    .subtract(1, 'week')
    .endOf('week')
    .format(outputFormat)}`;

export const getPrevMth = (
  date?: moment.Moment | string,
  inputFormat?: string,
  outputFormat: string = 'DD-MM-YYYY'
) =>
  `${moment(date, inputFormat)
    .subtract(1, 'month')
    .startOf('month')
    .format(outputFormat)} ~ ${moment(date, inputFormat)
    .subtract(1, 'month')
    .endOf('month')
    .format(outputFormat)}`;

export const getPrevYr = (
  date?: moment.Moment | string,
  inputFormat?: string,
  outputFormat: string = 'DD-MM-YYYY'
) =>
  `${moment(date, inputFormat)
    .subtract(1, 'year')
    .startOf('year')
    .format(outputFormat)} ~ ${moment(date, inputFormat)
    .subtract(1, 'year')
    .endOf('year')
    .format(outputFormat)}`;

export const validateDay = (
  date: moment.Moment | string,
  cat: string,
  inputFormat?: string,
  outputFormat: string = 'DD-MM-YYYY',
  func?: 'next' | 'previous'
): {
  date: string;
  cat: string;
  label: string;
  disabledNext: boolean;
} => {
  let newDt = moment.isMoment(date)
    ? date.format(outputFormat)
    : func === 'next'
    ? getNextDt(date, inputFormat, outputFormat)
    : func === 'previous'
    ? getPrevDt(date, inputFormat, outputFormat)
    : date;
  let newLbl = '';
  let newCat = cat;
  let disabledNext = getMomentNextDt(newDt, outputFormat).isAfter(moment());

  if (newDt === getDt()) {
    newLbl = 'Today';
    newCat = 'tdy';
  } else if (newDt === getPrevDt()) {
    newLbl = 'Yesterday';
    newCat = 'ytd';
  } else {
    newLbl = getDayOfWeek(moment(newDt, outputFormat));
    newCat = 'byDay';
  }

  return {
    date: newDt,
    label: newLbl,
    cat: newCat,
    disabledNext: disabledNext,
  };
};

export const validateWeek = (
  date: moment.Moment | string,
  cat: string,
  inputFormat?: string,
  outputFormat: string = 'DD-MM-YYYY',
  func?: 'next' | 'previous'
): {
  date: string;
  cat: string;
  label: string;
  disabledNext: boolean;
} => {
  let newDt: moment.Moment | string =
    func === 'next'
      ? (date = moment(
          getNextWeek(date, inputFormat).split(' ~ ')[0],
          'DD-MM-YYYY'
        ))
      : func === 'previous'
      ? (date = moment(
          getPrevWeek(date, inputFormat).split(' ~ ')[0],
          'DD-MM-YYYY'
        ))
      : moment(date, inputFormat);
  let newLbl = '';
  let disabledNext = moment(getNextWeek(newDt), 'DD-MM-YYYY').isSameOrAfter(
    moment(),
    'week'
  );
  if (
    moment(newDt).isBetween(moment().startOf('week'), moment().endOf('week'))
  ) {
    newDt = getThisWeekTilYtd(newDt, undefined, outputFormat);
    newLbl = getWeekOfYear(getThisWeekTilYtd(newDt), outputFormat);
  } else {
    newDt = getWeekDt(newDt, undefined, outputFormat);
    newLbl = getWeekOfYear(newDt, outputFormat);
  }

  return { date: newDt, label: newLbl, cat: cat, disabledNext: disabledNext };
};

export const validateMonth = (
  date: moment.Moment | string,
  cat: string,
  inputFormat?: string,
  outputFormat: string = 'DD-MM-YYYY',
  func?: 'next' | 'previous'
): {
  date: string;
  cat: string;
  label: string;
  disabledNext: boolean;
} => {
  let newDt: moment.Moment | string =
    func === 'next'
      ? (date = moment(
          getNextMth(date, inputFormat).split(' ~ ')[0],
          'DD-MM-YYYY'
        ))
      : func === 'previous'
      ? (date = moment(
          getPrevMth(date, inputFormat).split(' ~ ')[0],
          'DD-MM-YYYY'
        ))
      : moment(date, inputFormat);
  let newLbl = '';
  let disabledNext = moment(getNextMth(newDt), 'DD-MM-YYYY').isAfter(
    moment(),
    'month'
  );

  if (getMth(newDt) === getMth()) {
    newDt = getThisMthTilYtd(newDt, undefined, outputFormat);
    newLbl = getMth(getThisWeekTilYtd(newDt), outputFormat);
  } else {
    newDt = getMthDt(newDt, undefined, outputFormat);
    newLbl = getMth(newDt, outputFormat);
  }

  return { date: newDt, label: newLbl, cat: cat, disabledNext: disabledNext };
};

export const validateYear = (
  date: moment.Moment | string,
  cat: string,
  inputFormat?: string,
  outputFormat: string = 'DD-MM-YYYY',
  func?: 'next' | 'previous'
): {
  date: string;
  cat: string;
  label: string;
  disabledNext: boolean;
} => {
  let newDt: moment.Moment | string =
    func === 'next'
      ? (date = moment(
          getNextYr(date, inputFormat).split(' ~ ')[0],
          'DD-MM-YYYY'
        ))
      : func === 'previous'
      ? (date = moment(
          getPrevYr(date, inputFormat).split(' ~ ')[0],
          'DD-MM-YYYY'
        ))
      : moment(date, inputFormat);
  let newLbl = '';
  let disabledNext = moment(getNextYr(newDt), 'DD-MM-YYYY').isAfter(
    moment(),
    'year'
  );

  if (getYr(newDt) === getYr()) {
    newDt = getThisYrTilYtd(newDt, undefined, outputFormat);
    newLbl = getYr(getThisWeekTilYtd(newDt), outputFormat);
  } else {
    newDt = getYrDt(newDt, undefined, outputFormat);
    newLbl = getYr(newDt, outputFormat);
  }

  return { date: newDt, label: newLbl, cat: cat, disabledNext: disabledNext };
};

export const validateDropdownDate = (
  date: moment.Moment | string,
  cat: string,
  inputFormat?: string,
  outputFormat: string = 'DD-MM-YYYY',
  func?: 'next' | 'previous'
): {
  date: string;
  cat: string;
  label: string;
  disabledNext?: boolean;
} => {
  let dateInfo = {
    date: moment.isMoment(date) ? date.format(outputFormat) : date,
    cat: cat,
    label: '',
  };
  if (cat === 'tdy' || cat === 'ytd' || cat === 'byDay')
    dateInfo = validateDay(date, cat, inputFormat, outputFormat, func);
  else if (cat === 'byWeek')
    dateInfo = validateWeek(date, cat, inputFormat, outputFormat, func);
  else if (cat === 'byMonth')
    dateInfo = validateMonth(date, cat, inputFormat, outputFormat, func);
  else if (cat === 'byYear')
    dateInfo = validateYear(date, cat, inputFormat, outputFormat, func);
  else if (new RegExp(/^past\d*d$/).test(cat)) {
    let numDays = cat.substring(4, cat.length - 1);
    dateInfo = {
      date: moment.isMoment(date) ? date.format(outputFormat) : date,
      cat: cat,
      label: `Past ${numDays} Days`,
    };
  }

  return dateInfo;
};

export const formatDt = (
  date: string,
  cat: string,
  inputFormat: string,
  outputFormat: string = 'DD-MM-YYYY'
): string => {
  if (cat === 'tdy' || cat === 'ytd' || cat === 'byDay') {
    return moment(date, inputFormat).format(outputFormat);
  } else {
    let [startDt, endDt] = date.split(' ~ ');
    return `${moment(startDt, inputFormat).format(outputFormat)} - ${moment(
      endDt,
      inputFormat
    ).format(outputFormat)}`;
  }
};

export const getCurUnixTm = () => moment().subtract(15, 'second').unix();

export const getDtTm = (date:moment.Moment) => moment(date).format('DD-MM-YYYY HH:mm:ss');