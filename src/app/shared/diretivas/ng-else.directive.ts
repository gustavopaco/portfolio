import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
    selector: '[ngElse]',
    standalone: true
})
export class NgElseDirective {

  private hasView: boolean = false;

  @Input() set ngElse(condition:boolean) {
    if (!condition && !this.hasView) {
      this.hasView = true;
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else if(condition && this.hasView) {
      this.hasView = false;
      this.viewContainerRef.clear();
    }
  }

  constructor(private templateRef: TemplateRef<any>, private viewContainerRef: ViewContainerRef) { }

}
