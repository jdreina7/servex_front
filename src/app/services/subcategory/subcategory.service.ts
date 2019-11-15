import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_API } from '../../config/config';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { UploadFileService } from '../upload-file/upload-file.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { User } from '../../models/users.model';
import { Subcategory } from '../../models/subcategory.model';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {

  data: any = [];
  subcategoria: Subcategory;
  usuario: User;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _uploadService: UploadFileService
  ) {
    this.loadFromStorage();
    console.log('servicio de Subcategoria listo!');
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


  createSubcategory(c: Subcategory) {
    let message: any;
    let url = URL_API + '/subcategories/subcategory';
    url += '?token=' + this.token;

    return this.http.post(url, c)
                    .pipe(
                      map( (resp: any) => {
                        console.log(resp);
                        swal('Subcategoria Creada!', 'Subcategoria almacenada correctamente', 'success');
                        return resp.subcategoria;
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

  updateSubcategory(c: Subcategory) {
    let message: any;
    let url = URL_API + '/subcategories/subcategory/' + c._id;
    url += '?token=' + this.token;
    return this.http.put(url, c)
                    .pipe(
                      map( (resp: any) => {
                        console.log(resp);
                        swal('Actualizado!', 'Subcategoria actualizada correctamente', 'success');
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

  changeImgSubcategory( file: File, id: string ) {
    if (file) {
      this._uploadService.uploadFile( 'uploads', file, 'subcategories', id )
                       .then( ( resp: any ) => {
                        console.log(resp.categoryUpdated);
                        return true;
                       })
                       .catch( resp => {
                         console.log(resp);
                       });
    } else {
      return;
    }
  }

  deleteSubcategory( id: string ) {
    let url = URL_API + '/subcategories/subcategory/' + id;
    url += '?token=' + this.token

    return this.http.delete( url )
                    .pipe(
                      map( resp => {
                        swal({
                            type: 'success',
                            title: 'DELETED!',
                            html: 'La subcategoria ha sido eliminada de manera permanente!',
                          });
                        return true;
                      })
                    );
  }

  activateSubcategory(  subcategoria: Subcategory  ) {
    let url = URL_API + '/subcategories/activateSubcategory/' + subcategoria._id;
    url += '?token=' + this.token

    return this.http.put( url, subcategoria )
                    .pipe(
                      map( resp => {
                        swal({
                            type: 'success',
                            title: 'ACTIVATED!',
                            html: 'The Subcategory has been activated again!',
                          });
                        return true;
                      })
                    );
  }

  loadSubcategories( desde: number = 0 ) {
    const url = URL_API + '/subcategories?desde=' + desde;
    return this.http.get( url );
  }

  searchSubcategory( termino: string ) {
    const url = URL_API + '/search/all/' + termino;

    return this.http.get( url )
                    .pipe(
                      map( (resp: any) => resp.subcategories )
                    );
  }

  getSubcategory( id: string ) {
    let url = URL_API + '/subcategories/' + id;
    url += '?token=' + this.token

    return this.http.get(url)
                    .pipe(
                      map( (resp: any) => resp.subcategoria )
                    );
  }


}
