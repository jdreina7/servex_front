import { Pipe, PipeTransform } from '@angular/core';
import { URL_API } from '../config/config';

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  transform(img: string, tipo: string): any {

    let url = URL_API + '/images';

    if ( !img ) {
      return url + '/users/cualquiera';
    }

    if ( img.indexOf('https') >= 0 ) {
      return img;
    }

    switch ( tipo ) {
      case 'users':
        url += '/users/' + img;
      break;

      case 'clients':
        url += '/clients/' + img;
      break;

      case 'categories':
        url += '/categories/' + img;
      break;

      case 'subcategories':
        url += '/subcategories/' + img;
      break;

      case 'products':
        url += '/products/' + img;
      break;

      default:
        console.log('Tipo de img no existe = ' + img);
        url += '/users/cualquiera';
    }

    console.log('ESTA ES LA URL QUE DEVUELVE EL PIPE DE IMG: ' + url);
    return url;
  }

}
