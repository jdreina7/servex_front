import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/users.model';
import { URL_API } from '../../config/config';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { UploadFileService } from '../upload-file/upload-file.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  data: any = [];
  usuario: User;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _uploadService: UploadFileService
  ) {
    this.loadFromStorage();
    console.log('servicio de usuario listo');
  }

  saveStorage( id: string, token: string, usuario: User ) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(usuario));

    this.token = token;
    this.usuario = usuario;
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

  logout() {
    this.token = '';
    this.usuario = null;

    localStorage.clear();
    this.router.navigate(['/pages/login']);
  }

  login( usuario: User ) {
    let message: any;
    const url = URL_API + '/login';
    return this.http.post(url, usuario)
                    .pipe(
                      map( (resp: any) => {
                        this.saveStorage(resp.id, resp.token, resp.user);
                        swal({
                          title: 'Loading...',
                          html: '<div class="spinner-grow text-primary" role="status"><span class="sr-only">Loading...</span></div>',
                          timer: 3000,
                          showConfirmButton: false
                        })
                        return true;
                      }),
                      catchError( err => {
                        console.log( err.status);
                        status = err.status;
                        message = err.error.message;

                        swal({
                          type: 'error',
                          title: status,
                          text: message
                        });

                        return throwError(err);
                      })
                    );
  }

  isLogued() {
    return (this.token.length > 5) ? true : false;
  }

  createUser(u: User) {
    let message: any;
    let url = URL_API + '/users/user';
    url += '?token=' + this.token;

    return this.http.post(url, u)
                    .pipe(
                      map( (resp: any) => {
                        console.log(resp);
                        swal('Usuario Creado!', 'Usuario almacenado correctamente', 'success');
                        return resp.usuario;
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

  updateUser(u: User) {
    const url = URL_API + '/users/user/' + u._id;
    // url += '?token=' + this.token;
    return this.http.put(url, u)
                    .pipe(
                      map( (resp: any) => {
                        console.log(resp);
                        this.saveStorage(resp.usuario._id, this.token, resp.usuario);
                        swal('Actualizado!', 'Cambios almacenados correctamente', 'success');
                        return true;
                      })
                    );
  }

  updateOtherUser(u: User) {
    let url = URL_API + '/users/user/' + u._id;
    url += '?token=' + this.token;
    return this.http.put(url, u)
                    .pipe(
                      map( (resp: any) => {
                        console.log(resp);
                        swal('Actualizado!', 'Usuario ' + resp.usuario.usr_name + ' actualizado correctamente', 'success');
                        return true;
                      })
                    );
  }

  changeImgUser( file: File, id: string ) {
    if (file) {
      this._uploadService.uploadFile( 'uploads', file, 'users', id )
                       .then( ( resp: any ) => {
                        console.log(resp.userUpdated);
                        // this.usuario = resp.userUpdated;
                        this.saveStorage( id, this.token, resp['userUpdated'] );
                        return true;
                       })
                       .catch( resp => {
                         console.log(resp);
                       });
    } else {
      return;
    }
  }

  changeImgOtherUser( file: File, id: string ) {
    if (file) {
      this._uploadService.uploadFile( 'uploads', file, 'users', id )
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


  deleteUser( id: string ) {
    let url = URL_API + '/users/user/' + id;
    url += '?token=' + this.token

    return this.http.delete( url )
                    .pipe(
                      map( resp => {
                        swal({
                            type: 'success',
                            title: 'DISABLED!',
                            html: 'The User has been disabled from the system!',
                          });
                        return true;
                      })
                    );
  }

  activateUser(  usuario: User  ) {
    let url = URL_API + '/users/activateUser/' + usuario._id;
    url += '?token=' + this.token

    return this.http.put( url, usuario )
                    .pipe(
                      map( resp => {
                        swal({
                            type: 'success',
                            title: 'ACTIVATED!',
                            html: 'The User has been activated again!',
                          });
                        return true;
                      })
                    );
  }

  /*********************************************************************************/
  /*                                   USERS FUNCTIONS                               /
  /*********************************************************************************/

  loadUsers( desde: number = 0 ) {
    const url = URL_API + '/users?desde=' + desde;
    return this.http.get( url );
  }

  searchUser( termino: string ) {
    const url = URL_API + '/search/all/' + termino;

    return this.http.get( url )
                    .pipe(
                      map( (resp: any) => resp.users )
                    );
  }

  getOnUser( id: string ) {
    let url = URL_API + '/users/' + id;
    url += '?token=' + this.token

    return this.http.get(url)
                    .pipe(
                      map( (resp: any) => resp.usuario )
                    );
  }

}
