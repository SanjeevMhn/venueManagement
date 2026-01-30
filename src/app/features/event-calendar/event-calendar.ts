import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Calendar, ChevronLeft, ChevronRight, LucideAngularModule } from 'lucide-angular';
import { CalendarService, Days } from '../../services/calendarService/calendar-service';

type EventType = {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  date: string;
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

  calendarService = inject(CalendarService);

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

  eventData: WritableSignal<Array<EventType | null>> = signal([
    {
      id: Date.now(),
      name: "Dikchhya's Wedding",
      start_time: '12:00 PM',
      end_time: '17:00 PM',
      date: '2026-01-28',
    },
    {
      id: Date.now(),
      name: "Dikchhya's Wedding",
      start_time: '12:00 PM',
      end_time: '17:00 PM',
      date: '2026-01-29',
    },
    {
      id: Date.now(),
      name: 'Company Anniversary',
      start_time: '09:00 AM',
      end_time: '12:00 PM',
      date: '2026-01-26',
    },

    {
      id: Date.now(),
      name: 'Senior Yoga Class',
      start_time: '08:00 AM',
      end_time: '10:00 AM',
      date: '2026-01-27',
    },
    {
      id: Date.now(),
      name: 'Kids Yoga Class',
      start_time: '09:00 AM',
      end_time: '10:00 AM',
      date: '2026-01-29',
    },
    {
      id: Date.now(),
      name: 'Fintech Meeting',
      start_time: '08:00 AM',
      end_time: '10:00 AM',
      date: '2026-01-25',
    },
  ]);

  sortedEvent = computed(() => {
    return this.eventData().sort(
      (a, b) => new Date(a!.date).getTime() - new Date(b!.date).getTime(),
    );
  });

  checkEventInCurrentWeek(weekGroup: Array<Days>, event: EventType) {
    return weekGroup.findIndex((week) => week.fullDate == event.date) !== -1
      ? weekGroup.findIndex((week) => week.fullDate == event.date) + 2
      : -1;
  }

  getEventTimeSpan(event: EventType): string {
    return `${this.hourList.findIndex((hr) => hr == event.start_time) + 1} / ${this.hourList.findIndex((hr) => hr == event.end_time) + 2}`;
  }
}
