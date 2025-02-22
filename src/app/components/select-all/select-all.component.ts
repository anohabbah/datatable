import { I18nPluralPipe } from '@angular/common';
import { Component, computed, DestroyRef, forwardRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatPseudoCheckbox, MatPseudoCheckboxState } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { startWith } from 'rxjs';
import { map } from 'rxjs/operators';

export type Option<T = any> = {
  label: string;
  value: T;
};

@Component({
  selector: 'dt-select-all',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatInput,
    MatPseudoCheckbox,
    I18nPluralPipe,
  ],
  templateUrl: './select-all.component.html',
  styleUrl: './select-all.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DtSelectAllComponent),
      multi: true,
    },
  ],
})
export class DtSelectAllComponent implements OnInit, ControlValueAccessor {
  #destroyRef = inject(DestroyRef);

  label = input('Select options');
  options = input<Option[]>([]);

  withMore = {
    '=1': '+# other',
    other: '+# others',
  };

  protected readonly selectControl = new FormControl<Option[]>([]);
  protected readonly query = signal('');
  filteredOptions = computed(() => {
    return this.options().filter((option) => option.label.toLowerCase().includes(this.query().toLowerCase().trim()));
  });

  selectAllState = toSignal<MatPseudoCheckboxState>(
    this.selectControl.valueChanges.pipe(
      startWith([]),
      map((value) => {
        const currentValue = value || [];
        if (currentValue.length === 0) return 'unchecked';
        if (currentValue.length < this.options().length) return 'indeterminate';
        return 'checked';
      })
    )
  );

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  #onChange: (value: any) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  #onTouched: () => void = () => {};

  ngOnInit(): void {
    this.selectControl.valueChanges.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((value) => {
      this.#onChange(value || []);
    });
  }

  onOpenedChange(opened: boolean) {
    if (!opened) return;

    this.query.set('');
  }

  isAllSelected() {
    const currentValue = this.selectControl.value || [];
    return currentValue.length > 0 && currentValue.length === this.options().length;
  }

  toggleSelectAll(event: Event) {
    event.stopPropagation();
    if (this.isAllSelected()) {
      this.selectControl.setValue([]);
    } else {
      this.selectControl.setValue(this.options().map(({ value }) => value));
    }
  }

  onSelectionChange(event: any) {
    if (event.value?.includes('SELECT_ALL')) {
      this.toggleSelectAll(event);
    }
  }

  // Control value accessor methods
  writeValue(obj: any): void {
    this.selectControl.setValue(obj || []);
  }

  registerOnChange(fn: any): void {
    this.#onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.#onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.selectControl.disable();
    } else {
      this.selectControl.enable();
    }
  }
}
