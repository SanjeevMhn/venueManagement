import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CirclePlus, LucideAngularModule, TriangleRight, Users } from 'lucide-angular';
import { SpacesService } from '../../services/spacesService/spaces-service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-spaces',
  imports: [LucideAngularModule, RouterLink, AsyncPipe],
  templateUrl: './spaces.html',
  styleUrl: './spaces.css',
})
export class Spaces {
  add = CirclePlus;
  people = Users
  ruler = TriangleRight

  spacesService = inject(SpacesService)


}
