import { Component, inject } from '@angular/core';
import { FooterActions } from '../footer-actions/footer-actions';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [FooterActions],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  currentYear = new Date().getFullYear();
}
