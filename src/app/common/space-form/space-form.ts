import { Component, computed, effect, signal, WritableSignal } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  Check,
  Grid2x2,
  Info,
  LucideAngularModule,
  LucideIconData,
  Users,
  Wifi,
} from 'lucide-angular';

@Component({
  selector: 'app-space-form',
  imports: [LucideAngularModule],
  templateUrl: './space-form.html',
  styleUrl: './space-form.css',
})
export class SpaceForm {
  checkIcon = Check;

  spaceForm:FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    space_type: new FormControl('',[Validators.required]),
    space_dimension: new FormControl('', [Validators.required]),
    space_description: new FormControl(''),
    space_photos: new FormControl([], [Validators.minLength(1)])
  })

  multiStepList: WritableSignal<
    Array<{
      id: number;
      name: string;
      active: boolean;
      completed: boolean;
      icon: LucideIconData;
    }>
  > = signal([
    {
      id: 1,
      name: 'General Information',
      active: true,
      completed: false,
      icon: Info,
    },
    {
      id: 2,
      name: 'Capacity and Layout',
      active: false,
      completed: false,
      icon: Users,
    },
    {
      id: 3,
      name: 'Amenities',
      active: false,
      completed: false,
      icon: Wifi,
    },
    {
      id: 4,
      name: 'Photo Upload',
      active: false,
      completed: false,
      icon: Grid2x2,
    },
  ]);

  currentActiveStepId = computed(() => {
    return this.multiStepList().find(steps => steps.active)!.id
  })

  changeActiveStep(id: number) {
    this.multiStepList.update((steps) =>
      steps.map((step) =>
        step.id == id
          ? {
              ...step,
              active: true,
            }
          : {
            ...step,
            active: false
          },
      ),
    );
  }
}