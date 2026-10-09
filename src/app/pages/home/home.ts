import { Component, inject, OnInit } from '@angular/core';
import { LocaleStore } from '../../../assets/locale/locale.store';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  readonly locale = inject(LocaleStore);
  ngOnInit(): void {}
}
