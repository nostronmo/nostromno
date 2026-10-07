import { Component } from '@angular/core';
import { HeaderActions } from '../header-actions/header-actions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule, HeaderActions],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
