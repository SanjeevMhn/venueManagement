import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './common/sidebar/sidebar';
import { Navbar } from './common/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('venue-management');

  sidebarState: boolean = false;

  toggleSidebar(state?: boolean) {
    if (!state) {
      this.sidebarState = !this.sidebarState;
      return;
    }
    this.sidebarState = state;
  }
}
