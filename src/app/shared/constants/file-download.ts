export const fileDownloadFromBlob = (responseFile: any, fileName: string, fileExtension: string): void => {
  // Instanciando um Arquivo e definindo seu tipo
  const file = new Blob([responseFile, {type: responseFile.type}]);

  createLinkAndStartDownload(file, fileName, fileExtension)
}

export const imageDownloadFromBase64 = (fileBase64: string, fileName: string) => {
  const contentType = extractImageContentTypeBase64(fileBase64);
  const extension = extractExtension(contentType);
  const file = extractImageFile(fileBase64);
  const blob = new Blob(file, { type: contentType});

  createLinkAndStartDownload(blob, fileName, extension);
}

export const fileDownloadFromBlobAndContentTypeOnHeader = (response: any, fileName: string) => {
  // Processar a resposta do servidor
  const contentType = extractContentType(response);
  const extension = extractExtension(contentType);
  const file = extractFileFromResponse(response)
  const blob = new Blob([file], { type: contentType }); // Criar o objeto Blob a partir do corpo da resposta e do tipo de conteúdo

  createLinkAndStartDownload(blob, fileName, extension)
}


const extractContentType = (response: any) => {
  return response.headers?.get('Content-Type') || 'application/octet-stream';
}

const extractImageContentTypeBase64 = (fileBase64 : string) => {
  return fileBase64.split(':')[1].split(';')[0];
}

const extractImageFile = (fileBase64 : string) => {

  const byteCharacters = atob(fileBase64.split(",")[1]);
  const chunkSize = 1024;
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += chunkSize) {
    const chunk = byteCharacters.slice(offset, offset + chunkSize);
    byteArrays.push(Uint8Array.from(chunk, c => c.charCodeAt(0)));
  }
  return byteArrays;

}

const extractExtension = (contentType: string) => {
  return contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ? 'xlsx'
    : contentType.split('/')[1]
}

const extractFileFromResponse = (response: any) => {
  return response?.body ? response.body : response
}

const createLinkAndStartDownload = (blob: Blob, fileName: string, extension: string) =>{
  const url = window.URL.createObjectURL(blob); // Criar a URL do arquivo Blob recebido
  const link = document.createElement('a'); // Cria um elemento <a> para fazer o download
  link.href = url;
  link.download = `${fileName}.${extension}`; // Definir o nome do arquivo que será baixado
  link.style.display = 'none'; // Esconder o elemento
  document.body.appendChild(link); // Adicionar o elemento ao corpo da página
  link.click(); // Dar o clique no elemento para iniciar o download
  window.URL.revokeObjectURL(url); // Limpar a URL criada
  document.body.removeChild(link); // Remover o elemento do corpo da página
}
