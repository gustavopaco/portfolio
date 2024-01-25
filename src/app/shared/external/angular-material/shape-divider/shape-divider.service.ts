import { Injectable } from '@angular/core';
import {ShapeDividerPath} from "./shape-divider.component";

@Injectable({
  providedIn: 'root'
})
export class ShapeDividerService {

  getShapeDividerPath(shape: string, inverted: boolean): ShapeDividerPath[] {
    switch (shape) {
      case 'waves':
        return this.getPathWaves(inverted);
      case 'waves-opacity':
        return this.getPathWavesOpacity();
      case 'curve':
        return this.getPathCurve(inverted);
      case 'curve-asymmetrical':
        return this.getPathCurveAsymmetrical(inverted);
      case 'triangule':
        return this.getPathTriangule(inverted);
      case 'triangule-asymmetrical':
        return this.getPathTrianguleAsymmetrical(inverted);
      case 'tilt':
        return this.getPathTilt();
      case 'arrow':
        return this.getPathArrow(inverted);
      case 'split':
        return this.getPathSplit(inverted);
      case 'book':
        return this.getPathBook(inverted);
      default:
        return this.getPathWaves(inverted);
    }
  }

  private getPathWaves(inverted: boolean): ShapeDividerPath[] {
    if (inverted) {
      return [
        {
          d: `M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z`,
          opacity: 1
        }
      ];
    }
    return [
      {
        d: `M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z`,
        opacity: 1
      }
    ];
  }

  private getPathWavesOpacity(): ShapeDividerPath[] {
    return [
      {
        d: 'M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z',
        opacity: 0.25,
      },
      {
        d: 'M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z',
        opacity: 0.5,
      },
      {
        d: 'M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z',
        opacity: 1,
      }
    ];
  }

  private getPathCurve(inverted: boolean): ShapeDividerPath[] {
    if (inverted) {
      return [
        {
          d: 'M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z',
          opacity: 1
        }
      ]
    }
    return [
      {
        d: 'M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z',
        opacity: 1
      }
    ];
  }

  private getPathCurveAsymmetrical(inverted: boolean): ShapeDividerPath[] {
    if (inverted) {
      return [
        {
          d: 'M741,116.23C291,117.43,0,27.57,0,6V120H1200V6C1200,27.93,1186.4,119.83,741,116.23Z',
          opacity: 1
        }
      ]
    }
    return [
      {
        d: 'M0,0V6c0,21.6,291,111.46,741,110.26,445.39,3.6,459-88.3,459-110.26V0Z',
        opacity: 1
      }
    ];
  }

  private getPathTriangule(inverted: boolean): ShapeDividerPath[] {
    if (inverted) {
      return [
        {
          d: 'M598.97 114.72L0 0 0 120 1200 120 1200 0 598.97 114.72z',
          opacity: 1
        }
      ]
    }
    return [
      {
        d: 'M1200 0L0 0 598.97 114.72 1200 0z',
        opacity: 1
      }
    ];
  }

  private getPathTrianguleAsymmetrical(inverted: boolean): ShapeDividerPath[] {
    if (inverted) {
      return [
        {
          d: 'M892.25 114.72L0 0 0 120 1200 120 1200 0 892.25 114.72z',
          opacity: 1
        }
      ]
    }
    return [
      {
        d: 'M1200 0L0 0 892.25 114.72 1200 0z',
        opacity: 1
      }
    ];
  }

  private getPathTilt(): ShapeDividerPath[] {
    return [
      {
        d: 'M1200 120L0 16.48 0 0 1200 0 1200 120z',
        opacity: 1
      }
    ];
  }

  private getPathArrow(inverted: boolean): ShapeDividerPath[] {
    if (inverted) {
      return [
        {
          d: 'M649.97 0L599.91 54.12 550.03 0 0 0 0 120 1200 120 1200 0 649.97 0z',
          opacity: 1
        }
      ]
    }
    return [
      {
        d: 'M649.97 0L550.03 0 599.91 54.12 649.97 0z',
        opacity: 1
      }
    ];
  }

  private getPathSplit(inverted: boolean): ShapeDividerPath[] {
    if (inverted) {
      return [
        {
          d: 'M600,16.8c0-8.11-8.88-13.2-19.92-13.2H0V120H1200V3.6H619.92C608.88,3.6,600,8.66,600,16.8Z',
          opacity: 1
        }
      ]
    }
    return [
      {
        d: 'M0,0V3.6H580.08c11,0,19.92,5.09,19.92,13.2,0-8.14,8.88-13.2,19.92-13.2H1200V0Z',
        opacity: 1
      }
    ];
  }

  private getPathBook(inverted: boolean): ShapeDividerPath[] {
    if (inverted) {
      return [
        {
          d: 'M602.45,3.86h0S572.9,116.24,281.94,120H923C632,116.24,602.45,3.86,602.45,3.86Z',
          opacity: 1
        }
      ]
    }
    return [
      {
        d: 'M1200,0H0V120H281.94C572.9,116.24,602.45,3.86,602.45,3.86h0S632,116.24,923,120h277Z',
        opacity: 1
      }
    ];
  }
}
