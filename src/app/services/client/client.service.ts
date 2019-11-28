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
    return this._uploadService.uploadFile( 'uploads', file, 'clients', id )
                       .then( ( resp: any ) => {
                        console.log(resp.userUpdated);
                        return true;
                       })
                       .catch( resp => {
                         console.log(resp);
                         swal({
                          title: 'UPS!',
                          text: 'We can\'t found the current image for updated with the new, do you want delete it and try again?',
                          type: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#3085d6',
                          cancelButtonColor: '#d33',
                          confirmButtonText: 'Yes, do it!'
                        }).then((result) => {
                          if (result.value) {
                            this.clearLogoClient(id)
                                                .subscribe( (resp2: any) => {
                                                  return resp2;
                                                });
                          }
                        })
                       });
    } else {
      return;
    }
  }

  clearLogoClient(id: string) {
    const url = URL_API + '/clients/clearLogo/' + id;
    return this.http.put( url, id )
                    .pipe(
                      map( resp => {
                        console.log(resp);
                        return resp;
                      })
                    );

  }

  deleteClient( id: string ) {
    const url = URL_API + '/clients/client/' + id;

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
    let url = URL_API + '/clients/activateClient/' + cliente._id;
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

  loadCategories() {
    const url = URL_API + '/categories';
    return this.http.get( url );
  }

  catcliSave(id: string, category: string) {

    let message: any;
    const url = URL_API + '/catcli/catcli';

    const catcli = {
        catcli_category: category,
        catcli_client: id
    }

    console.log(catcli);

    return this.http.post(url, catcli)
                    .pipe(
                      map( (resp: any) => {
                        console.log(resp);
                        // swal('Cliente Creado!', 'Cliente almacenado correctamente', 'success');
                        return resp.catcli;
                      }),
                      catchError( err => {
                        console.log( err.status);
                        status = err.status;
                        message = err.error.err.message;

                        if (err.error.err.code === 11000) {
                          swal({
                            type: 'error',
                            title: status,
                            text: 'Esta Categoria en este cliente ya existe, por favor verifique e intente de nuevo'
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


  catcliClienteLoad(id: string) {
    let message: any;
    let message2: any;
    const url = URL_API + '/catcli/client/' + id;
    // url += '?token=' + this.token

    return this.http.get(url)
                    .pipe(
                      map( (resp: any) => {
                        console.log(resp);
                        return resp;
                      }),
                      catchError( err => {
                        console.log( err.status);
                        status = err.status;
                        message2 = err.error.mensaje

                        if ( err.error.err) {
                          message = err.error.err.message;
                          if (err.error.err.code === 11000) {
                            swal({
                              type: 'error',
                              title: status,
                              text: 'Esta Subategoria en este cliente ya existe, por favor verifique e intente de nuevo'
                            });
                            return throwError(err);
                          }
                        }

                        swal({
                          type: 'info',
                          text: 'Este cliente no tiene asignadas categorias aún, ' +
                          'puede empezar agregandole una en el apartado de \'Asignar categorías a cliente\' en esta misma ventana.'
                        });

                        return throwError(err);
                      })
                    );

  }


  catcliLoad(id: string) {
    let message: any;
    let message2: any;
    const url = URL_API + '/master/client/' + id;

    return this.http.get(url)
                    .pipe(
                      map( (resp: any) => {
                        console.log(resp);
                        // swal('Cliente Creado!', 'Cliente almacenado correctamente', 'success');
                        return resp;
                      }),
                      catchError( err => {
                        console.log( err.status);
                        status = err.status;
                        message2 = err.error.mensaje

                        if ( err.error.err) {
                          message = err.error.err.message;
                          if (err.error.err.code === 11000) {
                            swal({
                              type: 'error',
                              title: status,
                              text: 'Esta Subategoria en este cliente ya existe, por favor verifique e intente de nuevo'
                            });
                            return throwError(err);
                          }
                        }

                        swal({
                          type: 'error',
                          title: status,
                          text: 'Este cliente no tiene asignadas categorias aún, ' +
                           'para asignarle categorías, vaya al menú de cliente, seleccione editar y agreguele las categorias necesarias.'
                        });

                        return throwError(err);
                      })
                    );

  }

  loadSubcat1(idClient: string, idCategory: string) {
    let message: any;
    let message2: any;
    const url = URL_API + '/master/subcategory1/client/' + idClient + '/category/' + idCategory;

    return this.http.get(url)
                    .pipe(
                      map( (resp: any) => {
                        console.log(resp);
                        return resp;
                      }),
                      catchError( err => {
                        console.log( err.status);
                        status = err.status;
                        message2 = err.error.mensaje

                        if ( err.error.err) {
                          message = err.error.err.message;
                          if (err.error.err.code === 11000) {
                            swal({
                              type: 'error',
                              title: status,
                              text: 'Esta Subategoria en este cliente ya existe, por favor verifique e intente de nuevo'
                            });
                            return throwError(err);
                          }
                        }

                        // swal({
                        //   type: 'error',
                        //   title: status,
                        //   text: 'Este cliente no tiene asignadas categorias aún, ' +
                        //    'para asignarle categorías, vaya al menú de cliente, seleccione editar y agreguele las categorias necesarias.'
                        // });

                        return throwError(err);
                      })
                    );

  }

  loadSubcat2(idClient: string, idCategory: string, idSubcategory: string) {
    let message: any;
    let message2: any;
    const url = URL_API + '/master/subcategory2/' + idSubcategory + '/client/' + idClient + '/category/' + idCategory;

    return this.http.get(url)
                    .pipe(
                      map( (resp: any) => {
                        console.log(resp);
                        return resp;
                      }),
                      catchError( err => {
                        console.log( err.status);
                        status = err.status;
                        message2 = err.error.mensaje

                        if ( err.error.err) {
                          message = err.error.err.message;
                          if (err.error.err.code === 11000) {
                            swal({
                              type: 'error',
                              title: status,
                              text: 'Esta Subategoria en este cliente ya existe, por favor verifique e intente de nuevo'
                            });
                            return throwError(err);
                          }
                        }
                        return throwError(err);
                      })
                    );

  }

  loadSubcat3(idClient: string, idCategory: string, idSubcategory2: string, idSubcategory3: string) {
    let message: any;
    let message2: any;
    // tslint:disable-next-line:max-line-length
    const url = URL_API + '/master/subcategory2/' + idSubcategory2 + '/subcategory3/' + idSubcategory3 + '/client/' + idClient + '/category/' + idCategory;

    return this.http.get(url)
                    .pipe(
                      map( (resp: any) => {
                        console.log(resp);
                        return resp;
                      }),
                      catchError( err => {
                        console.log( err.status);
                        status = err.status;
                        message2 = err.error.mensaje

                        if ( err.error.err) {
                          message = err.error.err.message;
                          if (err.error.err.code === 11000) {
                            swal({
                              type: 'error',
                              title: status,
                              text: 'Esta Subategoria en este cliente ya existe, por favor verifique e intente de nuevo'
                            });
                            return throwError(err);
                          }
                        }
                        return throwError(err);
                      })
                    );

  }


  deleteCatcli(id1: any) {
    const url = URL_API + '/catcli/catcli/' + id1;

    return this.http.delete(url)
                    .pipe(
                      map( (resp: any) => {
                        swal('Relación eliminada!!', 'Cliente - Categoria', 'success');
                        return true;
                      } )
                    );
  }

  catcliSubLoad(idClient: string, idCategory: string) {
    let message2: any;
    const url = URL_API + '/catclisub/client/' + idClient + '/category/' + idCategory;

    return this.http.get(url)
                    .pipe(
                      map( (resp: any) => {
                        console.log(resp);
                        // swal('Cliente Creado!', 'Cliente almacenado correctamente', 'success');
                        return resp;
                      }),
                      catchError( err => {
                        console.log( err.status);
                        status = err.status;
                        message2 = err.error.mensaje


                        swal({
                          type: 'error',
                          title: status,
                          text: message2
                        });

                        return throwError(err);
                      })
                    );

  }

}
