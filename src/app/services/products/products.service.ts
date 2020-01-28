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
    return this._uploadService.uploadFile( 'files', file, 'products', id )
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

  deleteProduct( id: string, idMaster: string ) {
    let url = URL_API + '/products/product/' + id;
    url += '?token=' + this.token

    return this.http.delete( url )
                    .pipe(
                      map( resp => {
                        this.deleteMaster(idMaster)
                        .subscribe((resp2) => {
                          console.log(resp2);
                        });
                        swal({
                            type: 'success',
                            title: 'DELETED!',
                            html: 'The product has been deleted!',
                          });
                        return true;
                      })
                    );
  }

  deleteMaster(id: string) {
    let url = URL_API + '/master/master/' + id;
    url += '?token=' + this.token

    return this.http.delete( url )
                    .pipe(
                      map( resp => {
                        console.log('RELACION MASTER ELIMINADA CORRECTAMENTE!');
                        console.log(resp);
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

  getSubcategories(idClient: string, idCategory: string) {
    const url = URL_API + '/subcategories/subcategory/client/' + idClient + '/category/' + idCategory;
    return this.http.get(url)
                    .pipe(
                      map( (resp: any) => {
                        console.log(resp.subcategorias);
                        return resp.subcategorias;
                      })
                    );
  }

   // tslint:disable-next-line:max-line-length
   insertProductMaster(client: string, category: string, tipo: string, subcategory1: string, product: string) {

    let message: any;
    const url = URL_API + '/master/master';

    const masterSub5 = {
        master_client: client,
        master_category: category,
        master_subcategory1: subcategory1,
        master_subcategory2: null,
        master_subcategory3: null,
        master_subcategory4: null,
        master_type: tipo,
        master_product: product
    }

    console.log(masterSub5);

    return this.http.post(url, masterSub5)
                    .pipe(
                      map( (resp: any) => {
                        console.log(resp);
                        const master = resp.master._id;
                        this.insertMasterInProduct(product, master)
                        .subscribe( (resp2: any) => {
                          console.log('RESPUESTA QUE RETORNA EL UPDATE DEL PRODUCTO CON MASTER: ' + resp2);
                        });
                        return resp.master;
                      }),
                      catchError( err => {
                        console.log( err.status);
                        status = err.status;
                        message = err.error.err.message;

                        if (err.error.err.code === 11000) {
                          swal({
                            type: 'error',
                            title: status,
                            text: 'Esta Subategoria en esta categoria con este cliente ya existe, por favor verifique e intente de nuevo'
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

  insertMasterInProduct(product: string, master: string) {
    let message: any;
    const url = URL_API + '/products/product/' + product + '/master/' + master;
    return this.http.put(url, master)
                    .pipe(
                      map( (resp: any) => {
                        console.log(resp);
                        console.log('ACTUALIZO CORRECTAMENTE EL PRODUCTO INSERTANDO EL MASTER');
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




}
