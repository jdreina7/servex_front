import { Component, OnInit } from '@angular/core';
import { Client } from '../../models/clients.model';
import { ClientService, CategoryService } from 'app/services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { Category } from 'app/models/category.model';
import { URL_API } from 'app/config/config';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-clients',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  closeResult: string;
  modalOptions: NgbModalOptions;

  url_api = URL_API;
  cargando = false;
  cliente: Client = new Client('', '', '', '', '', '', '');
  categorias: Category[] = [];
  categorias2 = [];
  catcli = '';
  imgSubir: File
  imgTemp: any
  imgTemp3: any
  imgTemp4: any
  img = '';
  idClient = '';
  cambioFoto = false;

  fileSubir: File;
  fileSubir2: any;
  fileSubirName: string;
  fileDescargarName = '';
  alertSize = false;

  categoria: Category = new Category('', '', '', '', '', 'true');
  imgSubirCat: File
  imgTempCat: any
  fileSubirCat: File;
  fileSubir2Cat: any;
  fileSubirNameCat: string;
  fileDescargarNameCat = '';
  alertSizeCat = false;
  imgCat = '';
  idCategory = '';
  cambioFotoCat = false;

  constructor(
    public _clienteService: ClientService,
    public _categoryService: CategoryService,
    public router: Router,
    public activateRoute: ActivatedRoute,
    private modalService: NgbModal
  ) {
    activateRoute.params.subscribe( params => {
      this.idClient = params['id'];

      if ( this.idClient !== 'new') {
        this.obtenerCliente(this.idClient);
      }

    });
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'lg'
    }
   }

  ngOnInit() {
    this.loadCategories();
  }

  createClient(f: NgForm ) {
    // console.log(user);

    if (f.invalid ) {
      return;
    }

    this._clienteService.createClient(this.cliente)
                        .subscribe( (cliente: any) => {
                          this._clienteService.changeLogoClient( this.imgSubir, cliente._id.toString() )

                          if (this.fileSubir2) {
                            swal({
                              title: 'Uploading file...',
                              // tslint:disable-next-line:max-line-length
                              html: '<div class="spinner-grow text-primary" role="status"><span class="sr-only">Loading...</span></div>',
                              showConfirmButton: false
                            })
                            this._clienteService.uploadFile( this.fileSubir, cliente._id.toString() )
                                              .then( (resp2: any) => {
                                                this.alertSize = false;
                                                this.obtenerCliente(cliente._id.toString())
                                                swal('Created!', 'The client has been created correctly', 'success');
                                                this.router.navigate(['/clients/client', cliente._id]);
                                              })
                                              .catch( resp2 => {
                                                console.log(resp2);
                                              });
                          }

                          this.router.navigate(['/clients/client', cliente._id]);
                        });
  }

  updateClient(f: NgForm) {
    if (f.invalid ) {
      return;
    }

    this._clienteService.updateClient(this.cliente)
                    .subscribe( (resp: any) => {

                      swal({
                        title: 'Updating client...',
                        // tslint:disable-next-line:max-line-length
                        html: '<div class="spinner-grow text-primary" role="status"><span class="sr-only">Loading...</span></div>',
                        showConfirmButton: false
                      });

                        if ( this.catcli !== '') {
                          // console.log('SI ENTRO AL CATCLI Y SE ENVIARA ESTO: ' + this.cliente._id.toString() + '  ' + this.catcli );
                          this._clienteService.catcliSave( this.cliente._id.toString(), this.catcli)
                          .subscribe((resp2: any) => {
                            console.log('===========> LA RESPUESTA DE CATCLI ES: ' + resp);
                          });
                        }

                        if (this.imgSubir) {
                          this._clienteService.changeLogoClient( this.imgSubir, this.cliente._id.toString() )
                          .then( (resp2: any) => {
                            if (!resp2) {
                              this.router.navigate(['/clients']);
                            }
                          })
                          .catch( resp2 => {
                            console.log(resp2);
                          });
                        }

                        if (this.fileSubir) {
                          console.log('ENTRO A SUBIR EL ARCHIVO');
                          // swal({
                          //   title: 'Uploading file...',
                          //   // tslint:disable-next-line:max-line-length
                          //   html: '<div class="spinner-grow text-primary" role="status"><span class="sr-only">Loading...</span></div>',
                          //   showConfirmButton: false
                          // })
                          this._clienteService.uploadFile( this.fileSubir, this.cliente._id.toString() )
                                            .then( (resp2: any) => {
                                              this.alertSize = false;
                                              this.obtenerCliente(this.cliente._id.toString())
                                              swal('Updated!', 'The client was updated succesfully', 'success');
                                              this.router.navigate(['/clients/client', this.cliente._id]);
                                              this.loadCategories();
                                            })
                                            .catch( resp2 => {
                                              console.log(resp2);
                                            });
                        }

                        if (!this.fileSubir) {
                          swal('Updated!', 'The client was updated succesfully', 'success');
                          this.loadCategories();
                        }
                    });
  }

  obtenerCliente( id: string) {
    this._clienteService.getClient(id)
                        .subscribe(cliente => {
                          // console.log(cliente);
                          this.fileSubir = null;
                          this.fileSubir2 = null;
                          this.fileSubirName = '';
                          this.cliente = cliente;
                        });
  }

  callUploadImg() {
    document.getElementById('inputGroupFile01').click();
}

selectImg( archivo: File ) {
  console.log(event);
  console.log(archivo);

  if ( !archivo) {
      this.imgSubir = null;
      return;
  }

  if ( archivo.type.indexOf('image') < 0 ) {
      swal({
          type: 'error',
          title: 'Error type',
          html: 'The selected file is not an image! Please select only JPG, PNG or JPEG image type.'
      });
      this.imgSubir = null;
      return;
  }

  this.cambioFoto = true;
  this.imgSubir = archivo;

  const reader = new FileReader();

  const urlImgTemp = reader.readAsDataURL(archivo);

  reader.onloadend = () => {
      this.imgTemp = reader.result;
  }
  // this.imgTemp2 = this.imgTemp;
}

callUploadImgCat() {
  document.getElementById('inputGroupFileCat2').click();
}

selectImgCat( archivo: File ) {
    console.log(event);
    console.log(archivo);

    if ( !archivo) {
        this.imgSubirCat = null;
        return;
    }

    if ( archivo.type.indexOf('image') < 0 ) {
        swal({
            type: 'error',
            title: 'Error type',
            html: 'The selected file is not an image! Please select only JPG, PNG or JPEG image type.'
        });
        this.imgSubirCat = null;
        return;
    }

    this.cambioFoto = true;
    this.imgSubirCat = archivo;

    const reader = new FileReader();

    const urlImgTemp = reader.readAsDataURL(archivo);

    reader.onloadend = () => {
        this.imgTempCat = reader.result;
    }
    // this.imgTemp2 = this.imgTemp;
}

callUploadFile() {
  document.getElementById('inputGroupFile02').click();
}

selectFile( archivo: File ) {
  console.log(event);
  console.log(archivo);

  if ( !archivo) {
      this.fileSubir = null;
      return;
  }

  if ( archivo.type.indexOf('x-zip-compressed') < 0 ) {
      swal({
          type: 'error',
          title: 'Error type',
          html: 'Only ZIP files.'
      });
      this.fileSubir = null;
      return;
  }

  if (archivo.size >= 100000000 ) {
    swal({
      type: 'error',
      title: 'Max File Upload Error - MAX 100 MB',
      html: 'This file is too big, please consider upload another file more lightweight'
  });
  this.fileSubir = null;
  return;
  }

  if (archivo.size > 15000000 && archivo.size <= 50000000 ) {
    this.alertSize = true;
  }

  this.fileSubir = archivo;
  const reader = new FileReader();

  const urlImgTemp = reader.readAsDataURL(archivo);

  reader.onloadend = () => {
      this.fileSubir2 = reader.result;
      this.fileSubirName = archivo.name;
  }

}

deleteFiles(id: string) {
  if (!id) {
    swal({
      type: 'warning',
      title: 'Somenthing wrong!',
      text: 'Not ID category'
    });
  }

  swal({
    title: 'Are you sure?',
    text: 'This action will DELETED the files ZIP of the client!',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, do it!'
  }).then((result) => {
    if (result.value) {
      this._clienteService.deleteFile(id)
                      .subscribe( (resp: any) => {
                        console.log('La categoria: ' + resp.categoria);
                        console.log(resp.categoria);
                        this.obtenerCliente(id);
                      });
    }
  })


}

loadCategories() {
  this._clienteService.loadCategories()
    .subscribe((resp: any) => {
      console.log(resp);
      this.categorias = resp.categories;
      this.catcli = '';
      this.loadCatCli();
    });
}

loadCatCli() {

  if (!this.cliente._id) {
    return
  }

  this._clienteService.catcliClienteLoad(this.cliente._id.toString())
                      .subscribe((resp: any) => {
                        console.log(resp.master);
                        this.categorias2 = resp.catcli;
                        // console.log('Las categorias del cliente son: ' + this.categorias2);
                      });
}

deleteCatcli(id1: string, id2: string) {
  console.log('Id de la relacion catcli: ' + id1);
  console.log('Id de la categoria: ' + id2.toString());
  swal({
    title: 'ARE YOU SURE?',
    text: 'This action will remove permanently all relations under this Client - Category, '
    + ' and the products and subcategories will be lost!',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, do it!'
  }).then((result) => {
    if (result.value) {
      this._clienteService.deleteMasterByCategoryClient(id1, id2)
                          .subscribe( () => console.log('Master eliminado con el id del cliente y el id de la categoria'));
      this._categoryService.deleteCategory(id2)
                            .subscribe( () => console.log('Categoria eliminada'));
      this._clienteService.deleteCatcli(id1)
                          .subscribe( (resp: any) => {
                            console.log(resp);
                            this.categorias2 = []
                            this.loadCategories();
                          });
    }
  })
}

downloadFile() {
  document.getElementById('downloadFile').click();
}


open(content) {
  this.modalService.open(content, this.modalOptions).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}

private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return  `with: ${reason}`;
  }
}

createCategory(f: NgForm ) {
  // console.log(user);

  if (f.invalid ) {
    return;
  }

  this.categoria.cat_client = this.cliente._id.toString();
  console.log(this.categoria.cat_client);
  this._categoryService.createCategory(this.categoria, this.cliente._id.toString())
                      .subscribe( (categoria: any) => {
                        console.log(this.categoria);
                        if (this.imgTempCat) {
                          this._categoryService.changeImgCategory( this.imgSubirCat, categoria._id.toString() )
                                                .then( (resp2: any) => {
                                                  // this.obtenerCategoria(categoria._id.toString())
                                                })
                                                .catch( resp2 => {
                                                  console.log(resp2);
                                                });
                        }

                        if (this.fileSubir2) {
                          swal({
                            title: 'Uploading file...',
                            // tslint:disable-next-line:max-line-length
                            html: '<div class="spinner-grow text-primary" role="status"><span class="sr-only">Loading...</span></div>',
                            showConfirmButton: false
                          })
                          this._categoryService.uploadFile( this.fileSubir, categoria._id.toString() )
                                            .then( (resp2: any) => {
                                              this.alertSize = false;
                                              this._clienteService.catcliSave( this.cliente._id.toString(), categoria._id)
                                              .subscribe((resp3: any) => {
                                                console.log('===========> LA RESPUESTA DE CATCLI ES: ' + resp3);
                                                this.reloadPage();
                                              });
                                              // swal('Asigned!', 'The category has been asigned correctly to this client', 'success');
                                              // this.router.navigate(['/categories/category', categoria._id]);
                                              // this.router.navigate(['/clients/client', this.cliente._id]);
                                            })
                                            .catch( resp2 => {
                                              console.log(resp2);
                                            });
                        } else {
                          this._clienteService.catcliSave( this.cliente._id.toString(), categoria._id)
                          .subscribe((resp3: any) => {
                            console.log('===========> LA RESPUESTA DE CATCLI ES: ' + resp3);
                            this.reloadPage();
                            // swal('Asigned!', 'The category has been asigned correctly to this client', 'success');
                          });
                        }
                      });
}

callUploadFileCat() {
  document.getElementById('inputGroupFileCat').click();
}

selectFileCat( archivo: File ) {
  console.log(event);
  console.log(archivo);

  if ( !archivo) {
      this.fileSubir = null;
      return;
  }

  if ( archivo.type.indexOf('x-zip-compressed') < 0 ) {
      swal({
          type: 'error',
          title: 'Error type',
          html: 'Only ZIP files.'
      });
      this.fileSubir = null;
      return;
  }

  if (archivo.size >= 100000000 ) {
    swal({
      type: 'error',
      title: 'Max File Upload Error - MAX 100 MB',
      html: 'This file is too big, please consider upload another file more lightweight'
  });
  this.fileSubir = null;
  return;
  }

  if (archivo.size > 15000000 && archivo.size <= 50000000 ) {
    this.alertSize = true;
  }

  this.fileSubir = archivo;
  const reader = new FileReader();

  const urlImgTemp = reader.readAsDataURL(archivo);

  reader.onloadend = () => {
      this.fileSubir2 = reader.result;
      this.fileSubirName = archivo.name;
  }

}

reloadPage() {
  document.getElementById('closeModal1').click();
  this.clearModal();
  this.loadCatCli();
}


clearModal() {
  this.categoria.cat_name = '';
  this.categoria.cat_description = '';
  this.categoria.cat_img = '';
  this.categoria.cat_file = '';
}

}
