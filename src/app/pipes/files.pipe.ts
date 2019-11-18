import { Pipe, PipeTransform } from '@angular/core';
import { URL_API } from '../config/config';

@Pipe({
  name: 'files'
})
export class FilesPipe implements PipeTransform {

  transform(myfile: string, tipo: string): any {

    let url = URL_API + '/files';

    if ( !myfile ) {
      return url + '/lost';
    }

    if ( myfile.indexOf('https') >= 0 ) {
      return myfile;
    }

    switch ( tipo ) {
      case 'products':
        url += '/products/' + myfile;
      break;

      default:
        console.log('Tipo de archivo a subir no existe = ' + myfile);
        url += '/lost';
    }

    console.log('ESTA ES LA URL QUE DEVUELVE EL PIPE DE FILES: ' + url);
    return url;
  }

}
