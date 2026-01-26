import { Component, EventEmitter, Output, output } from '@angular/core';
import {
  Bell,
  ChevronDown,
  LucideAngularModule,
  Menu,
  MessageSquare,
  Search,
} from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  imports: [LucideAngularModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  search = Search;
  notify = Bell;
  message = MessageSquare;
  menu = Menu;
  chevronDown = ChevronDown;

  @Output() toggleSidebarEvent = new EventEmitter<void>();

  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }
}
