import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-alert',
  standalone: true,
    imports: [CommonModule, TranslateModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {

  @Input() type: 'success' | 'info' | 'danger' = 'success';
  @Input() message: string = '';
  @Input() i18nMessage?: string;
}
