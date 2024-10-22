import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-quick-conversions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quick-conversions.component.html'
})
export class QuickConversionsComponent implements OnChanges {
  @Input() fromCurrency: string = '';
  @Input() toCurrency: string = '';

  amounts: number[] = [1, 10, 100, 1000];
  fromToConversions: { amount: number; converted: number }[] = [];
  toFromConversions: { amount: number; converted: number }[] = [];

  constructor(private currencyService: CurrencyService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['fromCurrency'] || changes['toCurrency']) && this.fromCurrency && this.toCurrency) {
      this.updateConversions();
    }
  }

  private updateConversions(): void {
    this.fromToConversions = [];
    this.toFromConversions = [];

    this.amounts.forEach(amount => {
      this.currencyService.convertCurrency(this.fromCurrency, this.toCurrency, amount).subscribe(
        result => this.fromToConversions.push({ amount, converted: result })
      );
      this.currencyService.convertCurrency(this.toCurrency, this.fromCurrency, amount).subscribe(
        result => this.toFromConversions.push({ amount, converted: result })
      );
    });
  }
}
