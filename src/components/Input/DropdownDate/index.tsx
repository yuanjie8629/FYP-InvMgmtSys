import React, { useState } from 'react';
import Button from '@components/Button';
import { Card, Col, Dropdown, Menu, MenuProps, Row } from 'antd';
import moment from 'moment';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { HiOutlineCalendar } from 'react-icons/hi';
import MenuDatePicker from '../MenuDatePicker';
import {
  getDt,
  getPastDays,
  getPrevDt,
  validateDay,
  validateWeek,
  validateMonth,
  validateYear,
  validateDropdownDate,
} from '@utils/dateUtils';
import Popover from '@components/Popover';

export interface DateInfo {
  date: string;
  label: string;
  cat: string;
}

export interface DropdownDateProps extends Omit<MenuProps, 'onChange'> {
  onChange?: (dateInfo: DateInfo) => void;
}

const DropdownDate = ({
  onChange = () => '',
  className,
  style,
  ...props
}: DropdownDateProps) => {
  const [date, setDate] = useState(getDt());
  const [label, setLabel] = useState('Today');
  const [dropdownOnBlur, setDropdownOnBlur] = useState(true);
  const [cat, setCat] = useState('tdy');
  const [itemHovered, setItemHovered] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [todayPopover, setTodayPopover] = useState(false);
  const [ytdPopover, setYtdPopover] = useState(false);
  const [past7dPopover, setpast7dPopover] = useState(false);
  const [past30dPopover, setpast30dPopover] = useState(false);
  const [dayPicker, setDayPicker] = useState({ ind: false, defVal: moment() });
  const [weekPicker, setWeekPicker] = useState({ ind: false, defVal: null });
  const [mthPicker, setMthPicker] = useState({ ind: false, defVal: null });
  const [yrPicker, setYrPicker] = useState({ ind: false, defVal: null });
  const [disableNext, setDisableNext] = useState(true);

  const pickerKeys = ['byDay', 'byWeek', 'byMonth', 'byYear'];

  const getKey = (date, cat) =>
    pickerKeys.includes(cat) ? cat : `${cat}/${date}`;

  const validateDefOpen = (key: string) =>
    getKey(date, cat).includes(key) && dropdownVisible && !itemHovered;

  const setNewDt = (dateInfo: DateInfo & { disabledNext?: boolean }) => {
    setDate(dateInfo.date);
    setLabel(dateInfo.label);
    setCat(dateInfo.cat);
    setDisableNext(dateInfo.disabledNext);
    onChange({
      date: dateInfo.date,
      label: dateInfo.label,
      cat: dateInfo.cat,
    });
  };

  const hideAllPickers = () => {
    setDayPicker({ ind: false, defVal: dayPicker.defVal });
    setWeekPicker({ ind: false, defVal: weekPicker.defVal });
    setMthPicker({ ind: false, defVal: mthPicker.defVal });
    setYrPicker({ ind: false, defVal: yrPicker.defVal });
  };

  const setPicker = (picker: 'day' | 'week' | 'month' | 'year', value) => {
    if (picker === 'day') {
      setDayPicker({ ind: false, defVal: value });
      setWeekPicker({ ind: weekPicker.ind, defVal: null });
      setMthPicker({ ind: mthPicker.ind, defVal: null });
      setYrPicker({ ind: yrPicker.ind, defVal: null });
    } else if (picker === 'week') {
      setDayPicker({ ind: dayPicker.ind, defVal: null });
      setWeekPicker({ ind: false, defVal: value });
      setMthPicker({ ind: mthPicker.ind, defVal: null });
      setYrPicker({ ind: yrPicker.ind, defVal: null });
    } else if (picker === 'month') {
      setDayPicker({ ind: dayPicker.ind, defVal: null });
      setWeekPicker({ ind: weekPicker.ind, defVal: null });
      setMthPicker({ ind: false, defVal: value });
      setYrPicker({ ind: yrPicker.ind, defVal: null });
    } else if (picker === 'year') {
      setDayPicker({ ind: dayPicker.ind, defVal: null });
      setWeekPicker({ ind: weekPicker.ind, defVal: null });
      setMthPicker({ ind: mthPicker.ind, defVal: null });
      setYrPicker({ ind: false, defVal: value });
    }
  };

  const handlePickerChange = (
    dateInfo: DateInfo & { disabledNext: boolean },
    picker: 'day' | 'week' | 'month' | 'year',
    value: moment.Moment
  ) => {
    setNewDt(dateInfo);
    setDropdownVisible(false);
    setPicker(picker, value);
  };

  const addDate = () => {
    handleDateFunc('next');
  };

  const subtractDate = () => {
    handleDateFunc('previous');
  };

  const handleDateFunc = (func: 'next' | 'previous') => {
    let dateInfo =
      func === 'next'
        ? validateDropdownDate(date, cat, 'DD-MM-YYYY', undefined, 'next')
        : validateDropdownDate(date, cat, 'DD-MM-YYYY', undefined, 'previous');
    setNewDt(dateInfo);
  };

  const hideNxtPrevBtn = new RegExp(/^past\d*d$/).test(cat);

  const dateLabelMapper = [
    { cat: 'tdy', label: 'Today' },
    { cat: 'ytd', label: 'Yesterday' },
    { cat: 'past7d', label: 'Past 7 Days' },
    { cat: 'past30d', label: 'Past 30 Days' },
  ];

  const DateMenu = (
    <Menu
      onClick={(item) => {
        let [newDtCat, newDt] = item.key.split('/');
        if (!pickerKeys.includes(item.key)) {
          setNewDt(validateDropdownDate(newDt, newDtCat, 'DD-MM-YYYY'));
          setDropdownVisible(false);
          setDayPicker({ ind: dayPicker.ind, defVal: null });
          setWeekPicker({ ind: weekPicker.ind, defVal: null });
          setMthPicker({ ind: mthPicker.ind, defVal: null });
          setYrPicker({ ind: yrPicker.ind, defVal: null });
        }
      }}
      onMouseOver={() => setDropdownOnBlur(false)}
      onMouseLeave={() => setDropdownOnBlur(true)}
      selectedKeys={[getKey(date, cat)]}
      style={{ width: 150 }}
      {...props}
    >
      <Menu.Item
        key={`tdy/${getDt()}`}
        onMouseOver={() => {
          hideAllPickers();
          setItemHovered(true);
          setTodayPopover(true);
        }}
        onMouseLeave={() => {
          setTodayPopover(false);
        }}
      >
        <Popover
          visible={todayPopover || validateDefOpen(`tdy/${getDt()}`)}
          key={getDt()}
          content={getDt()}
          placement='right'
          align={{
            points: ['cc', 'cr'],
            offset: [160, 0],
          }}
        >
          {dateLabelMapper.find((mapper) => mapper.cat === 'tdy').label}
        </Popover>
      </Menu.Item>

      <Menu.Item
        key={`ytd/${getPrevDt()}`}
        onMouseOver={() => {
          hideAllPickers();
          setItemHovered(true);
          setYtdPopover(true);
        }}
        onMouseLeave={() => {
          setYtdPopover(false);
        }}
      >
        <Popover
          visible={ytdPopover || validateDefOpen(`ytd/${getPrevDt()}`)}
          content={getPrevDt()}
          placement='right'
          align={{
            points: ['cc', 'cr'],
            offset: [140, 0],
          }}
        >
          {dateLabelMapper.find((mapper) => mapper.cat === 'ytd').label}
        </Popover>
      </Menu.Item>

      <Menu.Item
        key={`past7d/${getPastDays(7)}`}
        onMouseOver={() => {
          hideAllPickers();
          setItemHovered(true);
          setpast7dPopover(true);
        }}
        onMouseLeave={() => {
          setpast7dPopover(false);
        }}
      >
        <Popover
          visible={past7dPopover || validateDefOpen(`past7d/${getPastDays(7)}`)}
          content={getPastDays(7)}
          placement='right'
          align={{
            points: ['cc', 'cr'],
            offset: [173, 0],
          }}
        >
          {dateLabelMapper.find((mapper) => mapper.cat === 'past7d').label}
        </Popover>
      </Menu.Item>

      <Menu.Item
        key={`past30d/${getPastDays(30)}`}
        onMouseOver={() => {
          hideAllPickers();
          setItemHovered(true);
          setpast30dPopover(true);
        }}
        onMouseLeave={() => {
          setpast30dPopover(false);
        }}
      >
        <Popover
          visible={
            past30dPopover || validateDefOpen(`past30d/${getPastDays(30)}`)
          }
          content={getPastDays(30)}
          placement='right'
          align={{
            points: ['cc', 'cr'],
            offset: [166, 0],
          }}
        >
          {dateLabelMapper.find((mapper) => mapper.cat === 'past30d').label}
        </Popover>
      </Menu.Item>

      <Menu.Divider />

      <Menu.Item
        key='byDay'
        onMouseOver={() => {
          hideAllPickers();
          setItemHovered(true);
          setDayPicker({ ind: true, defVal: dayPicker.defVal });
        }}
      >
        <MenuDatePicker
          label='By Day'
          open={dayPicker.ind || validateDefOpen('byDay')}
          showToday={false}
          value={dayPicker.defVal !== null && dayPicker.defVal}
          disabledDate={(current) => current > moment()}
          onChange={(value) => {
            handlePickerChange(validateDay(value, 'byDay'), 'day', value);
          }}
          dropdownAlign={{
            points: ['cc', 'cr'],
            offset: [285, -30],
          }}
        />
      </Menu.Item>

      <Menu.Item
        key='byWeek'
        onMouseOver={() => {
          hideAllPickers();
          setItemHovered(true);
          setWeekPicker({ ind: true, defVal: weekPicker.defVal });
        }}
      >
        <MenuDatePicker
          label='By Week'
          picker='week'
          open={weekPicker.ind || validateDefOpen('byWeek')}
          value={weekPicker.defVal !== null && weekPicker.defVal}
          disabledDate={(current) => current > moment()}
          onChange={(value) => {
            handlePickerChange(validateWeek(value, 'byWeek'), 'week', value);
          }}
          dropdownAlign={{
            points: ['cc', 'cr'],
            offset: [285, -64],
          }}
        />
      </Menu.Item>

      <Menu.Item
        key='byMonth'
        onMouseOver={() => {
          hideAllPickers();
          setItemHovered(true);
          setMthPicker({ ind: true, defVal: mthPicker.defVal });
        }}
      >
        <MenuDatePicker
          label='By Month'
          picker='month'
          open={mthPicker.ind || validateDefOpen('byMonth')}
          value={mthPicker.defVal !== null && mthPicker.defVal}
          disabledDate={(current) => current > moment()}
          onChange={(value) => {
            handlePickerChange(validateMonth(value, 'byMonth'), 'month', value);
          }}
          dropdownAlign={{
            points: ['cc', 'cr'],
            offset: [285, -95],
          }}
        />
      </Menu.Item>
      <Menu.Item
        key='byYear'
        onMouseOver={() => {
          hideAllPickers();
          setItemHovered(true);
          setYrPicker({ ind: true, defVal: yrPicker.defVal });
        }}
      >
        <MenuDatePicker
          label='By Year'
          picker='year'
          open={yrPicker.ind || validateDefOpen('byYear')}
          value={yrPicker.defVal !== null && yrPicker.defVal}
          disabledDate={(current) => current > moment()}
          onChange={(value) => {
            handlePickerChange(validateYear(value, 'byYear'), 'year', value);
          }}
          dropdownAlign={{
            points: ['cc', 'cr'],
            offset: [285, -125],
          }}
        />
      </Menu.Item>
    </Menu>
  );

  return (
    <Card
      bodyStyle={{ padding: 5, textAlign: 'center' }}
      style={style}
      className={className}
    >
      <Row justify='center' align='middle'>
        <Col>
          <Button
            type='text'
            style={{ background: 'none' }}
            className='center-flex'
            icon={<MdChevronLeft size={25} />}
            onClick={subtractDate}
            hidden={hideNxtPrevBtn}
          />
        </Col>
        <Col>
          <Dropdown
            visible={dropdownVisible}
            overlay={DateMenu}
            placement='bottomCenter'
          >
            <Button
              type='text'
              icon={<HiOutlineCalendar size={20} style={{ marginRight: 5 }} />}
              style={{ background: 'none' }}
              className='center-flex'
              onBlur={() => {
                if (dropdownOnBlur === true) {
                  setDropdownVisible(false);
                  hideAllPickers();
                }
              }}
              onClick={() => {
                dropdownVisible === false
                  ? setDropdownVisible(true)
                  : setDropdownVisible(false);
                setItemHovered(false);
              }}
            >
              {`${label} (${date})`}
            </Button>
          </Dropdown>
        </Col>
        <Col>
          <Button
            type='text'
            style={{ background: 'none' }}
            className='center-flex'
            icon={<MdChevronRight size={25} />}
            onClick={addDate}
            disabled={disableNext}
            hidden={hideNxtPrevBtn}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default DropdownDate;
