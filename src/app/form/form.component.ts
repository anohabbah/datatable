import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { startWith, switchMap, tap } from 'rxjs';
import { DtSelectAllComponent } from '../components/select-all/select-all.component';
import { OptionService } from './option.service';

type TFilter = {
  option: string | null;
  activeOnly: boolean;
  all: string[];
};

type FilterForm = { [K in keyof TFilter]: FormControl<TFilter[K]> };

@Component({
  selector: 'dt-form',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    ReactiveFormsModule,
    DtSelectAllComponent,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent {
  readonly #fb = inject(FormBuilder);
  readonly #optionService = inject(OptionService);

  readonly loadingOptions = signal(false);

  readonly filter = this.#fb.group<FilterForm>({
    option: this.#fb.control(null),
    activeOnly: this.#fb.control(true, { nonNullable: true }),
    all: this.#fb.control([], { nonNullable: true }),
  });

  get active() {
    return this.filter.get('activeOnly') as FormControl<boolean>;
  }

  get optionCtrl() {
    return this.filter.get('option') as FilterForm['option'];
  }

  protected readonly options = toSignal(
    this.active.valueChanges.pipe(
      startWith(true),
      tap(() => this.loadingOptions.set(true)),
      switchMap((active) =>
        this.#optionService.getOptions(active ? { active } : {}).pipe(
          tap((options) => {
            this.loadingOptions.set(false);
            this.optionCtrl.setValue(options[0]?.id ?? null);
          })
        )
      )
    ),
    { initialValue: [] }
  );

  selectAllOptions = computed(() => {
    return this.options().map((option) => ({ label: option.label, value: option }));
  });

  constructor() {
    // disable option control when loading options
    effect(() => {
      if (this.loadingOptions()) {
        this.optionCtrl.disable();
      } else {
        this.optionCtrl.enable();
      }
    });
  }
}
