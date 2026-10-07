import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleStore } from '../../../assets/locale/locale.store';

@Component({
  selector: 'header-actions',
  imports: [],
  templateUrl: './header-actions.html',
  styleUrl: './header-actions.scss',
})
export class HeaderActions {
  readonly locale = inject(LocaleStore);
}
