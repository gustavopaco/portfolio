import {AfterViewInit, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Social} from "../../shared/interface/social";
import {SocialService} from "../../shared/services/social.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatTooltipModule, TooltipPosition} from "@angular/material/tooltip";

@Component({
  selector: 'app-social',
  standalone: true,
  imports: [CommonModule, MatTooltipModule],
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss']
})
export class SocialComponent implements AfterViewInit {

  brands = [
    ' fa-github ', ' fa-linkedin ', ' fa-facebook ', ' fa-instagram ', ' fa-x-twitter ', ' fa-youtube '
  ]

  @Input() size: number | string = 20;
  @Input() toolTipPosition: TooltipPosition = 'below';
  @Input() social?: Social;

  indexHovered: number = -1;
  countSocials = 0;

  constructor(private socialService: SocialService) {
    this.socialService.socialEventEmitter$.pipe(takeUntilDestroyed()).subscribe((social) => {
      this.social = social;
      this.getSocialsCount();
    });
  }

  ngAfterViewInit(): void {
    if (this.social) {
      this.getSocialsCount();
    }
  }

  setSocialClass(index: number) {
    if (this.countSocials > 1) {
      if (this.indexHovered == index) return ' me-2 fa-beat ';
      return ' me-2 ';
    }
    return ' ';
  }

  getSocialsCount() {
    this.countSocials = 0;
    if (this.social?.facebook) this.countSocials++;
    if (this.social?.github) this.countSocials++;
    if (this.social?.instagram) this.countSocials++;
    if (this.social?.linkedin) this.countSocials++;
    if (this.social?.twitter) this.countSocials++;
    if (this.social?.youtube) this.countSocials++;
  }

  showHideBrand(brand: string) {
    return this.social
      && ((this.social?.github && brand.includes('github'))
        || (this.social?.linkedin && brand.includes('linkedin'))
        || (this.social?.facebook && brand.includes('facebook'))
        || (this.social?.instagram && brand.includes('instagram'))
        || (this.social?.twitter && brand.includes('twitter'))
        || (this.social?.youtube && brand.includes('youtube'))
      );

  }

  setTooltip(brand: string) {
    if (brand.includes('github')) return 'Github';
    if (brand.includes('linkedin')) return 'LinkedIn';
    if (brand.includes('facebook')) return 'Facebook';
    if (brand.includes('instagram')) return 'Instagram';
    if (brand.includes('twitter')) return 'Twitter';
    if (brand.includes('youtube')) return 'YouTube';
    return '';
  }

  setHrefSocial(brand: string) {
    if (brand.includes('github')) return this.social?.github;
    if (brand.includes('linkedin')) return this.social?.linkedin;
    if (brand.includes('facebook')) return this.social?.facebook;
    if (brand.includes('instagram')) return this.social?.instagram;
    if (brand.includes('twitter')) return this.social?.twitter;
    if (brand.includes('youtube')) return this.social?.youtube;
    return '';
  }
}
