import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'language',
  standalone: true
})
export class LanguagePipe implements PipeTransform {

  transform(value: string, ...args: string[]): unknown {
    if (value.includes('pt')) {
      return 'Português';
    }
    return 'English';
  }

}
