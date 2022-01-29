import moment from "moment";

const dataYear: {
  year: string;
  data: {
    Month: string;
    Sales: number;
  }[];
} = {
  year: moment().format('YYYY'),
  data: [
    { Month: 'Jan', Sales: 4000 },
    { Month: 'Feb', Sales: 4500 },
    { Month: 'Mar', Sales: 5500 },
    { Month: 'Apr', Sales: 4300 },
    { Month: 'May', Sales: 4100 },
    { Month: 'Jun', Sales: 6000 },
    { Month: 'Jul', Sales: 4700 },
    { Month: 'Aug', Sales: 4200 },
    { Month: 'Sep', Sales: 6100 },
    { Month: 'Oct', Sales: 5030 },
    { Month: 'Nov', Sales: 4954 },
    { Month: 'Dec', Sales: 5310 },
  ],
};

const dataMonth: {
  month: string;
  data: {
    Day: string;
    Sales: number;
  }[];
} = {
  month: '2021 August',
  data: [
    { Day: '1', Sales: 300 },
    { Day: '2', Sales: 356 },
    { Day: '3', Sales: 481 },
    { Day: '4', Sales: 237 },
    { Day: '5', Sales: 285 },
    { Day: '6', Sales: 300 },
    { Day: '7', Sales: 107 },
    { Day: '8', Sales: 402 },
    { Day: '9', Sales: 266 },
    { Day: '10', Sales: 470 },
    { Day: '11', Sales: 391 },
    { Day: '12', Sales: 379 },
    { Day: '13', Sales: 418 },
    { Day: '14', Sales: 301 },
    { Day: '15', Sales: 317 },
    { Day: '16', Sales: 30 },
    { Day: '17', Sales: 391 },
    { Day: '18', Sales: 106 },
    { Day: '19', Sales: 465 },
    { Day: '20', Sales: 50 },
    { Day: '21', Sales: 321 },
    { Day: '22', Sales: 279 },
    { Day: '23', Sales: 186 },
    { Day: '24', Sales: 500 },
    { Day: '25', Sales: 223 },
    { Day: '26', Sales: 447 },
    { Day: '27', Sales: 70 },
    { Day: '28', Sales: 58 },
    { Day: '29', Sales: 400 },
    { Day: '30', Sales: 600 },
  ],
};

const dataWeek: {
  frmDate: string;
  toDate: string;
  data: {
    Day: string;
    Sales: number;
  }[];
} = {
  frmDate: '10 August 2021',
  toDate: '17 August 2021',
  data: [
    { Day: 'Monday', Sales: 200 },
    { Day: 'Tuesday', Sales: 126 },
    { Day: 'Wednesday', Sales: 481 },
    { Day: 'Thursday', Sales: 237 },
    { Day: 'Friday', Sales: 285 },
    { Day: 'Saturday', Sales: 300 },
    { Day: 'Sunday', Sales: 107 },
  ],
};

const dataDay: {
  date: string;
  data: {
    Hour: string;
    Sales: number;
  }[];
} = {
  date: '17 August 2021',
  data: [
    { Hour: '00', Sales: 10 },
    { Hour: '01', Sales: 0 },
    { Hour: '02', Sales: 0 },
    { Hour: '03', Sales: 0 },
    { Hour: '04', Sales: 0 },
    { Hour: '05', Sales: 0 },
    { Hour: '06', Sales: 0 },
    { Hour: '07', Sales: 30 },
    { Hour: '08', Sales: 0 },
    { Hour: '09', Sales: 20 },
    { Hour: '10', Sales: 0 },
    { Hour: '11', Sales: 40 },
    { Hour: '12', Sales: 13.6 },
    { Hour: '13', Sales: 15 },
    { Hour: '14', Sales: 16.5 },
    { Hour: '15', Sales: 0 },
    { Hour: '16', Sales: 30.2 },
    { Hour: '17', Sales: 0 },
    { Hour: '18', Sales: 0 },
    { Hour: '19', Sales: 0 },
    { Hour: '20', Sales: 0 },
    { Hour: '21', Sales: 0 },
    { Hour: '22', Sales: 0 },
    { Hour: '23', Sales: 0 },
  ],
};

export { dataYear, dataMonth, dataWeek, dataDay };
