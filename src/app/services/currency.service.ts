import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private apiKey = '8945758cfe30fd831cee8afd4b0a5f8e'
  private baseUrl = 'http://data.fixer.io/api';

  constructor(private http: HttpClient) { }

  getCurrencies(): Observable<string[]> {
    return this.http.get<any>(`${this.baseUrl}/symbols?access_key=${this.apiKey}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.error.type);
        }
        return Object.keys(response.symbols);
      }),
      catchError(this.handleError)
    );
  }

  convertCurrency(from: string, to: string, amount: number): Observable<number> {
    // We need to convert through EUR as base currency
    return this.getLatestRates().pipe(
      map(rates => {
        if (from === 'EUR') {
          return amount * rates[to];
        } else if (to === 'EUR') {
          return amount / rates[from];
        } else {
          // Convert through EUR
          const amountInEUR = amount / rates[from];
          return amountInEUR * rates[to];
        }
      }),
      catchError(this.handleError)
    );
  }

  getHistoricalRate(from: string, to: string, date: string): Observable<number> {
    return this.http.get<any>(`${this.baseUrl}/${date}?access_key=${this.apiKey}&base=EUR&symbols=${from},${to}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.error.type);
        }
        // Convert through EUR since it's the base currency
        if (from === 'EUR') {
          return response.rates[to];
        } else if (to === 'EUR') {
          return 1 / response.rates[from];
        } else {
          return response.rates[to] / response.rates[from];
        }
      }),
      catchError(this.handleError)
    );
  }

  getCurrencyFullName(currency: string): Observable<string> {
    return this.http.get<any>(`${this.baseUrl}/symbols?access_key=${this.apiKey}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.error.type);
        }
        return response.symbols[currency];
      }),
      catchError(this.handleError)
    );
  }

  private getLatestRates(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/latest?access_key=${this.apiKey}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.error.type);
        }
        return response.rates;
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.error?.error?.type) {
        switch (error.error.error.type) {
          case 'invalid_access_key':
            errorMessage = 'Invalid API access key';
            break;
          case 'invalid_base_currency':
            errorMessage = 'Invalid base currency';
            break;
          case 'base_currency_access_restricted':
            errorMessage = 'Base currency access restricted (Please upgrade your API plan)';
            break;
          default:
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
