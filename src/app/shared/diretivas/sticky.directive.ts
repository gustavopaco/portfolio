import {AfterViewInit, Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';
import {ViewportScroller} from "@angular/common";

@Directive({
  selector: '[appSticky]',
  standalone: true
})
export class StickyDirective implements AfterViewInit {

  private originalPosition = '';
  private originalTop = '';
  @Input() offsetMode: 'top' | 'bottom' = 'top';
  @Input() stickyClasses: string[] = [];

  constructor(private elementRef: ElementRef,
              private render: Renderer2,
              private viewportScroller: ViewportScroller) {
  }

  ngAfterViewInit(): void {
    this.originalPosition = this.elementRef.nativeElement.style.position;
    this.originalTop = this.elementRef.nativeElement.style.top;
  }

  // clientHeight e offsetHeight retornam a altura do elemento atual, mas o offsetHeight retorna a altura com padding e borda
  // clientWidth e offsetWidth retornam a largura do elemento atual, mas o offsetWidth retorna a largura com padding e borda
  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    // O método getScrollPosition() retorna um array com 2 posições atuais do scroll onde a primeira é o eixo horizontal e a segunda o eixo vertical
    const windowScroll = this.viewportScroller.getScrollPosition()[1];
    // O método offsetTop retorna a distancia do elemento em relação ao topo da pagina
    let elementOffset = this.elementRef.nativeElement.offsetTop;
    if (this.offsetMode === 'bottom') {
      // Esse método retorna a posição do elemento em relação ao topo da pagina + a altura do elemento para que possamos saber quando o scroll passou do elemento
      elementOffset = this.elementRef.nativeElement.offsetHeight + elementOffset;
    }
    if (windowScroll >= elementOffset) {
      this.stickyElement();
    } else {
      this.unstickElement();
    }
  }

  stickyElement() {
    this.render.setStyle(this.elementRef.nativeElement, 'position', 'fixed');
    this.render.setStyle(this.elementRef.nativeElement, 'top', '0');
    this.render.setStyle(this.elementRef.nativeElement, 'z-index', '1000');
    this.stickyClasses.forEach(className => this.render.addClass(this.elementRef.nativeElement, className));
  }

  unstickElement() {
    this.render.setStyle(this.elementRef.nativeElement, 'position', this.originalPosition);
    this.render.setStyle(this.elementRef.nativeElement, 'top', this.originalTop);
    this.render.setStyle(this.elementRef.nativeElement, 'z-index', 'auto');
    this.stickyClasses.forEach(className => this.render.removeClass(this.elementRef.nativeElement, className));
  }
}
