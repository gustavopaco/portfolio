import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogModule} from "@angular/material/dialog";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {ImageCropperModule} from "ngx-image-cropper";

@Component({
  selector: 'app-skills-form',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, ImageCropperModule],
  templateUrl: './skills-form.component.html',
  styleUrls: ['./skills-form.component.scss']
})
export class SkillsFormComponent {
  form = this.fb.group({
    id: [null],
    name: [''],
    description: [''],
    rating: [null],
    url: ['']
  });

  @Input() newSkill = false;

  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(private fb: FormBuilder) {
  }

  onSubmit() {

  }

  onFileInputChange($event: Event) {
    this.imageChangedEvent = $event;
  }
}
