import {Component, Input} from '@angular/core';
import {FormGroup, NgForm} from "@angular/forms";
import { NgIf, JsonPipe } from '@angular/common';

@Component({
    selector: 'app-formulario-debug',
    templateUrl: './formulario-debug.component.html',
    styleUrls: ['./formulario-debug.scss'],
    standalone: true,
    imports: [NgIf, JsonPipe]
})
export class FormularioDebugComponent {

  @Input() formularioForDebug?: NgForm;
  @Input() formularioReativoDebug?: FormGroup

}
