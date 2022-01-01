import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'whatWasChangedPipe',
})
export class Table1Pipe implements PipeTransform {
  transform(value: any) {
    let newString: string;

    if (value === 'newStatus') newString = 'New Status';
    if (value === 'updatedAccount') newString = 'Updated Account';
    if (value === 'deletedAccount') newString = 'Deleted Account';
    if (value === 'newAccount') newString = 'New Account';

    return newString;
  }
}
