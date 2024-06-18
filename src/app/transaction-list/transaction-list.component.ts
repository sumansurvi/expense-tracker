import { Component, OnInit } from '@angular/core';
import { TransactionService, Transaction } from '../transaction.service';
import { TransactionFormComponent } from "../transaction-form/transaction-form.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss',
  imports: [CommonModule, TransactionFormComponent]
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = []; // Explicitly type the transactions array
  editTransaction: Transaction | null = null; // Explicitly type the editTransaction variable

  constructor(private transactionService: TransactionService) { }

  ngOnInit() {
    // Load transactions from the service when the component initializes
    this.transactions = this.transactionService.getTransactions();
  }

  // Function to set the transaction to be edited
  setEditTransaction(transaction: Transaction) {
    // Create a copy of the transaction object using the spread operator
    this.editTransaction = { ...transaction };
  }

  // Function to handle form submission and refresh the transaction list
  handleFormSubmit() {
    // Reload transactions from the service
    this.transactions = this.transactionService.getTransactions();
    // Reset the editTransaction variable
    this.editTransaction = null;
  }

  // Function to delete a transaction by its ID
  deleteTransaction(id: number) {
    // Call the deleteTransaction method from the service
    this.transactionService.deleteTransaction(id);
    // Reload transactions from the service
    this.transactions = this.transactionService.getTransactions();
  }

}
