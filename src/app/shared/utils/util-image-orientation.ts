export class UtilImageOrientation {

  static async detectOrientation(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (file) {
        const image = new Image();
        image.src = URL.createObjectURL(file);
        image.onload = () => {
          const width = image.naturalWidth;
          const height = image.naturalHeight;
          URL.revokeObjectURL(image.src);
          if (width > height) {
            resolve('landscape');
          } else if (width < height) {
            resolve('portrait');
          } else {
            resolve('square');
          }
        }
      } else {
        reject(new Error('File is not valid'));
      }
    })
  }
}
