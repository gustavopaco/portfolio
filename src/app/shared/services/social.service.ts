import {EventEmitter, Injectable} from '@angular/core';
import {Social} from "../interface/social";

@Injectable({
  providedIn: 'root'
})
export class SocialService {

  private socialEventEmitter = new EventEmitter<Social>();

  get socialEventEmitter$() {
    return this.socialEventEmitter;
  }

  emitSocialEvent(social: Social) {
    this.socialEventEmitter.emit(social);
  }
}
