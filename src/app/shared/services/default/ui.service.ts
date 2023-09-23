import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  private isShowFooter: EventEmitter<boolean> = new EventEmitter<boolean>();
  private isShowNavBar: EventEmitter<boolean> = new EventEmitter<boolean>();
  private isShowRegisterLink: EventEmitter<boolean> = new EventEmitter<boolean>();
  private isShowLoginLink: EventEmitter<boolean> = new EventEmitter<boolean>();
  private isShowBackToTopPageLink: EventEmitter<boolean> = new EventEmitter<boolean>();
  private isProfilePictureUpdated: EventEmitter<boolean> = new EventEmitter<boolean>();
  private isCartUpdated: EventEmitter<boolean> = new EventEmitter<boolean>();

  //Update Carrinho
  public cartUpdatedEventEmitter(bool: boolean) {
    return this.isCartUpdated.emit(bool);
  }

  get isCartUpdatedEventEmitter() {
    return this.isCartUpdated;
  }

  //Update Foto Perfil navbar
  public profilePictureUpdatedEventEmitter(bool: boolean) {
    return this.isProfilePictureUpdated.emit(bool);
  }

  get isProfilePictureUpdatedEventEmitter() {
    return this.isProfilePictureUpdated;
  }

  //Show inicio link
  public showBackToTopPageLink(bool: boolean) {
    return this.isShowBackToTopPageLinkEventEmitter.emit(bool);
  }

  get isShowBackToTopPageLinkEventEmitter() {
    return this.isShowBackToTopPageLink;
  }

  //Show login link
  public showLoginLink(bool: boolean) {
    return  this.isShowLoginLink.emit(bool);
  }

  get isShowLoginLinkEventEmitter() {
    return this.isShowLoginLink;
  }

  //Show register link
  public showRegisterLink(bool: boolean) {
    return  this.isShowRegisterLink.emit(bool);
  }

  get isShowRegisterLinkEventEmitter() {
    return this.isShowRegisterLink;
}

  //Show footer
  public showFooter(bool: boolean) {
    return  this.isShowFooter.emit(bool);
  }

  get isShowFooterEventEmitter() {
    return this.isShowFooter;
  }

  // Show Navbar
  public showNavBar(bool: boolean) {
    return  this.isShowNavBar.emit(bool);
  }

  get isShowNavBarEventEmitter() {
    return this.isShowNavBar;
  }

  public scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    }
  }

  //Animate scrollTop
  scrollTop(to: number, duration: number, element = document.scrollingElement ?? document.documentElement): void {
    if (element.scrollTop === to) {
      return;
    }
    const start = element.scrollTop;
    const change = to - start;
    const startDate = +new Date();

    // t = current time; b = start value; c = change in value; d = duration
    const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
      t /= d / 2;
      if (t < 1) {
        return c / 2 * t * t + b;
      }
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    };

    const animateScroll = () => {
      const currentDate = +new Date();
      const currentTime = currentDate - startDate;
      element.scrollTop = easeInOutQuad(currentTime, start, change, duration);
      if (currentTime < duration) {
        requestAnimationFrame(animateScroll);
      } else {
        element.scrollTop = to;
      }
    };

    animateScroll();
  }
}
