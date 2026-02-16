import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Calendar, ChevronLeft, ChevronRight, LucideAngularModule } from 'lucide-angular';
import { CalendarService, Days } from '../../services/calendarService/calendar-service';
import { EventService, EventType } from '../../services/eventService/event-service';

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

  calendarService = inject(CalendarService);
  eventService = inject(EventService);

  hourList = [
    '08:00 AM',
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '13:00 PM',
    '14:00 PM',
    '15:00 PM',
    '16:00 PM',
    '17:00 PM',
    '18:00 PM',
    '19:00 PM',
    '20:00 PM',
    '21:00 PM',
    '22:00 PM',
    '23:00 PM',
  ];

  checkEventInCurrentWeek(weekGroup: Array<Days>, event: EventType) {
    return weekGroup.findIndex((week) => week.fullDate == event.date) !== -1
      ? weekGroup.findIndex((week) => week.fullDate == event.date) + 2
      : -1;
  }

  getEventTimeSpan(event: EventType): string {
    return `${this.hourList.findIndex((hr) => hr == event.start_time) + 1} / ${this.hourList.findIndex((hr) => hr == event.end_time) + 2}`;
  }

  gotoDay(event: any) {
    let date = event.target.value;
    let weekIndex= this.calendarService.groupedDays.findIndex((weeks: Array<Days>) => {
      return weeks.find((wk: Days) => wk.fullDate == date);
    });
    let day = this.calendarService.groupedDays[weekIndex].find((wk: Days) => wk.fullDate == date)
    console.log(weekIndex, day)
    if (day) {
      this.calendarService.getCurrentSelectedDate(day);
    }
  }
}
