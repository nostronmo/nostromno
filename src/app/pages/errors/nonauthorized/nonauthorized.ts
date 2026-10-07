import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'error-not-authorized',
  imports: [RouterLink],
  templateUrl: './nonauthorized.html',
})
export default class NotAuthorized {}
