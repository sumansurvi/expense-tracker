import { Component } from '@angular/core';
import { TransactionService } from '../transaction.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-view.component.html',
  styleUrl: './summary-view.component.scss'
})
export class SummaryViewComponent {

  totalIncome = 0;
  totalExpenses = 0;

  constructor(private transactionService: TransactionService) { }

  ngOnInit() {
    this.transactionService.totalIncome$.subscribe(totalIncome => this.totalIncome = totalIncome);
    this.transactionService.totalExpenses$.subscribe(totalExpenses => this.totalExpenses = totalExpenses);
  }

}