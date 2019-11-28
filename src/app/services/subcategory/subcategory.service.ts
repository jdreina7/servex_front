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

  deleteSubcategory( id: string, idMaster: string ) {
    let url = URL_API + '/subcategories/subcategory/' + id;
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
                            html: 'La subcategoria ha sido eliminada de manera permanente!',
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

  getCategoriesEnable() {
    let url = URL_API + '/categories/subcategory/enabledSubcategories';
    url += '?token=' + this.token;

    return this.http.get(url);
  }



  catclisubSave(client: string, category: string, tipo: string, subcategory: string) {

    let message: any;
    const url = URL_API + '/master/master';

    const masterSub1 = {
        master_client: client,
        master_category: category,
        master_subcategory1: subcategory,
        master_type: tipo
    }

    console.log(masterSub1);

    return this.http.post(url, masterSub1)
                    .pipe(
                      map( (resp: any) => {
                        console.log(resp);
                        const master = resp.master._id;
                        this.insertMasterInSubcategory(subcategory, master)
                        .subscribe( (resp2: any) => {
                          console.log('RESPUESTA QUE RETORNA EL UPDATE DE LA SUBCATEGORIA CON MASTER: ' + resp2);
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

  catclisub2Save(client: string, category: string, tipo: string, subcategory1: string, subcategory2: string) {

    let message: any;
    const url = URL_API + '/master/master';

    const masterSub2 = {
        master_client: client,
        master_category: category,
        master_subcategory1: subcategory1,
        master_subcategory2: subcategory2,
        master_type: tipo
    }

    console.log(masterSub2);

    return this.http.post(url, masterSub2)
                    .pipe(
                      map( (resp: any) => {
                        console.log(resp);
                        const master = resp.master._id;
                        this.insertMasterInSubcategory(subcategory2, master)
                        .subscribe( (resp2: any) => {
                          console.log('RESPUESTA QUE RETORNA EL UPDATE DE LA SUBCATEGORIA CON MASTER: ' + resp2);
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

  catclisub3Save(client: string, category: string, tipo: string, subcategory1: string, subcategory2: string, subcategory3: string) {

    let message: any;
    const url = URL_API + '/master/master';

    const masterSub3 = {
        master_client: client,
        master_category: category,
        master_subcategory1: subcategory1,
        master_subcategory2: subcategory2,
        master_subcategory3: subcategory3,
        master_type: tipo
    }

    console.log(masterSub3);

    return this.http.post(url, masterSub3)
                    .pipe(
                      map( (resp: any) => {
                        console.log(resp);
                        const master = resp.master._id;
                        this.insertMasterInSubcategory(subcategory3, master)
                        .subscribe( (resp2: any) => {
                          console.log('RESPUESTA QUE RETORNA EL UPDATE DE LA SUBCATEGORIA CON MASTER: ' + resp2);
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

  // tslint:disable-next-line:max-line-length
  catclisub4Save(client: string, category: string, tipo: string, subcategory1: string, subcategory2: string, subcategory3: string, subcategory4: string) {

    let message: any;
    const url = URL_API + '/master/master';

    const masterSub4 = {
        master_client: client,
        master_category: category,
        master_subcategory1: subcategory1,
        master_subcategory2: subcategory2,
        master_subcategory3: subcategory3,
        master_subcategory4: subcategory4,
        master_type: tipo
    }

    console.log(masterSub4);

    return this.http.post(url, masterSub4)
                    .pipe(
                      map( (resp: any) => {
                        console.log(resp);
                        const master = resp.master._id;
                        this.insertMasterInSubcategory(subcategory4, master)
                        .subscribe( (resp2: any) => {
                          console.log('RESPUESTA QUE RETORNA EL UPDATE DE LA SUBCATEGORIA CON MASTER: ' + resp2);
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

  insertMasterInSubcategory(subcategory: string, master: string) {
    let message: any;
    const url = URL_API + '/subcategories/subcategory/' + subcategory + '/master/' + master;
    return this.http.put(url, master)
                    .pipe(
                      map( (resp: any) => {
                        console.log(resp);
                        console.log('ACTUALIZO CORRECTAMENTE LA CATEGORIA INSERTANDO EL MASTER');
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

  catcliSubLoad(id: string) {
    let message: any;
    let message2: any;
    let url = URL_API + '/catclisub/subcategory/' + id;
    url += '?token=' + this.token

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
                          type: 'info',
                          text: 'Este cliente no tiene asignadas subcategorias aún, ' +
                          'puede empezar agregandole seleccionando un cliente y una categoría ' +
                          ' del cliente seleccionado en esta misma ventana.'
                        });

                        return throwError(err);
                      })
                    );
  }

  deleteCatcliSub(id: string) {
    let url = URL_API + '/catclisub/catclisub/' + id;
    url += '?token=' + this.token

    return this.http.delete(url)
                    .pipe(
                      map( (resp: any) => {
                        swal('Relación eliminada!!', 'Cliente - Categoria - Subcategoría', 'success');
                        return true;
                      } )
                    );
  }

  uploadFile( file: File, id: string ) {
    let updated;
    if (file) {
    return this._uploadService.uploadFile( 'files', file, 'subcategories', id )
                       .then( ( resp: any ) => {
                        console.log('RESPUESTA DESDE EL UPLOAD SERVICE: ');
                        console.log(resp.subcatUpdated);
                        updated = resp.subcatUpdated;
                        return updated;
                       })
                       .catch( resp => {
                         console.log(resp);
                       });
    } else {
      return;
    }
  }

  deleteFile(id: string) {
    let message: any;
    let url = URL_API + '/subcategories/subcategory/deleteFile/' + id;
    url += '?token=' + this.token;
    return this.http.put(url, id)
                    .pipe(
                      map( (resp: any) => {
                        console.log('RESPUESTA DESDE EL SERVICE: ' + resp);
                        swal('Deleted!', 'The subcategory file was deleted!', 'success');
                        return resp;
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
