import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusProject',
  standalone: true
})
export class StatusProjectPipe implements PipeTransform {

  /** @description This function transform Project status from Backend Values to Frontend Values.
  *
  * IN_PROGRESS: in-progress,
  * UNDER_REVIEW: under-review,
  * LAUNCHED: launched,
  * EMERGENCY: emergency,
  * MAINTENANCE: maintenance,
  * FUTURE: future,
  * PAUSED: paused,
  * HIGHLIGHT: highlight,
  * OLD: old
* */
  transform(value: string, ...args: string[]): string {
    if (value.includes('_')) {
      const status = value.split('_').join(' ');
      return this.generateCamelCase(status);
    }
      return this.generateCamelCase(value);
  }

  private generateCamelCase(text: string): string {
    const tempArray = text.split(' ');
    let result = '';
    for (let value of tempArray) {
      result += value.charAt(0).toUpperCase() + value.substring(1).toLowerCase() + ' ';
    }
    return result.substring(0, result.length - 1);
  }
}
