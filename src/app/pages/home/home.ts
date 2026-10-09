import { Component, inject } from '@angular/core';
import { LocaleStore } from '../../../assets/locale/locale.store';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
})
export class Home {
  readonly locale = inject(LocaleStore);
}
