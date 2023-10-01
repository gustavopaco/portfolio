Dialog utilizando a biblioteca ngx-image-cropper para cortar imagens.
=================

## Instalação
```
npm install ngx-image-cropper --save
```

## Uso
```
import { ImageCropperDialogComponent } from './image-cropper-dialog/image-cropper-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

constructor(private dialog: MatDialog) {}

openDialog() {
  const dialogRef = this.dialog.open(ImageCropperDialogComponent, {
    width: '600px',
    height: '600px',
    data: {
      imageChangedEvent: $event,
      ...options
    }
  });

  dialogRef.afterClosed()
  pipe(
  take(1),
  finalize(() => {
    ($event.target as HTMLInputElement).value = '';
  })
  )
  .subscribe(result => {
    if (result) {
      console.log(result);
    }
  });
}
```
