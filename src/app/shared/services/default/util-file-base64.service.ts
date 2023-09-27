import { Injectable } from '@angular/core';

interface FileData {
  fileName: string;
  fileMime: string;
  fileBase64: string;
}


@Injectable({
  providedIn: 'root'
})
export class UtilFileBase64Service {

  isDuplicatedFile(files: Set<File>, newFile: File): boolean {
    const fileExist = Array.from(files).find(file => file.name == newFile.name);
    return !!fileExist;
  }

  fileToBase64(file: File): Promise<FileData> {
    return this.filesToBase64(new Set<File>([file]))
      .then((filesData: FileData[]) => filesData[0]);
  }

  filesToBase64(files: Set<File>): Promise<FileData[]> {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSizeBytes = 5 * 1024 * 1024; // 5 MB

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
        return `${file.name} - O tamanho máximo permitido é 5 MB`;
      });
      return Promise.reject(errors);
    }

    const promises = Array.from(files).map(file => {
      return new Promise<FileData>((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
          const base64Image = reader.result as string;
          const fileData: FileData = {
            fileName: file.name,
            fileMime: base64Image.split(';')[0].split(':')[1],
            fileBase64: base64Image.split(',')[1]
          };
          resolve(fileData);
        };

        reader.onerror = (error) => {
          reject(error);
        };

      });
    });

    return Promise.all(promises);
  }

  getBase64Format(fileMime: string, fileBase64: string): string {
    return `data:${fileMime};base64,${fileBase64}`;
  }

  refreshFileSetFromInput(files: Set<File>, event: Event, fileElement: HTMLInputElement) {
    if (files.size > 0) {
      files.clear()
    }
    const inputValue = '';
    const target = event.target as HTMLInputElement;
    const fileList: FileList | null = target.files;
    if (fileList) {
      for (const element of Array.from(fileList)) {
        files.add(element);
      }
      fileElement.value = inputValue;
    }
  }
}
