import { Pipe, PipeTransform } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Pipe({
  name: 'statusProject',
  standalone: true
})
export class StatusProjectPipe implements PipeTransform {

  constructor(private translateService: TranslateService) {
  }

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
    let ribbonStatus = '';
    if (value.includes('_')) {
      const status = value.split('_').join(' ');
      ribbonStatus =  this.generateCamelCase(status);
      return this.translateStatus(ribbonStatus);
    }
    ribbonStatus = this.generateCamelCase(value);
    return this.translateStatus(ribbonStatus);
  }

  private generateCamelCase(text: string): string {
    const tempArray = text.split(' ');
    let result = '';
    for (let value of tempArray) {
      result += value.charAt(0).toUpperCase() + value.substring(1).toLowerCase() + ' ';
    }
    return result.substring(0, result.length - 1);
  }

  private translateStatus(status: string): string {
    if (this.translateService.currentLang === 'pt') {
      switch (status) {
        case 'In Progress': {
          return this.translateService.instant('projects_list.ribbon.inProgress');
        }
        case 'Completed': {
          return this.translateService.instant('projects_list.ribbon.completed');
        }
        case 'Delayed': {
          return this.translateService.instant('projects_list.ribbon.delayed');
        }
        case 'Cancelled': {
          return this.translateService.instant('projects_list.ribbon.cancelled');
        }
        case 'Testing': {
          return this.translateService.instant('projects_list.ribbon.testing');
        }
        case 'Under Review': {
          return this.translateService.instant('projects_list.ribbon.underReview');
        }
        case 'Launched': {
          return this.translateService.instant('projects_list.ribbon.launched');
        }
        case 'Emergency': {
          return this.translateService.instant('projects_list.ribbon.emergency');
        }
        case 'Maintenance': {
          return this.translateService.instant('projects_list.ribbon.maintenance');
        }
        case 'Future': {
          return this.translateService.instant('projects_list.ribbon.future');
        }
        case 'Paused': {
          return this.translateService.instant('projects_list.ribbon.paused');
        }
        case 'Highlight': {
          return this.translateService.instant('projects_list.ribbon.highlight');
        }
        case 'Old': {
          return this.translateService.instant('projects_list.ribbon.old');
        }
        default: {
          return '';
        }
      }
    }
    return status;
  }
}
