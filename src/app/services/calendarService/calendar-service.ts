import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, map, withLatestFrom, tap, combineLatest, filter, Subject } from 'rxjs';

export type Days = {
  day: number;
  dayIndex: number;
  dayName: string;
  month: string;
  fullDate: string;
  is_current: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  currentMonthFormatted = new Date().getFullYear() + '-' + new Date().getMonth();
  currentMonth$ = new BehaviorSubject<string>(this.currentMonthFormatted.toString());
  selectedWeek$ = new BehaviorSubject<number | null>(null);
  view$ = new BehaviorSubject<'day' | 'week' | 'month'>('month');
  totalWeeks = 0;
  currentWeek = 0;
  currentMonthFormControl = new FormControl('');
  selectedDayView = new BehaviorSubject<boolean>(false);
  firstDayIndex = 0;
  lastDayIndex = 0;
  prependedDays = 0;
  appendedDays = 0;

  currentDate$ = this.currentMonth$.pipe(
    map((date: any) => {
      return date.toString();
    }),
    map((date: string) => {
      const d = date.split('-');
      const formatted = d[0] + '-' + (Number(d[1]) + 1).toString().padStart(2, '0');
      return new Date(formatted);
    }),
  ); // for template use only

  viewChange$ = this.view$.pipe(
    withLatestFrom(this.currentMonth$),
    map(([view, currentMonth]) => {
      return {
        view,
        currentMonth,
      };
    }),
    tap(({ view, currentMonth }) => {
      if (view == 'week' || view == 'day') {
        if (view == 'day') {
          this.selectedDayView.next(true);
        } else {
          this.selectedDayView.next(false);
        }
        if (currentMonth == this.currentMonthFormatted.toString()) {
          this.selectedWeek$.next(this.currentWeek + 1);
          if (view == 'day') {
            let dayIndex = new Date().getDay();
            this.dayIndexCounter.next(dayIndex);
          }
        } else {
          this.selectedWeek$.next(1);
          this.dayIndexCounter.next(this.firstDayIndex);
        }
      } else {
        this.selectedWeek$.next(null);
        this.selectedDayView.next(false);
        this.dayIndexCounter.next(this.firstDayIndex);
      }
    }),
  );

  getWeeks$ = combineLatest([this.currentMonth$, this.selectedWeek$]).pipe(
    map(([date, week]) => {
      let [year, month] = date.split('-');
      let formatted = String(year + '-' + (Number(month) + 1).toString().padStart(2, '0'));
      this.currentMonthFormControl.setValue(formatted);
      let firstDay = new Date(Number(year), Number(month), 1).getDay();
      this.firstDayIndex = firstDay;
      this.lastDayIndex = new Date(Number(year), Number(month) + 1, 0).getDay();
      let lastDay = new Date(Number(year), Number(month) + 1, 0).getDate();
      this.totalWeeks = Math.ceil((firstDay + lastDay) / 7);
      return {
        year: year,
        month: month,
        lastDay: lastDay,
        week: week,
      };
    }),
    map((data) => {
      // adding all the days of the current month to days array
      let days: Array<Days> = [];
      for (let i = 1; i <= data.lastDay; i++) {
        let date = new Date(Number(data.year), Number(data.month), i);
        days.push({
          day: date.getDay(),
          dayIndex: date.getDate(),
          dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          fullDate:
            data.year +
            '-' +
            (Number(data.month) + 1).toString().padStart(2, '0') +
            '-' +
            date.getDate().toString().padStart(2, '0'),
          is_current: true,
        });
      }
      return { days, data };
    }),
    map(({ days, data }) => {
      // prepend previous month's days if the current month first day doesnot start on a sunday
      let firstDay = days[0].day;
      let prependToFirstWeek: Array<Days> = [];

      if (firstDay > 0) {
        let prevMonthYear = Number(data.month) !== 0 ? Number(data.year) : Number(data.year) - 1;
        let prevMonth = Number(data.month) !== 0 ? Number(data.month) - 1 : 11;
        let prevMonthLastDay = new Date(prevMonthYear, prevMonth + 1, 0).getDate();
        let prevMonthDays = [];
        for (let i = 1; i <= prevMonthLastDay; i++) {
          let date = new Date(prevMonthYear, prevMonth, i);
          prevMonthDays.push({
            day: date.getDay(),
            dayIndex: date.getDate(),
            dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            fullDate:
              prevMonthYear +
              '-' +
              (Number(prevMonth) + 1).toString().padStart(2, '0') +
              '-' +
              date.getDate().toString().padStart(2, '0'),
            is_current: false,
          });
        }

        prependToFirstWeek = prevMonthDays.slice(-firstDay);
        days = [...prependToFirstWeek, ...days];
      }

      return { days, data, prependDays: prependToFirstWeek.length };
    }),
    map(({ days, data, prependDays }) => {
      //append next month's days if the last week of the current month does not have 7 days
      let groupedDays = this.groupDaysByWeeks(days);
      let appendToLastWeek: Array<Days> = [];
      if (groupedDays[groupedDays.length - 1].length < 7) {
        //checking if the last week contains less than 7 days
        let nextMonthYear = Number(data.month) !== 11 ? Number(data.year) : Number(data.year) + 1;
        let nextMonth = Number(data.month) !== 11 ? Number(data.month) + 1 : 0;
        let nextMonthLastDay = new Date(nextMonthYear, nextMonth + 1, 0).getDate();
        let nextMonthDays = [];

        for (let i = 1; i <= nextMonthLastDay; i++) {
          let date = new Date(nextMonthYear, nextMonth, i);
          nextMonthDays.push({
            day: date.getDay(),
            dayIndex: date.getDate(),
            dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            fullDate:
              data.year +
              '-' +
              (Number(data.month) + 1).toString().padStart(2, '0') +
              '-' +
              date.getDate().toString().padStart(2, '0'),
            is_current: false,
          });
        }

        let sliceNumber = 7 - groupedDays[groupedDays.length - 1].length;
        appendToLastWeek = nextMonthDays.slice(0, sliceNumber);

        groupedDays[groupedDays.length - 1] = [
          ...groupedDays[groupedDays.length - 1],
          ...appendToLastWeek,
        ];
      }
      return { groupedDays, data, prependDays, appendDays: appendToLastWeek.length };
    }),
    map(({ groupedDays, data, prependDays, appendDays }) => {
      // find current week

      const year = new Date().getFullYear();
      const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
      const day = new Date().getDate().toString().padStart(2, '0');

      let fullDate = year + '-' + month + '-' + day;
      this.currentWeek = groupedDays.findIndex((week: Array<Days>) => {
        return week.find((wk: Days) => wk.fullDate == fullDate);
      });

      return {
        group: groupedDays,
        week: data.week,
        prependDays,
        appendDays,
      };
    }),
    tap((data) => {
      this.prependedDays = data.prependDays;
      this.appendedDays = data.appendDays;
    }),
  );

  dayIndexCounter = new BehaviorSubject<number>(0);

  getSelectedDay$ = combineLatest([
    this.selectedDayView,
    this.dayIndexCounter,
    this.getWeeks$,
  ]).pipe(
    map(([view, index, weeks]) => {
      return view
        ? weeks.week == null
          ? null
          : weeks.group[weeks.week - 1]
            ? weeks.group[weeks.week - 1].find((week) => week.day == index)
            : null
        : null;
    }),
  );

  groupDaysByWeeks(days: Array<Days>): Array<Array<Days>> {
    const result = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }

    return result;
  }

  changeCalendarView(view: 'day' | 'week' | 'month') {
    this.view$.next(view);
  }

  checkDateForToday(date: string) {
    return new Date().setHours(0, 0, 0, 0) == new Date(date).setHours(0, 0, 0, 0);
  }

  changeMonth(event: any, week?: 'start' | 'end' | 'current') {
    let [year, month] = event.target.value.split('-');
    let formattedDate =
      year +
      '-' +
      (Number(month) - 1 > 0 ? (Number(month) - 1).toString().padStart(2, '0') : Number(month) - 1);

    this.currentMonth$.next(formattedDate.toString());
    if (this.view$.getValue() == 'week' || this.view$.getValue() == 'day') {
      if (this.currentMonth$.getValue() == formattedDate.toString()) {
        this.selectedWeek$.next(this.currentWeek + 1);
      }
      if (week == 'start') {
        this.selectedWeek$.next(1);
        if (this.view$.getValue() == 'day') {
          this.dayIndexCounter.next(this.prependedDays);
        }
      }
      if (week == 'end') {
        this.selectedWeek$.next(this.totalWeeks);
        if (this.view$.getValue() == 'day') {
          this.dayIndexCounter.next(6 - this.appendedDays);
        }
      }
      if (week == 'current') {
        this.selectedWeek$.next(this.currentWeek + 1);
        if (this.view$.getValue() == 'day') {
          let dayIndex = new Date().getDay();
          this.dayIndexCounter.next(dayIndex);
        }
      }
    }
  }

  gotoToday() {
    let date = new Date();
    let year = date.getFullYear();
    let month =
      date.getMonth() > 0
        ? Number(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')
        : date.getMonth() + 1;
    let value = year + '-' + month;
    this.changeMonth(
      {
        target: {
          value: value,
        },
      },
      'current',
    );
  }

  gotoPrev() {
    if (this.view$.getValue() == 'day') {
      if (this.selectedWeek$.getValue() == 1) {
        if (this.dayIndexCounter.getValue() - 1 >= this.prependedDays) {
          this.dayIndexCounter.next(this.dayIndexCounter.getValue() - 1);
        } else {
          this.gotoPrevWeek();
        }
      } else {
        if (this.dayIndexCounter.getValue() - 1 >= 0) {
          this.dayIndexCounter.next(this.dayIndexCounter.getValue() - 1);
        } else {
          this.gotoPrevWeek();
        }
      }
      return;
    }
    if (this.view$.getValue() == 'week') {
      this.gotoPrevWeek();
      return;
    }
    this.gotoPrevMonth();
  }

  gotoPrevWeek() {
    if (Number(this.selectedWeek$.getValue()) - 1 > 0) {
      if (this.view$.getValue() == 'day') {
        this.dayIndexCounter.next(6);
      }
      this.selectedWeek$.next(Number(this.selectedWeek$.getValue()) - 1);
    } else {
      this.gotoPrevMonth();
    }
  }

  gotoPrevMonth(checkWeek?: boolean) {
    const currentDate = this.currentMonth$.getValue();
    const [year, month] = currentDate.split('-');
    const prevYear = Number(month) > 0 ? year : Number(year) - 1;
    const prevMonth = Number(month) > 0 ? Number(month) : 12;

    const formattedDate = prevYear + '-' + prevMonth;
    this.changeMonth(
      {
        target: {
          value: formattedDate,
        },
      },
      'end',
    );
    // this.selectedWeek$.next(this.totalWeeks);
  }

  gotoNext() {
    if (this.view$.getValue() == 'day') {
      if (this.selectedWeek$.getValue() == this.totalWeeks) {
        if (this.dayIndexCounter.getValue() < 6 - this.appendedDays) {
          this.dayIndexCounter.next(this.dayIndexCounter.getValue() + 1);
        } else {
          this.dayIndexCounter.next(0);
          this.gotoNextWeek();
        }
      } else {
        if (this.dayIndexCounter.getValue() < 6) {
          this.dayIndexCounter.next(this.dayIndexCounter.getValue() + 1);
        } else {
          this.dayIndexCounter.next(0);
          this.gotoNextWeek();
        }
      }

      return;
    }
    if (this.view$.getValue() == 'week') {
      this.gotoNextWeek();
      return;
    }
    this.gotoNextMonth();
  }

  gotoNextWeek() {
    if (Number(this.selectedWeek$.getValue()) < this.totalWeeks) {
      this.selectedWeek$.next(Number(this.selectedWeek$.getValue()) + 1);
    } else {
      this.gotoNextMonth();
      // this.selectedWeek$.next(1);
    }
  }

  gotoNextMonth() {
    const currentDate = this.currentMonth$.getValue();
    const [year, month] = currentDate.split('-');
    const nextYear = Number(month) < 11 ? year : Number(year) + 1;
    const nextMonth = Number(month) < 11 ? Number(month) + 2 : 0;

    const formattedDate = nextYear + '-' + nextMonth;
    this.changeMonth(
      {
        target: {
          value: formattedDate,
        },
      },
      'start',
    );
  }

  getCurrentDayView(weeks: { group: Array<Array<Days>>; week: number | null }) {
    return weeks.group[weeks.week! - 1][0];
  }
}
