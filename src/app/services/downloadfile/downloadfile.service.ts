import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Http, ResponseContentType, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { URL_API } from 'app/config/config';


@Injectable({
  providedIn: 'root'
})
export class DownloadfileService {

  url = URL_API;

  constructor(
    private _http: HttpClient,
  ) { }

  download(nombreArchivo: string, tipo: string) {
    this.url += '/./files/' + tipo + '/' + nombreArchivo;
    const body = {filename: nombreArchivo};

    console.log(this.url)
    return this._http.get(this.url, {
          responseType : 'blob',
          headers: new HttpHeaders().append('Content-Type', 'application/json')
      });
  //   return this._http.post(this.url, body, {
  //     responseType : 'blob',
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  // });
}

}
