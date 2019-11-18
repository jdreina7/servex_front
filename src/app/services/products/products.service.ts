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
import { Product } from '../../models/products.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

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
    console.log('servicio de Productos listo!');
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

  // PRINCIPALES SERVICIOS

  createProduct(c: Product) {
    let message: any;
    let url = URL_API + '/products/product';
    url += '?token=' + this.token;

    return this.http.post(url, c)
                    .pipe(
                      map( (resp: any) => {
                        console.log(resp);
                        swal('Producto Creado!', 'Product almacenado correctamente', 'success');
                        return resp.producto;
                      }),
                      catchError( err => {
                        console.log( err.status);
                        status = err.status;
                        message = err.error.err.message;

                        if (err.error.err.code === 11000) {
                          swal({
                            type: 'error',
                            title: status,
                            // tslint:disable-next-line:max-line-length
                            text: 'Esta Producto en esta categoria con este cliente y esta subcategoría ya existe, por favor verifique e intente de nuevo'
                          });
                          return throwError(err);
                        }

                        swal({
                          type: 'error',
                          title: status,
                          text: message
                        });

                        return throwError(err);
                      })
                    );
  }

  updateProduct(c: Product) {
    let message: any;
    let url = URL_API + '/Products/product/' + c._id;
    url += '?token=' + this.token;
    return this.http.put(url, c)
                    .pipe(
                      map( (resp: any) => {
                        console.log(resp);
                        swal('Actualizado!', 'Producto actualizado correctamente', 'success');
                        return true;
                      }),
                      catchError( err => {
                        console.log( err.status);
                        status = err.status;
                        message = err.error.err.message;

                        if (err.error.err.code === 11000) {
                          swal({
                            type: 'error',
                            title: status,
                            // tslint:disable-next-line:max-line-length
                            text: 'Esta Producto en esta categoria con este cliente y esta subcategoría ya existe, por favor verifique e intente de nuevo'
                          });
                          return throwError(err);
                        }

                        swal({
                          type: 'error',
                          title: status,
                          text: message
                        });

                        return throwError(err);
                      })
                    );
  }

  changeImgProduct( file: File, id: string ) {
    if (file) {
      this._uploadService.uploadFile( 'uploads', file, 'products', id )
                       .then( ( resp: any ) => {
                        console.log(resp.productUpdated);
                        return true;
                       })
                       .catch( resp => {
                         console.log(resp);
                       });
    } else {
      return;
    }
  }

  uploadFileProduct( file: File, id: string ) {
    if (file) {
      this._uploadService.uploadFile( 'files', file, 'products', id )
                       .then( ( resp: any ) => {
                        console.log(resp.productUpdated);
                        return true;
                       })
                       .catch( resp => {
                         console.log(resp);
                       });
    } else {
      return;
    }
  }

  deleteProduct( id: string ) {
    let url = URL_API + '/products/product/' + id;
    url += '?token=' + this.token

    return this.http.delete( url )
                    .pipe(
                      map( resp => {
                        swal({
                            type: 'success',
                            title: 'DELETED!',
                            html: 'El Producto ha sido eliminado de manera permanente!',
                          });
                        return true;
                      })
                    );
  }

  loadProducts( desde: number = 0 ) {
    const url = URL_API + '/products?desde=' + desde;
    return this.http.get( url );
  }

  loadProductsGallery() {
    const url = URL_API + '/products';
    return this.http.get( url );
  }

  loadProductsWithoutSubcategory(idClient: string, idCategory: string) {
    const url = URL_API + '/products/client/' + idClient + '/category/' + idCategory;
    return this.http.get( url );
  }

  loadProductsWithSubcategory(idClient: string, idCategory: string, idSubcategory: string) {
    const url = URL_API + '/products/client/' + idClient + '/category/' + idCategory + '/subcategory/' + idSubcategory;
    return this.http.get( url );
  }

  searchProducts( termino: string ) {
    const url = URL_API + '/search/all/' + termino;

    return this.http.get( url )
                    .pipe(
                      map( (resp: any) => resp.products )
                    );
  }

  getProduct( id: string ) {
    let url = URL_API + '/products/' + id;
    url += '?token=' + this.token

    return this.http.get(url)
                    .pipe(
                      map( (resp: any) => resp.producto )
                    );
  }
  // SERVICIOS COMPLEMENTARIOS





}
