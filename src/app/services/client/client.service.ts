import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client } from '../../models/clients.model';
import { URL_API } from '../../config/config';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { UploadFileService } from '../upload-file/upload-file.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { User } from '../../models/users.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {


  data: any = [];
  cliente: Client;
  usuario: User;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _uploadService: UploadFileService
  ) {
    this.loadFromStorage();
    console.log('servicio de Cliente listo!');
   }


   loadFromStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('user'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

   createClient(c: Client) {
    let message: any;
    let url = URL_API + '/clients/client';
    url += '?token=' + this.token;

    return this.http.post(url, c)
                    .pipe(
                      map( (resp: any) => {
                        console.log(resp);
                        swal('Cliente Creado!', 'Cliente almacenado correctamente', 'success');
                        return resp.cliente;
                      }),
                      catchError( err => {
                        console.log( err.status);
                        status = err.status;
                        message = err.error.err.message;

                        swal({
                          type: 'error',
                          title: status,
                          text: message
                        });

                        return throwError(err);
                      })
                    );
  }

  updateClient(c: Client) {
    let message: any;
    let url = URL_API + '/clients/client/' + c._id;
    url += '?token=' + this.token;
    return this.http.put(url, c)
                    .pipe(
                      map( (resp: any) => {
                        console.log(resp);
                        swal('Actualizado!', 'Cliente actualizado correctamente', 'success');
                        return true;
                      }),
                      catchError( err => {
                        console.log( err.status);
                        status = err.status;
                        message = err.error.err.message;

                        swal({
                          type: 'error',
                          title: status,
                          text: message
                        });

                        return throwError(err);
                      })
                    );
  }

  changeLogoClient( file: File, id: string ) {
    if (file) {
      this._uploadService.uploadFile( 'uploads', file, 'clients', id )
                       .then( ( resp: any ) => {
                        console.log(resp.userUpdated);
                        return true;
                       })
                       .catch( resp => {
                         console.log(resp);
                       });
    } else {
      return;
    }
  }

  deleteClient( id: string ) {
    let url = URL_API + '/clients/client/' + id;
    url += '?token=' + this.token

    return this.http.delete( url )
                    .pipe(
                      map( resp => {
                        swal({
                            type: 'success',
                            title: 'DELETED!',
                            html: 'El cliente ha sido eliminado de manera permanente!',
                          });
                        return true;
                      })
                    );
  }

  activateClient(  cliente: Client  ) {
    let url = URL_API + '/users/activateClient/' + cliente._id;
    url += '?token=' + this.token

    return this.http.put( url, cliente )
                    .pipe(
                      map( resp => {
                        swal({
                            type: 'success',
                            title: 'ACTIVATED!',
                            html: 'The Client has been activated again!',
                          });
                        return true;
                      })
                    );
  }

  /*********************************************************************************/
  /*                                   USERS FUNCTIONS                               /
  /*********************************************************************************/

  loadClients( desde: number = 0 ) {
    const url = URL_API + '/clients?desde=' + desde;

    return this.http.get( url );
  }

  searchClient( termino: string ) {
    const url = URL_API + '/search/all/' + termino;

    return this.http.get( url )
                    .pipe(
                      map( (resp: any) => resp.clients )
                    );
  }

  getClient( id: string ) {
    let url = URL_API + '/clients/' + id;
    url += '?token=' + this.token

    return this.http.get(url)
                    .pipe(
                      map( (resp: any) => resp.cliente )
                    );
  }
}
