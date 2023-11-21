import {MomentDateAdapter} from "@angular/material-moment-adapter";
import * as moment from 'moment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export class CustomDateAdapter extends MomentDateAdapter {
  override format(date: moment.Moment, displayFormat: string): string {
    return date.format('L');
  }
}
