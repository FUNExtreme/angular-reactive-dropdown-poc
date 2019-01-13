import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { takeUntil, switchMap, map, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  selector: 'bromo-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DropdownComponent,
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  private destroy$ = new Subject();

  @ViewChild(NgControl) ngControl: NgControl;

  private onTouchedFn: () => void;
  private onChangeFn: (_: any) => void;

  itemsSource$ = new BehaviorSubject<any[]>([]);
  @Input() set items(value: any[]) {
    this.itemsSource$.next(value);
  }

  displayTransformer$ = new BehaviorSubject<string>('text');
  @Input() set display(value) {
    this.displayTransformer$.next(value);
  }

  valueTransformer$ = new BehaviorSubject<string>('value');
  @Input() set value(value) {
    this.valueTransformer$.next(value);
  }

  transformers$ = combineLatest(this.displayTransformer$, this.valueTransformer$);

  items$ = this.itemsSource$.pipe(
    distinctUntilChanged(),
    tap(() => this.ngControl.control.reset()),
    switchMap((items: []) => this.transformers$.pipe(map(([displayResolver, valueResolver]) =>
      items.map((value) => ({
        display: value[displayResolver],
        value: value[valueResolver]
      }))
    )))
  );

  constructor() {}

  ngOnInit() {
    this.ngControl.valueAccessor.registerOnTouched(this.onTouchedFn);

    this.ngControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => this.onChangeFn(val));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChangeFn = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  writeValue(value: any): void {
    this.ngControl.valueAccessor.writeValue(value);
  }

  setDisabledState(isDisabled: boolean): void {
    this.ngControl.valueAccessor.setDisabledState(isDisabled);
  }
}
