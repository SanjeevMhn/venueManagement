import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCalendarSidebar } from './event-calendar-sidebar';

describe('EventCalendarSidebar', () => {
  let component: EventCalendarSidebar;
  let fixture: ComponentFixture<EventCalendarSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCalendarSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventCalendarSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
