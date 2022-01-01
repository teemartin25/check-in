import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keyUpdatedPipe',
})
export class Table2Pipe implements PipeTransform {
  transform(value: any) {
    let newString: string;

    if (value === 'name') newString = 'Name';
    if (value === 'hobbies') newString = 'Hobbies';
    if (value === 'phoneNumber') newString = 'Phone number';
    if (value === 'imagePath') newString = 'Profile image';
    if (value === 'gender') newString = 'Gender';
    if (value === 'statuses') newString = 'Status';

    return newString;
  }
}
