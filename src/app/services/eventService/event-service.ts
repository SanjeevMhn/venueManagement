import { computed, Injectable, signal, WritableSignal } from '@angular/core';
export type EventType = {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  date: string;
};

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private eventData: WritableSignal<Array<EventType | null>> = signal([
    {
      id: Date.now(),
      name: 'Ashwariya and Abhishek Engagement',
      start_time: '09:00 AM',
      end_time: '13:00 PM',
      date: '2026-02-02',
    },
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

  sortedEvents = computed(() => {
    return this.eventData().sort(
      (a, b) => new Date(a!.date).getTime() - new Date(b!.date).getTime(),
    );
  });
}
