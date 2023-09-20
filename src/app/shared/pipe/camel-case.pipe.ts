import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'camelCase',
    standalone: true
})
export class CamelCasePipe implements PipeTransform {

  transform(texto: any, ...args: unknown[]): any {

    let textoArray = texto.split(' ');
    let resultado = '';

    for (let palavra of textoArray) {
      resultado += this.transformarMaiusculo(palavra) + " ";

    }

    resultado = resultado.substring(0, resultado.length -1);

    return resultado;
  }

  transformarMaiusculo(palavra : string): string {
    return palavra.substring(0,1).toUpperCase() + palavra.substring(1).toLowerCase();
  }

}
