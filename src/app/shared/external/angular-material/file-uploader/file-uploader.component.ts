import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DragAndDropDirective} from "../../../diretivas/drag-and-drop.directive";

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [CommonModule, DragAndDropDirective],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss'
})
export class FileUploaderComponent {

  onFileDrop($event: any) {
    console.log($event)
  }
}
