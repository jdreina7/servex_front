import { Component, OnInit } from '@angular/core';
import { Subcategory } from '../../models/subcategory.model';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { SubcategoryService, ClientService, DownloadfileService } from 'app/services/service.index';
import { Category } from 'app/models/category.model';
import { toArray } from 'rxjs/operators';
import { Client } from '../../models/clients.model';
import { URL_API } from 'app/config/config';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss']
})
export class SubcategoryComponent implements OnInit {

  url_api = URL_API;
  cargando = false;
  subcategoria: Subcategory = new Subcategory('', '', '', '', '', '', '', '', '', '');
  categories = [];
  subcategories1 = [];
  subcategories2 = [];
  subcategories3 = [];
  clientes: Client[] = [];
  subcategorias2 = [];
  subcatcli = '';
  subcatcli2 = '';
  nArray = [];
  imgSubir: File
  imgTemp: any
  imgTemp3: any
  imgTemp4: any
  img = '';
  idSubcategory = '';
  cambioFoto = false;
  totalRegistros = 0;
  alert = false;
  alert2 = false;
  idMaster = '';
  tipoR = '';
  categorySelected = null;
  categorySelected2 = null;
  categorySelected3 = null;
  subcategory1Selected = null;
  subcategory2Selected = null;
  subcategory3Selected = null;
  idSubcategory3 = '';
  alertSize = false;

  fileSubir: File;
  fileSubir2: any;
  fileSubirName: string;
  fileDescargarName = '';

  flag = 0;

  selectedCategory: Category;

  constructor(
    public _subcategoryService: SubcategoryService,
    public _clienteService: ClientService,
    public _downloadService: DownloadfileService,
    public router: Router,
    public activateRoute: ActivatedRoute
  ) {
    activateRoute.params.subscribe( params => {
      this.idSubcategory = params['id'];

      if ( this.idSubcategory !== 'new') {
        this.obtenerSubcategoria(this.idSubcategory);
      }

    });
   }

  ngOnInit() {
    this.loadClients();
    // this.loadCatCli();
  }

  createSubcategory(f: NgForm ) {
    console.log(f);

    if (f.invalid ) {
      return;
    }

    if (this.subcategoria.subcat_category === '') {
      this.alert = true;
      return;
    }

    if (this.subcategoria.subcat_category === null) {
      this.alert = true;
      return;
    }

    if (this.subcategoria.subcat_client === '') {
      this.alert = true;
      return;
    }

    if (this.subcategoria.subcat_client === null) {
      this.alert = true;
      return;
    }

    this.alert = false;
    if (this.flag === 1) {
      this.tipoR = 'B'
      const client = this.subcategoria.subcat_client;
      const category = this.subcategoria.subcat_category;
      this.subcategoria.subcat_subcategory1 = null;
      this.subcategoria.subcat_subcategory2 = null;
      this.subcategoria.subcat_subcategory3 = null;
      this.subcategoria.subcat_subcategory4 = null;
      this._subcategoryService.createSubcategory(this.subcategoria)
                        .subscribe( (subcategoria: any) => {
                          if (this.fileSubir2) {
                            this._subcategoryService.uploadFile( this.fileSubir, subcategoria._id.toString() )
                                              .then( (resp2: any) => {
                                                this.obtenerSubcategoria(subcategoria._id.toString())
                                              })
                                              .catch( resp2 => {
                                                console.log(resp2);
                                              });
                          }
                          this._subcategoryService.changeImgSubcategory( this.imgSubir, subcategoria._id.toString() )
                          // tslint:disable-next-line:max-line-length
                          this._subcategoryService.catclisubSave(client, category, this.tipoR, subcategoria._id.toString())
                            .subscribe((resp: any) => {
                              console.log('===========> LA RESPUESTA DE master ES: ' + resp.master);
                            });
                          this.router.navigate(['/subcategories/subcategory', subcategoria._id]);
                        });
    }

    if (this.flag === 2) {
      // alert('Entro al segundo juan');
      this.tipoR = 'C'
      const client = this.subcategoria.subcat_client;
      const category = this.subcategoria.subcat_category;
      const subcategory1 = this.subcategoria.subcat_subcategory1;
      this.subcategoria.subcat_subcategory2 = null;
      this.subcategoria.subcat_subcategory3 = null;
      this.subcategoria.subcat_subcategory4 = null;
      this.subcategoria.subcat_name = '- ' + this.subcategoria.subcat_name;
      this._subcategoryService.createSubcategory(this.subcategoria)
                        .subscribe( (subcategoria: any) => {
                          this._subcategoryService.changeImgSubcategory( this.imgSubir, subcategoria._id.toString() )
                          // tslint:disable-next-line:max-line-length
                          this._subcategoryService.catclisub2Save(client, category, this.tipoR, subcategory1, subcategoria._id.toString())
                            .subscribe((resp: any) => {
                              console.log('===========> LA RESPUESTA DE CATCLI ES: ' + resp);
                            });
                          this.router.navigate(['/subcategories/subcategory', subcategoria._id]);
                        });
    }

    if (this.flag === 3) {
      // alert('Entro al tercero juan');
      this.tipoR = 'D'
      const client = this.subcategoria.subcat_client;
      const category = this.subcategoria.subcat_category;
      const subcategory1 = this.subcategoria.subcat_subcategory1;
      const subcategory2 = this.subcategoria.subcat_subcategory2;
      this.subcategoria.subcat_subcategory3 = null;
      this.subcategoria.subcat_subcategory4 = null;
      this.subcategoria.subcat_name = '- - ' + this.subcategoria.subcat_name;
      this._subcategoryService.createSubcategory(this.subcategoria)
                        .subscribe( (subcategoria: any) => {
                          this._subcategoryService.changeImgSubcategory( this.imgSubir, subcategoria._id.toString() )
                          // tslint:disable-next-line:max-line-length
                          this._subcategoryService.catclisub3Save(client, category, this.tipoR, subcategory1, subcategory2, subcategoria._id.toString())
                            .subscribe((resp: any) => {
                              console.log('===========> LA RESPUESTA DE CATCLI ES: ' + resp);
                            });
                          this.router.navigate(['/subcategories/subcategory', subcategoria._id]);
                        });
    }

    if (this.flag === 4) {
      // alert('Entro al cuarto juan');
      this.tipoR = 'E'
      const client = this.subcategoria.subcat_client;
      const category = this.subcategoria.subcat_category;
      const subcategory1 = this.subcategoria.subcat_subcategory1;
      const subcategory2 = this.subcategoria.subcat_subcategory2;
      const subcategory3 = this.subcategoria.subcat_subcategory3;
      this.subcategoria.subcat_subcategory4 = null;
      this.subcategoria.subcat_name = '- - - ' + this.subcategoria.subcat_name;
      this._subcategoryService.createSubcategory(this.subcategoria)
                        .subscribe( (subcategoria: any) => {
                          this._subcategoryService.changeImgSubcategory( this.imgSubir, subcategoria._id.toString() )
                          // tslint:disable-next-line:max-line-length
                          this._subcategoryService.catclisub4Save(client, category, this.tipoR, subcategory1, subcategory2, subcategory3, subcategoria._id.toString())
                            .subscribe((resp: any) => {
                              console.log('===========> LA RESPUESTA DE CATCLI ES: ' + resp);
                            });
                          this.router.navigate(['/subcategories/subcategory', subcategoria._id]);
                        });

    }
  }

  updateSubcategory(f: NgForm) {
    if (f.invalid ) {
      return;
    }

    if (this.subcategoria.subcat_category === '') {
      this.alert = true;
      return;
    }

    if (this.subcategoria.subcat_category === null) {
      this.alert = true;
      return;
    }

    this.alert = false;

    if (this.imgTemp) {
      this._subcategoryService.changeImgSubcategory( this.imgSubir, this.subcategoria._id.toString() )
    }

    this._subcategoryService.updateSubcategory(this.subcategoria)
                    .subscribe( (resp: any) => {
                        this._subcategoryService.changeImgSubcategory( this.imgSubir, this.subcategoria._id.toString() )

                        if (this.fileSubir) {
                          swal({
                            title: 'Uploading file...',
                            // tslint:disable-next-line:max-line-length
                            html: '<div class="spinner-grow text-primary" role="status"><span class="sr-only">Loading...</span></div>',
                            showConfirmButton: false
                          })
                          this._subcategoryService.uploadFile( this.fileSubir, this.subcategoria._id.toString() )
                                            .then( (resp2: any) => {
                                              swal('Actualizado!', 'Subcategoria actualizada correctamente', 'success');
                                              this.obtenerSubcategoria(this.subcategoria._id.toString())
                                            })
                                            .catch( resp2 => {
                                              console.log(resp2);
                                            });
                        }

                        if (!this.fileSubir) {
                          swal('Actualizado!', 'Subcategoria actualizada correctamente', 'success');
                          this.obtenerSubcategoria(this.subcategoria._id.toString())
                        }
                    });
  }

  obtenerSubcategoria( id: string) {
    this._subcategoryService.getSubcategory(id)
                        .subscribe(subcategoria => {
                          console.log(subcategoria);
                          this.fileSubir2 = null;
                          this.fileSubir = null;
                          this.fileDescargarName = '';
                          this.subcategoria = subcategoria;
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

loadClients() {
  this._clienteService.loadClients()
    .subscribe((resp: any) => {
      console.log(resp);
      this.clientes = resp.clients;
      // this.subcatcli = '';
      // this.loadCatCli();
    });
}

loadCatCli() {

  if (!this.subcategoria.subcat_client) {
    return
  }

  this.categories = [];
  this._clienteService.catcliClienteLoad(this.subcategoria.subcat_client.toString())
                      .subscribe((resp: any) => {
                        console.log(resp.catcli);
                        // this.categorias = resp.catcli;
                        // const newArray = resp.master;
                        // for (let i = 0; i < newArray.length; i++) {
                        //   const element = newArray[i];
                        //   console.log(element);
                        //   // console.log(element['catcli_category']);
                        //   // if (element['catcli_category'].cat_support_subcategories) {
                        //   //   this.nArray.push(element);
                        //   // }
                        // }
                        // this.categories = this.nArray;
                        this.categories = resp.catcli;
                        // console.log('Las categorias del cliente FILTRADAS son: ' + this.categories[0].master_category.cat_name);
                      });
}

loadSubcat1() {

  if (!this.subcategoria.subcat_client) {
    return
  }

  this.subcategories1 = [];
  this._clienteService.loadSubcat1(this.subcategoria.subcat_client, this.subcategoria.subcat_category)
                      .subscribe((resp: any) => {
                        console.log(resp.master);
                        this.subcategories1 = resp.master;

                        if (this.subcategories1.length <= 0) {
                          console.log('ESTA CATEGORIA NO POSEE SUBCATEGORIAS AÚN');
                        }
                      });
  this.flag = 1;
}


loadSubcat2() {

  if (!this.subcategoria.subcat_client) {
    return
  }

  console.log(this.subcategoria.subcat_subcategory1);

  this.subcategories2 = [];
  this._clienteService.loadSubcat2(this.subcategoria.subcat_client,
                                   this.subcategoria.subcat_category,
                                   this.subcategoria.subcat_subcategory1 )
                      .subscribe((resp: any) => {
                        console.log(resp.master);
                        this.subcategories2 = resp.master;
                      });
  this.flag = 2;
}

loadSubcat3() {

  const idClient = this.subcategoria.subcat_client;
  const idCategory = this.subcategoria.subcat_category;
  const subcategory1 = this.subcategoria.subcat_subcategory1;
  const subcategory2 = this.subcategoria.subcat_subcategory2;

  console.log(idClient);
  console.log(idCategory);
  console.log(subcategory2);

  if (!this.subcategoria.subcat_client) {
    return
  }

  this.subcategories3 = [];
  this._clienteService.loadSubcat3(idClient, idCategory, subcategory1, subcategory2 )
                      .subscribe((resp: any) => {
                        console.log(resp.master);
                        this.subcategories3 = resp.master;
                      });
  this.flag = 3;
}

lastSubcategory() {
  this.flag = 4;
}

obtenerCategoriasPadre() {
  this._subcategoryService.getCategoriesEnable()
                          .subscribe( (resp: any) => {
                            // console.log('la respuesta: ' + JSON.stringify(resp.categories));
                            this.categories = JSON.parse(JSON.stringify(resp.categories));
                            // console.log(this.categories);
                          });
}

inactiveFields() {
  this.categories = [];
  this.subcategories1 = [];
  this.subcategories2 = [];
  this.subcategories3 = [];
  this.subcategoria.subcat_subcategory1 = '';
  this.subcategoria.subcat_subcategory2 = '';
  this.subcategoria.subcat_subcategory3 = '';
}

inactiveFields2() {
  this.subcategories1 = [];
  this.subcategories2 = [];
  this.subcategories3 = [];
  this.subcategoria.subcat_subcategory1 = '';
  this.subcategoria.subcat_subcategory2 = '';
  this.subcategoria.subcat_subcategory3 = '';
}

inactiveFields3() {
  alert('Entro al 3 clear');
  this.subcategories2 = [];
  this.subcategories3 = [];
  this.subcategoria.subcat_subcategory2 = '';
  this.subcategoria.subcat_subcategory3 = '';
}

inactiveFields4() {
  alert('Entro al 4 clear');
  this.subcategories3 = [];
  this.subcategoria.subcat_subcategory2 = '';
  this.subcategoria.subcat_subcategory3 = '';
}

inactiveFields5() {
  alert('Entro al 5 clear');
  this.subcategoria.subcat_subcategory3 = '';
}


callUploadFileProd() {
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
      text: 'Not ID subcategory'
    });
  }

  swal({
    title: 'Are you sure?',
    text: 'This action will DELETED the files ZIP of the subcategory!',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, do it!'
  }).then((result) => {
    if (result.value) {
      this._subcategoryService.deleteFile(id)
                      .subscribe( (resp: any) => {
                        console.log('La categoria: ' + resp.categoria);
                        console.log(resp.categoria);
                        this.obtenerSubcategoria(id);
                      });
    }
  })


}

downloadFile() {
  document.getElementById('downloadFile').click();
}

}
