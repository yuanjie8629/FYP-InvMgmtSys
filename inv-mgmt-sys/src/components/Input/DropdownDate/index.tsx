import React, { useState, useEffect } from 'react';
import Button from '@components/Button';
import {
  Dropdown,
  DropDownProps as AntdDropdownProps,
  Menu,
  Popover,
  Space,
} from 'antd';
import moment from 'moment';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { HiOutlineCalendar } from 'react-icons/hi';
import MenuDatePicker from '../MenuDatePicker';
import {
  getDt,
  getPastDays,
  getNextDt,
  getDayOfWeek,
  getWeekOfYear,
  getNextWeek,
  getNextMth,
  getPrevDt,
  getPrevWeek,
  getPrevMth,
  getMth,
  getThisWeekTilYtd,
  getThisMthTilYtd,
  getNextYr,
  getYr,
  getPrevYr,
  getThisYrTilYtd,
  getMomentNextDt,
  getMomentPrevDt,
} from '@utils/dateUtils';

interface Dropdownprops extends Omit<AntdDropdownProps, 'overlay'> {}

const DropdownDate = (props: Dropdownprops) => {
  const [date, setDate] = useState(getDt());
  const [dateCat, setDateCat] = useState('tdy');
  const [dropdownOnBlur, setDropdownOnBlur] = useState(true);
  const [selected, setSelected] = useState(['tdy/' + getDt()]);
  const [itemHovered, setItemHovered] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [todayPopover, setTodayPopover] = useState(false);
  const [ytdPopover, setYtdPopover] = useState(false);
  const [past7dPopover, setpast7dPopover] = useState(false);
  const [past30dPopover, setpast30dPopover] = useState(false);
  const [dayPicker, setDayPicker] = useState({ ind: false, defVal: null });
  const [weekPicker, setWeekPicker] = useState({ ind: false, defVal: null });
  const [mthPicker, setMthPicker] = useState({ ind: false, defVal: null });
  const [yrPicker, setYrPicker] = useState({ ind: false, defVal: null });
  const [disableNext, setDisableNext] = useState(false);

  const validateDefOpen = (key: string) =>
    selected.includes(key) && dropdownVisible && !itemHovered;

  const hideAllPickers = () => {
    setDayPicker({ ind: false, defVal: dayPicker.defVal });
    setWeekPicker({ ind: false, defVal: weekPicker.defVal });
    setMthPicker({ ind: false, defVal: mthPicker.defVal });
    setYrPicker({ ind: false, defVal: yrPicker.defVal });
  };

  const pickerKeys = ['byDay', 'byWeek', 'byMth', 'byYr'];

  const dateCatMapper = [
    { value: 'tdy', label: 'Today' },
    { value: 'ytd', label: 'Yesterday' },
    { value: 'past7d', label: 'Past 7 Days' },
    { value: 'past30d', label: 'Past 30 Days' },
  ];

  const generateDate = () =>
    dateCatMapper.find((dateCategory) => dateCat === dateCategory.value) !==
    undefined
      ? dateCatMapper.find((dateCategory) => dateCat === dateCategory.value)
          .label + ` (${date})`
      : `${dateCat} (${date})`;

  const addDate = () => {
    if (
      dateCat === 'tdy' ||
      dateCat === 'ytd' ||
      dateCat === getDayOfWeek(date, 'DD-MM-YYYY')
    ) {
      let nxtDt = getNextDt(date, 'DD-MM-YYYY');
      setDate(nxtDt);
      if (nxtDt === getDt()) setDateCat('tdy');
      else if (nxtDt === getPrevDt()) setDateCat('ytd');
      else setDateCat(getDayOfWeek(getMomentNextDt(date, 'DD-MM-YYYY')));
    } else if (
      dateCat === getWeekOfYear(date, 'DD-MM-YYYY') &&
      !moment().isBetween(
        moment(date, 'DD-MM-YYYY').startOf('week'),
        moment(date, 'DD-MM-YYYY').endOf('week')
      )
    ) {
      setDate(getNextWeek(date, 'DD-MM-YYYY'));
      setDateCat(getWeekOfYear(getNextWeek(date, 'DD-MM-YYYY'), 'DD-MM-YYYY'));
    } else if (
      dateCat === getMth(date, 'DD-MM-YYYY') &&
      !(getMth(date, 'DD-MM-YYYY') === getMth())
    ) {
      setDate(getNextMth(date, 'DD-MM-YYYY'));
      setDateCat(getMth(getNextMth(date, 'DD-MM-YYYY'), 'DD-MM-YYYY'));
    } else if (
      dateCat === getYr(date, 'DD-MM-YYYY') &&
      !(getYr(date, 'DD-MM-YYYY') === getYr())
    ) {
      setDate(getNextYr(date, 'DD-MM-YYYY'));
      setDateCat(getYr(getNextYr(date, 'DD-MM-YYYY'), 'DD-MM-YYYY'));
    }
  };

  const subtractDate = () => {
    if (
      dateCat === 'tdy' ||
      dateCat === 'ytd' ||
      dateCat === getDayOfWeek(date, 'DD-MM-YYYY')
    ) {
      let prevDt = getPrevDt(date, 'DD-MM-YYYY');
      setDate(prevDt);
      if (prevDt === getDt()) setDateCat('tdy');
      else if (prevDt === getPrevDt()) setDateCat('ytd');
      else setDateCat(getDayOfWeek(getMomentPrevDt(date, 'DD-MM-YYYY')));
    } else if (dateCat === getWeekOfYear(date, 'DD-MM-YYYY')) {
      setDate(getPrevWeek(date, 'DD-MM-YYYY'));
      setDateCat(getWeekOfYear(getPrevWeek(date, 'DD-MM-YYYY'), 'DD-MM-YYYY'));
    } else if (dateCat === getMth(date, 'DD-MM-YYYY')) {
      setDate(getPrevMth(date, 'DD-MM-YYYY'));
      setDateCat(getMth(getPrevMth(date, 'DD-MM-YYYY'), 'DD-MM-YYYY'));
    } else if (dateCat === getYr(date, 'DD-MM-YYYY')) {
      setDate(getPrevYr(date, 'DD-MM-YYYY'));
      setDateCat(getYr(getPrevYr(date, 'DD-MM-YYYY'), 'DD-MM-YYYY'));
    }
  };

  useEffect(() => {
    const validateDate = () => {
      if (
        dateCat === 'tdy' ||
        dateCat === 'ytd' ||
        dateCat === getDayOfWeek(date, 'DD-MM-YYYY')
      ) {
        setDisableNext(getMomentNextDt(date, 'DD-MM-YYYY').isAfter(moment()));
      } else if (dateCat === getWeekOfYear(date, 'DD-MM-YYYY')) {
        setDisableNext(
          moment(date, 'DD-MM-YYYY')
            .add(1, 'week')
            .startOf('week')
            .isSameOrAfter(moment())
        );

        if (
          moment().isBetween(
            moment(date, 'DD-MM-YYYY').startOf('week'),
            moment(date, 'DD-MM-YYYY').endOf('week')
          )
        ) {
          setDate(getThisWeekTilYtd(date, 'DD-MM-YYYY'));
          setDateCat(
            getWeekOfYear(getThisWeekTilYtd(date, 'DD-MM-YYYY'), 'DD-MM-YYYY')
          );
        }
      } else if (dateCat === getMth(date, 'DD-MM-YYYY')) {
        setDisableNext(
          moment(date, 'DD-MM-YYYY')
            .add(1, 'month')
            .startOf('month')
            .isAfter(moment())
        );

        if (getMth(date, 'DD-MM-YYYY') === getMth()) {
          setDate(getThisMthTilYtd(date, 'DD-MM-YYYY'));
          setDateCat(
            getMth(getThisMthTilYtd(date, 'DD-MM-YYYY'), 'DD-MM-YYYY')
          );
        }
      } else if (dateCat === getYr(date, 'DD-MM-YYYY')) {
        setDisableNext(
          moment(date, 'DD-MM-YYYY').add(1, 'year').isAfter(moment())
        );

        if (getYr(date, 'DD-MM-YYYY') === getYr()) {
          setDate(getThisYrTilYtd(date, 'DD-MM-YYYY'));
          setDateCat(getYr(getThisYrTilYtd(date, 'DD-MM-YYYY'), 'DD-MM-YYYY'));
        }
      }
    };
    validateDate();
  }, [date, dateCat]);

  const DateMenu = (
    <Menu
      onClick={(item) => {
        let [dateCat, date] = item.key.split('/');
        if (!pickerKeys.includes(item.key)) {
          setDropdownVisible(false);
          setSelected([item.key]);
          setDateCat(dateCat);
          setDate(date);
          setDayPicker({ ind: dayPicker.ind, defVal: null });
          setWeekPicker({ ind: weekPicker.ind, defVal: null });
          setMthPicker({ ind: mthPicker.ind, defVal: null });
          setYrPicker({ ind: yrPicker.ind, defVal: null });
        }
      }}
      onMouseOver={() => setDropdownOnBlur(false)}
      onMouseLeave={() => setDropdownOnBlur(true)}
      selectedKeys={selected}
      style={{ width: 150 }}
    >
      <Menu.Item
        key={'tdy/' + getDt()}
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
          visible={todayPopover || validateDefOpen('tdy/' + getDt())}
          key={getDt()}
          content={getDt()}
          placement='right'
          align={{
            points: ['cc', 'cr'],
            offset: [160, 0],
          }}
        >
          Today
        </Popover>
      </Menu.Item>

      <Menu.Item
        key={'ytd/' + getPrevDt()}
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
          visible={ytdPopover || validateDefOpen('ytd/' + getPrevDt())}
          content={getPrevDt()}
          placement='right'
          align={{
            points: ['cc', 'cr'],
            offset: [142, 0],
          }}
        >
          Yesterday
        </Popover>
      </Menu.Item>

      <Menu.Item
        key={'past7d/' + getPastDays(7)}
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
          visible={past7dPopover || validateDefOpen('past7d/' + getPastDays(7))}
          content={getPastDays(7)}
          placement='right'
          align={{
            points: ['cc', 'cr'],
            offset: [182, 0],
          }}
        >
          {dateCatMapper.find((dateCat) => dateCat.value === 'past7d').label}
        </Popover>
      </Menu.Item>

      <Menu.Item
        key={'past30d/' + getPastDays(30)}
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
            past30dPopover || validateDefOpen('past30d/' + getPastDays(30))
          }
          content={getPastDays(30)}
          placement='right'
          align={{
            points: ['cc', 'cr'],
            offset: [175, 0],
          }}
        >
          {dateCatMapper.find((dateCat) => dateCat.value === 'past30d').label}
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
          value={dayPicker.defVal !== null ? dayPicker.defVal : null}
          disabledDate={(current) => current > moment()}
          onChange={(value) => {
            let newDt = value.format('DD-MM-YYYY');
            setDropdownVisible(false);
            setSelected(['byDay']);
            newDt === getDt()
              ? setDateCat('tdy')
              : newDt === getPrevDt()
              ? setDateCat('ytd')
              : setDateCat(getDayOfWeek(value));
            setDate(newDt);
            setDayPicker({ ind: false, defVal: value });
            setWeekPicker({ ind: weekPicker.ind, defVal: null });
            setMthPicker({ ind: mthPicker.ind, defVal: null });
          }}
          dropdownAlign={{
            points: ['cc', 'cr'],
            offset: [285, -20],
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
          value={weekPicker.defVal !== null ? weekPicker.defVal : null}
          disabledDate={(current) => current >= moment()}
          onChange={(value) => {
            setDropdownVisible(false);
            setSelected(['byWeek']);
            setDateCat(getWeekOfYear(value));
            setDate(
              `${value.startOf('week').format('DD-MM-YYYY')} ~ ${value
                .endOf('week')
                .format('DD-MM-YYYY')}`
            );
            setDayPicker({ ind: dayPicker.ind, defVal: null });
            setWeekPicker({ ind: false, defVal: value });
            setMthPicker({ ind: mthPicker.ind, defVal: null });
            setYrPicker({ ind: yrPicker.ind, defVal: null });
          }}
          dropdownAlign={{
            points: ['cc', 'cr'],
            offset: [285, -65],
          }}
        />
      </Menu.Item>

      <Menu.Item
        key='byMth'
        onMouseOver={() => {
          hideAllPickers();
          setItemHovered(true);
          setMthPicker({ ind: true, defVal: mthPicker.defVal });
        }}
      >
        <MenuDatePicker
          label='By Month'
          picker='month'
          open={mthPicker.ind || validateDefOpen('byMth')}
          value={mthPicker.defVal !== null ? mthPicker.defVal : null}
          disabledDate={(current) => current > moment()}
          onChange={(value) => {
            setDropdownVisible(false);
            setSelected(['byMth']);
            setDateCat(getMth(value));
            setDate(
              `${value.startOf('month').format('DD-MM-YYYY')} ~ ${value
                .endOf('month')
                .format('DD-MM-YYYY')}`
            );
            setDayPicker({ ind: dayPicker.ind, defVal: null });
            setWeekPicker({ ind: weekPicker.ind, defVal: null });
            setMthPicker({ ind: false, defVal: value });
            setYrPicker({ ind: yrPicker.ind, defVal: null });
          }}
          dropdownAlign={{
            points: ['cc', 'cr'],
            offset: [285, -95],
          }}
        />
      </Menu.Item>
      <Menu.Item
        key='byYr'
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
          value={yrPicker.defVal !== null ? yrPicker.defVal : null}
          disabledDate={(current) => current > moment()}
          onChange={(value) => {
            setDropdownVisible(false);
            setSelected(['byYr']);
            setDateCat(getYr(value));
            setDate(
              `${value.startOf('year').format('DD-MM-YYYY')} ~ ${value
                .endOf('year')
                .format('DD-MM-YYYY')}`
            );
            setDayPicker({ ind: dayPicker.ind, defVal: null });
            setWeekPicker({ ind: weekPicker.ind, defVal: null });
            setMthPicker({ ind: mthPicker.ind, defVal: null });
            setYrPicker({ ind: false, defVal: value });
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
    <Space align='center' size={5}>
      <Button
        type='text'
        style={{ background: 'none' }}
        icon={
          <MdChevronLeft
            size={25}
            style={{ position: 'relative', top: 4, marginRight: 5 }}
          />
        }
        onClick={subtractDate}
        hidden={dateCat === 'past7d' || dateCat === 'past30d'}
      />
      <Dropdown
        visible={dropdownVisible}
        overlay={DateMenu}
        placement='bottomCenter'
        {...props}
        className={`dropdown-date ${props.className}`}
      >
        <Button
          type='text'
          icon={
            <HiOutlineCalendar
              size={20}
              style={{ position: 'relative', top: 4, marginRight: 5 }}
            />
          }
          style={{
            background: 'none',
          }}
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
          {generateDate()}
        </Button>
      </Dropdown>
      <Button
        type='text'
        style={{ background: 'none' }}
        icon={
          <MdChevronRight
            size={25}
            style={{ position: 'relative', top: 4, marginRight: 5 }}
          />
        }
        onClick={addDate}
        disabled={disableNext}
        hidden={dateCat === 'past7d' || dateCat === 'past30d'}
      />
    </Space>
  );
};

export default DropdownDate;
