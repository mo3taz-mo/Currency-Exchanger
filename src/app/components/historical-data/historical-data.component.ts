import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-historical-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historical-data.component.html'
})
export class HistoricalDataComponent implements OnChanges {
  @Input() fromCurrency: string = '';
  @Input() toCurrency: string = '';

  historicalRates: { period: string; rate: number }[] = [];
  isLoading: boolean = true;

  constructor(private currencyService: CurrencyService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['fromCurrency'] || changes['toCurrency']) && this.fromCurrency && this.toCurrency) {
      this.loadHistoricalRates();
    }
  }

  private loadHistoricalRates(): void {
    this.isLoading = true;
    this.historicalRates = [];

    const today = new Date();
    const periods = [
      { name: 'Today', date: today },
      { name: 'Yesterday', date: new Date(today.getTime() - 24 * 60 * 60 * 1000) },
      { name: 'Last Week', date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000) },
      { name: 'Last Month', date: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()) },
      { name: 'Last Year', date: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()) },
    ];

    let completedRequests = 0;
    periods.forEach(period => {
      this.currencyService.getHistoricalRate(this.fromCurrency, this.toCurrency, this.formatDate(period.date)).subscribe(
        rate => {
          this.historicalRates.push({ period: period.name, rate });
          completedRequests++;
          if (completedRequests === periods.length) {
            this.historicalRates.sort((a, b) => periods.findIndex(p => p.name === a.period) - periods.findIndex(p => p.name === b.period));
            this.isLoading = false;
          }
        },
        error => {
          console.error(`Error fetching historical rate for ${period.name}`, error);
          completedRequests++;
          if (completedRequests === periods.length) {
            this.isLoading = false;
          }
        }
      );
    });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
