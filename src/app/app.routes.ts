import { Routes } from '@angular/router';
import { ConverterComponent } from './components/converter/converter.component';
import { CurrencyDetailsComponent } from './components/currency-details/currency-details.component';

export const routes: Routes = [
  { path: '', component: ConverterComponent },
  { path: 'details/:from/:to', component: CurrencyDetailsComponent },
  { path: '**', redirectTo: '' }
];
