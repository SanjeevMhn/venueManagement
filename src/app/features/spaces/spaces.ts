import { Component, signal, WritableSignal } from '@angular/core';
import { CirclePlus, LucideAngularModule } from 'lucide-angular';

type SpaceType = {
  id: number;
  name: string;
  img: string;
  capacity: number;
  dimension: number;
  location: 'indoor' | 'outdoor';
  price: number;
};

@Component({
  selector: 'app-spaces',
  imports: [LucideAngularModule],
  templateUrl: './spaces.html',
  styleUrl: './spaces.css',
})
export class Spaces {
  add = CirclePlus;
  spacesList: Array<SpaceType> = [
    {
      id: Date.now(),
      name: 'Grand Ballroom',
      img: '',
      capacity: 500,
      dimension: 12000,
      location: 'indoor',
      price: 1200,
    },
    {
      id: Date.now(),
      name: 'Sunset Terrace',
      img: '',
      capacity: 200,
      dimension: 8500,
      location: 'outdoor',
      price: 550,
    },
    {
      id: Date.now(),
      name: 'Meeting Room',
      img: '',
      capacity: 30,
      dimension: 200,
      location: 'indoor',
      price: 250,
    },
  ];

  activeSpaceType: WritableSignal<'indoor' | 'outdoor' | 'all'> = signal('indoor');
}
