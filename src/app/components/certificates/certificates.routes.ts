import {Routes} from "@angular/router";
import {CertificatesComponent} from "./containers/certification/certificates.component";

export const CERTIFICATES_ROUTES: Routes = [
  {path: '', pathMatch: 'full', component: CertificatesComponent}
]
