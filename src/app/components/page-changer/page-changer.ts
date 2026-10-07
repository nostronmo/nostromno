import { Component, input, output } from '@angular/core';

@Component({
  selector: 'page-changer',
  imports: [],
  templateUrl: './page-changer.html',
})
export class PageChanger {
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  isLoading = input<boolean>(false);

  pageChange = output<number>();

  onNavigate(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.pageChange.emit(newPage);
    }
  }
}
