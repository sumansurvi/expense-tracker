import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Define a type for the transaction
export interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactions: Transaction[] = [];
  private localStorageKey = 'transactions';

  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  transactions$ = this.transactionsSubject.asObservable();

  private totalIncomeSubject = new BehaviorSubject<number>(0);
  totalIncome$ = this.totalIncomeSubject.asObservable();

  private totalExpensesSubject = new BehaviorSubject<number>(0);
  totalExpenses$ = this.totalExpensesSubject.asObservable();

  constructor() {
    this.loadTransactions();
    this.updateSummary();
  }

  private isLocalStorageAvailable(): boolean {
    try {
      // Inside a try block, we attempt to execute the following code.
      // If an error occurs during execution, it will be caught by the catch block.

      // Create a test key for localStorage
      const testKey = '__test__';

      // Attempt to set an item in localStorage with the testKey as both the key and value
      localStorage.setItem(testKey, testKey);

      // Attempt to remove the item from localStorage using the testKey
      localStorage.removeItem(testKey);

      // If all operations were successful without throwing an error, return true
      return true;
    } catch (e) {
      // If an error occurs during execution of the try block, it will be caught here.
      // This typically means that the browser does not support localStorage or that
      // localStorage is disabled (e.g., due to browser settings).

      // In such cases, return false to indicate that localStorage is not available.
      return false;
    }
  }

  private loadTransactions() {
    // Check if localStorage is available by calling the isLocalStorageAvailable method
    if (this.isLocalStorageAvailable()) {
      // If localStorage is available, attempt to retrieve data stored under the specified key
      const data = localStorage.getItem(this.localStorageKey);
      // Check if any data is retrieved
      if (data) {
        // If data exists, parse it from JSON format into a JavaScript object and assign it to the transactions array
        this.transactions = JSON.parse(data);
        // Update the BehaviorSubject with the new transactions array
        this.transactionsSubject.next(this.transactions);
        // Update the summary based on the new transactions
        this.updateSummary();
      }
    }
  }

  private saveTransactions() {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.transactions));
    }
  }

  getTransactions(): Transaction[] {
    return this.transactions;
  }

  addTransaction(transaction: Transaction) {
    this.transactions.push(transaction);
    this.transactionsSubject.next(this.transactions);
    this.saveTransactions();
    this.updateSummary();
  }

  editTransaction(updatedTransaction: Transaction) {
    // Find the index of the transaction to be edited based on its ID
    const index = this.transactions.findIndex(t => t.id === updatedTransaction.id);
    // Check if the transaction to be edited exists in the transactions array
    if (index > -1) {
      // If the transaction exists, replace it with the updated transaction
      this.transactions[index] = updatedTransaction;
      // Notify subscribers (like components) about the updated transactions array
      this.transactionsSubject.next(this.transactions);
      // Save the updated transactions to localStorage
      this.saveTransactions();
      // Update the summary data based on the updated transactions
      this.updateSummary();
    }
  }

  deleteTransaction(id: number) {
    // Remove the transaction with the specified ID from the transactions array
    this.transactions = this.transactions.filter(t => t.id !== id);
    // Notify subscribers (like components) about the updated transactions array
    this.transactionsSubject.next(this.transactions);
    // Save the updated transactions to localStorage
    this.saveTransactions();
    // Update the summary data based on the updated transactions
    this.updateSummary();
  }

  private updateSummary() {
    // Calculate total income by summing up the amounts of transactions with type 'income'
    const totalIncome = this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate total expenses by summing up the amounts of transactions with type 'expense'
    const totalExpenses = this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Update BehaviorSubjects with the calculated values
    this.totalIncomeSubject.next(totalIncome);
    this.totalExpensesSubject.next(totalExpenses);
  }

  /* will not allow all special characters except numbers and alphabets*/
  validateText(value: any) {
    // Remove any non-alphanumeric characters
    value = value.replace(/[^a-zA-Z0-9 ]/g, '');

    // Replace multiple spaces with a single space
    value = value.replace(/ +/g, ' ');

    // Trim leading and trailing spaces
    value = value.trim();

    // Return the cleaned value
    return value;
  }

  /* will not allow all special characters and alphabets except numbers*/
  validateNumber(value: any) {
    // Ensure value is converted to string and cleaned up
    let cleanedValue = String(value).replace(/[^\d.]/g, ''); // Remove non-numeric characters (allowing decimals)
    cleanedValue = cleanedValue.replace(/\.+/g, '.'); // Remove extra dots if present (allow only one dot)

    // Parse the cleaned numeric string to a number
    const parsedValue = parseFloat(cleanedValue);

    // Return the parsed number (or handle NaN case appropriately)
    return isNaN(parsedValue) ? 0 : parsedValue; // Default to 0 if NaN
  }

}
