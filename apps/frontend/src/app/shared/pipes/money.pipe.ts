import { formatCurrency } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'money',
})
export class MoneyPipe implements PipeTransform {
  transform(cents: number): unknown {
    return formatCurrency(cents / 100, 'en-US', '');
  }
}
