import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CurrencyService } from '../../services/currency.service';
import { QuickConversionsComponent } from '../quick-conversions/quick-conversions.component';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, QuickConversionsComponent],
  templateUrl: './converter.component.html'
})
export class ConverterComponent implements OnInit {
  @Input() initialFromCurrency: string = '';
  @Input() initialToCurrency: string = '';
  @Input() disableFrom: boolean = false;

  amount: string = '';
  isValidInput: boolean = true;
  isAmountValid: boolean = false;
  fromCurrency: string = '';
  toCurrency: string = '';
  currencies: string[] = [];
  convertedAmount: number | null = null;
  errorMessage: string | null = null;

  constructor(private currencyService: CurrencyService, private router: Router) {}

  ngOnInit() {
    this.currencyService.getCurrencies().subscribe(
      currencies => {
        this.currencies = currencies;
        this.fromCurrency = this.initialFromCurrency || currencies[0];
        this.toCurrency = this.initialToCurrency || (currencies[1] || currencies[0]);
      }
    );
  }

onAmountInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  let value = input.value;

  // Remove any non-numeric characters except decimal point
  value = value.replace(/[^\d.]/g, '');

  // Ensure only one decimal point
  const parts = value.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('');
  }

  // Update the input value
  this.amount = value;

  // Validate the input
  this.isValidInput = this.validateAmount(value);
  this.isAmountValid = this.isValidInput && parseFloat(value) > 0;
}

onKeyPress(event: KeyboardEvent): boolean {
  // Allow only numbers, decimal point, and control keys
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode === 46) { // decimal point
    // Allow only one decimal point
    if ((event.target as HTMLInputElement).value.indexOf('.') > -1) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    event.preventDefault();
    return false;
  }
  return true;
}

private validateAmount(value: string): boolean {
  // Check if the value is a valid number
  if (value === '' || value === '.') return true;
  const num = parseFloat(value);
  return !isNaN(num) && isFinite(num);
}

convertCurrency() {
  if (this.isAmountValid && this.fromCurrency && this.toCurrency) {
    this.errorMessage = null;
    const numericAmount = parseFloat(this.amount);

    this.currencyService.convertCurrency(this.fromCurrency, this.toCurrency, numericAmount).subscribe({
      next: (result) => {
        this.convertedAmount = result;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.convertedAmount = null;
      }
    });
  }
}

  swapCurrencies() {
    if (!this.disableFrom) {
      [this.fromCurrency, this.toCurrency] = [this.toCurrency, this.fromCurrency];
      this.onCurrencyChange();
    }
  }

  goToDetails() {
    if (this.fromCurrency && this.toCurrency) {
      this.router.navigate(['/details', this.fromCurrency, this.toCurrency]);
    }
  }

  onCurrencyChange() {

  }

}
