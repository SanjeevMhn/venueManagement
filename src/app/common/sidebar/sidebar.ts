import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { Calendar, Calendars, Clipboard, LayoutDashboard, LucideAngularModule, LucideIconData, Map, Settings, X } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  imports: [LucideAngularModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  @Output() hideSidebar = new EventEmitter<boolean>()

  close = X

  menuItems: Array<{
    id: number,
    name: string,
    route: string,
    icon: LucideIconData
  }> = [
      {
        id: 1,
        name: 'Dashboard',
        route: 'dashboard',
        icon: LayoutDashboard
      },
      {
        id: 2,
        name: 'Events',
        route: 'events',
        icon: Calendars
      },
      {
        id: 3,
        name: 'Spaces',
        route: 'spaces',
        icon: Map
      },
      {
        id: 4,
        name: 'Calendar',
        route: 'calendar',
        icon: Calendar
      },
      {
        id: 5,
        name: 'Report',
        route: 'report',
        icon: Clipboard
      },
      {
        id: 6,
        name: 'Settings',
        route: 'settings',
        icon: Settings
      }
    ]

}
