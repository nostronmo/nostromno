import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'error-much-requests',
  imports: [RouterLink],
  templateUrl: './much-requests.html',
})
export default class TooMuchRequests {
  reloadPage(): void {
    window.location.reload();
  }
}
