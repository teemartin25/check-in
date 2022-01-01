import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timelineDate',
})
export class DatePipe implements PipeTransform {
  transform(value: any) {
    const date1 = new Date(value);
    const date2 = new Date();

    // Calculating the time difference betweeen two dates
    const diffInTime = date2.getTime() - date1.getTime();

    let newDate;

    //One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;
    const oneHour = 1000 * 60 * 60;
    const oneMinute = 1000 * 60;
    const oneSecond = 1000;

    const diffInDays = Math.round(diffInTime / oneDay);
    const diffInHours = Math.round(diffInTime / oneHour);
    const diffInMinutes = Math.round(diffInTime / oneMinute);
    const diffInSeconds = Math.round(diffInTime / oneSecond);

    if (diffInSeconds < 60) {
      newDate = `a few seconds ago`;
      return newDate;
    }
    if (diffInMinutes < 60) {
      newDate =
        diffInMinutes === 1
          ? `${diffInMinutes} minute ago`
          : `${diffInMinutes} minutes ago`;
      return newDate;
    }
    if (diffInHours < 24) {
      newDate =
        diffInHours === 1
          ? `${diffInHours} hour ago`
          : `${diffInHours} hours ago`;
      return newDate;
    }

    if (diffInDays < 7) {
      newDate =
        diffInDays === 1 ? `${diffInDays} day ago` : `${diffInDays} days ago`;
      return newDate;
    }
    if (diffInDays > 7) {
      newDate = `${date2} `;
      return newDate;
    }
  }
}
