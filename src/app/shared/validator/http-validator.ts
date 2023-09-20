export class HttpValidator {
  static validateResponseErrorMessage = (err: any): string => {
    return err.error?.message ? err.error?.message : "Ocorreu um erro inesperado no servidor, tente mais tarde."
  }
}

