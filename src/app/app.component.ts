import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SummaryViewComponent } from "./summary-view/summary-view.component";
import { TransactionListComponent } from "./transaction-list/transaction-list.component";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, SummaryViewComponent, TransactionListComponent]
})
export class AppComponent {
}
