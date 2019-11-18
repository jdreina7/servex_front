import { Injectable } from '@angular/core';
import { URL_API } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  url: string;
  constructor() { }

  uploadFile( clase: string, archivo: File, tipo: string, id: string ) {

    if ( archivo ) {
      return new Promise ( (resolve, reject ) => {
        const formData = new FormData();
        const xhr = new XMLHttpRequest();

        formData.append('img', archivo, archivo.name );

        console.log('EL NOMBRE DEL ARCHIVO QUE LLEGA AL UPLOAD SERVICE: ' + archivo.name);

        if ( clase === 'uploads') {

          xhr.onreadystatechange = function () {
            if ( xhr.readyState === 4 ) {
              if ( xhr.status === 200 ) {
                console.log('Imagen subida');
                resolve( JSON.parse(xhr.response) );
              } else {
                console.log('Fallo la subida de la img');
                reject( xhr.response );
              }
            }
          };

          this.url = URL_API + '/uploads/' + tipo + '/' + id;

          xhr.open( 'PUT', this.url, true );
          xhr.send( formData );

        } else if (clase === 'files') {
          xhr.onreadystatechange = function () {
            if ( xhr.readyState === 4 ) {
              if ( xhr.status === 200 ) {
                console.log('Archivo subido correctamente');
                resolve( JSON.parse(xhr.response) );
              } else {
                console.log('Fallo la subida del archivo');
                reject( xhr.response );
              }
            }
          };

          this.url = URL_API + '/files/' + tipo + '/' + id;

          xhr.open( 'PUT', this.url, true );
          xhr.send( formData );
        }

      })
    } else {
      return;
    }

  }
}
