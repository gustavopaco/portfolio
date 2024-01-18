import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Resume} from "../../../../shared/interface/resume";

@Component({
  selector: 'app-resume-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resume-item.component.html',
  styleUrl: './resume-item.component.scss'
})
export class ResumeItemComponent {

  @Input() resume?: Resume;
}
