import { Component } from '@angular/core';
import { SpinnerService } from '../app/services/spinner.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pogled-unutra-blog';

  loading$ = this.spinnerService.loading$;

  constructor(private spinnerService: SpinnerService) {}
}
