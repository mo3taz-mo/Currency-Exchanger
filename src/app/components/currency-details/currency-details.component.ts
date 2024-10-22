import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CurrencyService } from '../../services/currency.service';
import { ConverterComponent } from '../converter/converter.component';

@Component({
  selector: 'app-currency-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ConverterComponent],
  templateUrl: './currency-details.component.html'
})
export class CurrencyDetailsComponent implements OnInit {
  fromCurrency: string = '';
  toCurrency: string = '';
  fromCurrencyFullName: string = '';
  toCurrencyFullName: string = '';

  constructor(
    private route: ActivatedRoute,
    private currencyService: CurrencyService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.fromCurrency = params['from'];
      this.toCurrency = params['to'];
      this.loadCurrencyDetails();
    });
  }

  loadCurrencyDetails() {
    this.currencyService.getCurrencyFullName(this.fromCurrency).subscribe(
      name => this.fromCurrencyFullName = name
    );
    this.currencyService.getCurrencyFullName(this.toCurrency).subscribe(
      name => this.toCurrencyFullName = name
    );
  }
}
