import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { Transaction, TransactionService } from '../transaction.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.scss'
})
export class TransactionFormComponent implements OnInit {

  @Input() editTransaction: any;  // Transaction to be edited
  @Output() formSubmitted = new EventEmitter<void>();

  description = '';
  amount: number | null = null;
  date = '';
  type: 'income' | 'expense' = 'expense';
  id: number | null = null;

  constructor(private transactionService: TransactionService) { }

  ngOnInit() {
    if (this.editTransaction) {
      this.description = this.editTransaction.description;
      this.amount = this.editTransaction.amount;
      this.date = this.editTransaction.date;
      this.type = this.editTransaction.type;
      this.id = this.editTransaction.id;
    }
  }

  ngOnChanges() {
    if (this.editTransaction) {
      this.description = this.transactionService.validateText(this.editTransaction.description);
      this.amount = this.transactionService.validateNumber(this.editTransaction.amount);
      this.date = this.editTransaction.date;
      this.type = this.editTransaction.type;
      this.id = this.editTransaction.id;
    }
  }

  // Submit the form to add or edit a transaction
  submitForm() {
    if (this.id === null) {
      // Add new transaction
      const newTransaction: Transaction = {
        id: Date.now(), // Unique ID based on current timestamp
        description: this.transactionService.validateText(this.description),
        amount: this.transactionService.validateNumber(this.amount!),
        date: this.date,
        type: this.type
      };
      this.transactionService.addTransaction(newTransaction);
    } else {
      // Edit existing transaction
      const updatedTransaction: Transaction = {
        id: this.id,
        description: this.description,
        amount: this.transactionService.validateNumber(this.amount!),
        date: this.date,
        type: this.type
      };
      this.transactionService.editTransaction(updatedTransaction);
    }

    // Reset form fields
    this.resetForm();

    // Emit event to notify parent component
    this.formSubmitted.emit();
  }

  private resetForm() {
    this.description = '';
    this.amount = null;
    this.date = '';
    this.type = 'expense';
    this.id = null;
  }
}
