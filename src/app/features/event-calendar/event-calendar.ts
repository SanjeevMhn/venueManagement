import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Calendar, ChevronLeft, ChevronRight, LucideAngularModule } from 'lucide-angular';
import { BehaviorSubject, combineLatest, first, map, tap, withLatestFrom } from 'rxjs';

type Days = {
  day: number;
  dayIndex: number;
  dayName: string;
  month: string;
  fullDate: string;
  is_current: boolean;
};

@Component({
  selector: 'app-event-calendar',
  imports: [AsyncPipe, DatePipe, LucideAngularModule, CommonModule, ReactiveFormsModule],
  templateUrl: './event-calendar.html',
  styleUrl: './event-calendar.css',
})
export class EventCalendar {
  chevronLeft = ChevronLeft;
  chevronRight = ChevronRight;
  calendar = Calendar;

  currentMonthFormatted = new Date().getFullYear() + '-' + new Date().getMonth();
  currentMonth$ = new BehaviorSubject<string>(this.currentMonthFormatted.toString());
  selectedWeek$ = new BehaviorSubject<number | null>(null);
  view$ = new BehaviorSubject<'day' | 'week' | 'month'>('month');
  totalWeeks = 0;
  currentWeek = 0;
  currentMonthFormControl = new FormControl('');

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
      if (view == 'week') {
        if (currentMonth == this.currentMonthFormatted.toString()) {
          this.selectedWeek$.next(this.currentWeek + 1);
        } else {
          this.selectedWeek$.next(1);
        }
      } else {
        this.selectedWeek$.next(null);
      }
    }),
  );

  getWeeks$ = combineLatest([this.currentMonth$, this.selectedWeek$]).pipe(
    map(([date, week]) => {
      let [year, month] = date.split('-');
      let formatted = String(year + '-' + (Number(month) + 1).toString().padStart(2, '0'));
      this.currentMonthFormControl.setValue(formatted);
      let firstDay = new Date(Number(year), Number(month), 1).getDay();
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
              data.year +
              '-' +
              (Number(data.month) + 1).toString().padStart(2, '0') +
              '-' +
              date.getDate().toString().padStart(2, '0'),
            is_current: false,
          });
        }

        let prependToCurrentMonth = prevMonthDays.slice(-firstDay);
        days = [...prependToCurrentMonth, ...days];
      }

      return { days, data };
    }),
    map(({ days, data }) => {
      //append next month's days if the last week of the current month does not have 7 days
      let groupedDays = this.groupDaysByWeeks(days);
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
        let appendToLastWeek = nextMonthDays.slice(0, sliceNumber);

        groupedDays[groupedDays.length - 1] = [
          ...groupedDays[groupedDays.length - 1],
          ...appendToLastWeek,
        ];
      }
      return { groupedDays, data };
    }),
    map(({ groupedDays, data }) => {
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
      };
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

  changeMonth(event: any) {
    let [year, month] = event.target.value.split('-');
    let formattedDate =
      year +
      '-' +
      (Number(month) - 1 > 0 ? (Number(month) - 1).toString().padStart(2, '0') : Number(month) - 1);
    this.currentMonth$.next(formattedDate.toString());
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
    this.changeMonth({
      target: {
        value: value,
      },
    });
  }
}
