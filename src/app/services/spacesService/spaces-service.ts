import { Injectable } from '@angular/core';
import { BehaviorSubject, of, switchMap } from 'rxjs';

export type SpaceType = {
  id: number;
  name: string;
  img: string;
  capacity: number;
  dimension: number;
  location: 'indoor' | 'outdoor';
  price: number;
};

@Injectable({
  providedIn: 'root',
})
export class SpacesService {
  activeSpaceType = new BehaviorSubject<'indoor' | 'outdoor' | 'all'>('all');
  spacesListArray: Array<SpaceType> = [
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
  spacesList$ = this.activeSpaceType.pipe(
    switchMap((location) => {
      return location == 'all'
        ? of(this.spacesListArray)
        : of(this.spacesListArray.filter((space) => space.location == location));
    }),
  );
}
