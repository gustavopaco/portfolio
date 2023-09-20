import {filter, map, pipe, tap} from "rxjs";
import {HttpEvent, HttpEventType, HttpResponse} from "@angular/common/http";

export const fileUploadFiltrarUploadCompleto = <T>() => {
  return pipe(
    filter((event: any) => event.type === HttpEventType.Response),
    map((response: HttpResponse<T>) => response.body)
  )
}

export const fileUploadProgressoAtual = <T>(callback: (porcentagemAtual: number) => void) => {
  return tap((event: HttpEvent<T>) => {
    if (event.type === HttpEventType.UploadProgress && event.total) {
      callback(Math.round((event.loaded * 100) / event.total));
    }
  })
}

export const fileUploadProgressoConcluido = <T>(callback: (porcentagemAtual: number) => void) => {
  return tap((event: HttpEvent<T>) => {
    if (event.type === HttpEventType.Response) {
      callback(100);
    }
  })
}

export const fileUploadValidarArquivos = (allowedMimeTypes: string[], maxSizeBytes: number) => {
  return pipe(
    filter((files: Set<File>) => {
      const invalidFiles: File[] = [];
      files.forEach(file => {
        if (!allowedMimeTypes.includes(file.type) || file.size > maxSizeBytes) {
          invalidFiles.push(file);
        }
      });
      if (invalidFiles.length) {
        const errors = invalidFiles.map(file => {
          if (!allowedMimeTypes.includes(file.type)) {
            return `Formato válido somente para ${allowedMimeTypes.join(', ')}`;
          }
          return `O tamanho máximo permitido é ${maxSizeBytes / 1024 / 1024} MB`;
        });
        throw errors;
      }
      return true;
    })
  )
}
