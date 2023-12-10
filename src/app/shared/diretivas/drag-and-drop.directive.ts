import {Directive, EventEmitter, HostBinding, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[dragAndDrop]',
  standalone: true
})
export class DragAndDropDirective {

  @HostBinding('style.opacity') private componentOpacity = '1';
  @Output() onFileDropped = new EventEmitter<any>();

  //DragOverListener
  @HostListener('dragover', ['$event']) onDragOver(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.componentOpacity = '0.5';
  }

  //DragLeaveListener
  @HostListener('dragleave', ['$event']) onDragLeave(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.componentOpacity = '1';
  }

  //DropListener
  @HostListener('drop',['$event']) onDrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.componentOpacity = '1';
    let files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.onFileDropped.emit(files);
    }
  }

}
