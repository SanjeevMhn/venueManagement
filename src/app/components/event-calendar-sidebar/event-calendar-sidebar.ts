import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { ChevronLeft, ChevronRight, LucideAngularModule } from 'lucide-angular';
import { CalendarService, Days } from '../../services/calendarService/calendar-service';
import { EventService, EventType } from '../../services/eventService/event-service';

@Component({
  selector: 'app-event-calendar-sidebar',
  imports: [LucideAngularModule, AsyncPipe, DatePipe, CommonModule],
  templateUrl: './event-calendar-sidebar.html',
  styleUrl: './event-calendar-sidebar.css',
})
export class EventCalendarSidebar {
  showMenu = output<boolean>();

  calendarService = inject(CalendarService);
  eventService = inject(EventService);
  chevronLeft = ChevronLeft;
  chevronRight = ChevronRight;

  gotoDay(date: Days) {
    this.calendarService.getCurrentSelectedDate(date);
  }

  checkIfEventExistOnDay(date: string):boolean {
    if(this.eventService.sortedEvents().length > 0){
      return this.eventService.sortedEvents().find(evt => evt?.date == date) ? true: false
    }
    return false
  }
}
