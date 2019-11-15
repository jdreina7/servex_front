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
import { Category } from '../../models/category.model';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  data: any = [];
  categoria: Category;
  usuario: User;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _uploadService: UploadFileService
  ) {
    this.loadFromStorage();
    console.log('servicio de Categoria listo!');
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


  createCategory(c: Category) {
    let message: any;
    let url = URL_API + '/categories/category';
    url += '?token=' + this.token;

    return this.http.post(url, c)
                    .pipe(
                      map( (resp: any) => {
                        console.log(resp);
                        swal('Categoria Creada!', 'Categoria almacenada correctamente', 'success');
                        return resp.categoria;
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

  updateCategory(c: Category) {
    let message: any;
    let url = URL_API + '/categories/category/' + c._id;
    url += '?token=' + this.token;
    return this.http.put(url, c)
                    .pipe(
                      map( (resp: any) => {
                        console.log(resp);
                        swal('Actualizado!', 'Categoria actualizada correctamente', 'success');
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

  changeImgCategory( file: File, id: string ) {
    if (file) {
      this._uploadService.uploadFile( 'uploads', file, 'categories', id )
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

  deleteCategory( id: string ) {
    let url = URL_API + '/categories/category/' + id;
    url += '?token=' + this.token

    return this.http.delete( url )
                    .pipe(
                      map( resp => {
                        swal({
                            type: 'success',
                            title: 'DELETED!',
                            html: 'La categoria ha sido eliminada de manera permanente!',
                          });
                        return true;
                      })
                    );
  }

  activateCategory(  categoria: Category  ) {
    let url = URL_API + '/categories/activateCategory/' + categoria._id;
    url += '?token=' + this.token

    return this.http.put( url, categoria )
                    .pipe(
                      map( resp => {
                        swal({
                            type: 'success',
                            title: 'ACTIVATED!',
                            html: 'The Category has been activated again!',
                          });
                        return true;
                      })
                    );
  }

  loadCategories( desde: number = 0 ) {
    const url = URL_API + '/categories?desde=' + desde;
    return this.http.get( url );
  }

  searchCategory( termino: string ) {
    const url = URL_API + '/search/all/' + termino;

    return this.http.get( url )
                    .pipe(
                      map( (resp: any) => resp.categories )
                    );
  }

  getCategory( id: string ) {
    let url = URL_API + '/categories/' + id;
    url += '?token=' + this.token

    return this.http.get(url)
                    .pipe(
                      map( (resp: any) => resp.categoria )
                    );
  }



}
