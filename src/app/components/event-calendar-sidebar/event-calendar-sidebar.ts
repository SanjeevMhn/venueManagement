import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { ChevronLeft, ChevronRight, LucideAngularModule } from 'lucide-angular';
import { CalendarService } from '../../services/calendarService/calendar-service';

@Component({
  selector: 'app-event-calendar-sidebar',
  imports: [LucideAngularModule, AsyncPipe, DatePipe],
  templateUrl: './event-calendar-sidebar.html',
  styleUrl: './event-calendar-sidebar.css',
})
export class EventCalendarSidebar {

  showMenu = output<boolean>()
  
  calendarService = inject(CalendarService)
  chevronLeft = ChevronLeft
  chevronRight = ChevronRight

}
