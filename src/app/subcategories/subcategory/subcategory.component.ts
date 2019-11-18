import { Component, OnInit } from '@angular/core';
import { Subcategory } from '../../models/subcategory.model';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { SubcategoryService, ClientService } from 'app/services/service.index';
import { Category } from 'app/models/category.model';
import { toArray } from 'rxjs/operators';
import { Client } from '../../models/clients.model';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss']
})
export class SubcategoryComponent implements OnInit {

  cargando = false;
  subcategoria: Subcategory = new Subcategory('', '', '', '', '');
  categories = [];
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

  selectedCategory: Category;

  constructor(
    public _subcategoryService: SubcategoryService,
    public _clienteService: ClientService,
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
    this._subcategoryService.createSubcategory(this.subcategoria)
                        .subscribe( (subcategoria: any) => {
                          this._subcategoryService.changeImgSubcategory( this.imgSubir, subcategoria._id.toString() )
                          // tslint:disable-next-line:max-line-length
                          this._subcategoryService.catclisubSave( this.subcategoria.subcat_client.toString(), this.subcategoria.subcat_category, subcategoria._id.toString())
                            .subscribe((resp: any) => {
                              console.log('===========> LA RESPUESTA DE CATCLI ES: ' + resp);
                            });
                          this.router.navigate(['/subcategories/subcategory', subcategoria._id]);
                        });
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

    this._subcategoryService.updateSubcategory(this.subcategoria)
                    .subscribe( (resp: any) => {
                        this._subcategoryService.changeImgSubcategory( this.imgSubir, this.subcategoria._id.toString() )
                    });
  }

  obtenerSubcategoria( id: string) {
    this._subcategoryService.getSubcategory(id)
                        .subscribe(subcategoria => {
                          console.log(subcategoria);
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
  this.nArray = [];
  this.subcatcli2 = '';
  this._clienteService.catcliLoad(this.subcategoria.subcat_client.toString())
                      .subscribe((resp: any) => {
                        console.log(resp.catcli);
                        // this.categorias = resp.catcli;
                        const newArray = resp.catcli;
                        for (let i = 0; i < newArray.length; i++) {
                          const element = newArray[i];
                          console.log(element);
                          // console.log(element['catcli_category']);
                          if (element['catcli_category'].cat_support_subcategories) {
                            this.nArray.push(element);
                          }
                        }
                        this.categories = this.nArray;
                        console.log('Las categorias del cliente FILTRADAS son: ' + this.categories[0].catcli_category.cat_name);
                      });
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
  this.subcatcli = '';
  this.categories = [];
  this.nArray = [];
  this.subcatcli2 = '';
  this.subcategoria.subcat_name = '';
  this.subcategoria.subcat_description = '';
}

inactiveFields2() {
  this.subcategoria.subcat_name = '';
  this.subcategoria.subcat_description = '';
}

inactiveFields3() {
  this.subcatcli = '';
  this.categories = [];
  this.nArray = [];
  this.subcatcli2 = '';
}



}
