import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Calendar, ChevronLeft, ChevronRight, LucideAngularModule } from 'lucide-angular';
import { CalendarService } from '../../services/calendarService/calendar-service';

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

  calendarService = inject(CalendarService)

}
