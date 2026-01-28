import { Component, inject, output, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  Calendars,
  ChevronRight,
  Clipboard,
  LayoutDashboard,
  LucideAngularModule,
  LucideIconData,
  Map,
  Settings,
  X,
} from 'lucide-angular';
import { EventCalendarSidebar } from "../../components/event-calendar-sidebar/event-calendar-sidebar";

@Component({
  selector: 'app-sidebar',
  imports: [LucideAngularModule, RouterLink, RouterLinkActive,EventCalendarSidebar],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
   hideSidebar = output<boolean>();

  currentRoute = inject(Router);
  showEventMenu = signal(false);

  close = X;
  chevronRight = ChevronRight

  menuItems: Array<{
    id: number;
    name: string;
    route: string;
    icon: LucideIconData;
  }> = [
    {
      id: 1,
      name: 'Dashboard',
      route: 'dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 2,
      name: 'Events',
      route: 'events',
      icon: Calendars,
    },
    {
      id: 3,
      name: 'Spaces',
      route: 'spaces',
      icon: Map,
    },
    {
      id: 5,
      name: 'Report',
      route: 'report',
      icon: Clipboard,
    },
    {
      id: 6,
      name: 'Settings',
      route: 'settings',
      icon: Settings,
    },
  ];

  checkRoute(route: string) {
    if (route == 'events') {
      this.showEventMenu.set(true)
    };
  }

  hideSidebarEvent(route:string){
    if(route == 'events'){
      this.showEventMenu.set(true)
      return
    }
    this.hideSidebar.emit(true)
  }
}
