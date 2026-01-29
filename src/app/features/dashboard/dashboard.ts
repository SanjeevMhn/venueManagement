import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Banknote, ClipboardClock, Currency, LucideAngularModule, LucideIconData, MessageCircleQuestionMark } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

 dashboardCards:Array<{
    id: number, 
    name: string,
    link?: string,
    data: string,
    icon: LucideIconData
  }> = [
    {
      id: 1,
      name: 'Total Revenue',
      data: 'Rs. 2,75,000.00',
      icon: Banknote 
    },
    {
      id: 2,
      name: 'Active Bookings',
      data: '130',
      icon: ClipboardClock
    },
    {
      id: 3,
      name: 'New Inquiries',
      data: '50',
      icon: MessageCircleQuestionMark
    }
  ]

  eventListToday:Array<{
    id: number,
    name: string,
    client_name: string,
    time: string,
    space: string,
    status: string
  }> = [
    {
      id: 1, 
      name: "Global Tech Summit",
      client_name: "Innovate Corp",
      time: "9:00 - 12:00",
      space: 'Grand Ballroom',
      status: 'Ongoing'
    },
    {
      id: 2,
      name: 'Sarah & Mike Wedding',
      client_name: 'Private',
      time: "15:00 - 19:00",
      space: "Garden Terrace",
      status: "Preparing"
    },
    {
      id: 3,
      name: 'Productive Strategy Workshop',
      client_name: 'Pixel Studio',
      time: '13:00 - 14:00',
      space: 'Boardroom A',
      status: 'Confirmed'
    },
    {
      id: 4,
      name: 'Jazz Night Rehearsal',
      client_name: "Arts Council",
      time: '18:00 - 21:00',
      space: 'Lounge West',
      status: 'Preparing'
    }
  ]
}
