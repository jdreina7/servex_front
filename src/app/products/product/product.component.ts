import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { ProductsService, ClientService } from 'app/services/service.index';
import { Product } from '../../models/products.model';
import { URL_API } from '../../config/config';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  cargando = false;
  product: Product = new Product('', '', '', '', '', '', '');

  p_cliente = '';
  p_categoria = '';
  p_subcategoria = '';
  p_admite_subcat = true;
  p_no_tiene_sub_asignadas = false;
  nArray = [];
  imgSubir: File;
  fileProdSubir: File;
  fileProdSubir2: any;
  fileProdSubirName: string;
  imgTemp: any;
  imgTemp3: any;
  imgTemp4: any;
  img = '';
  idProduct = '';
  cambioFoto = false;
  totalRegistros = 0;
  alert = false;
  alert2 = false;

  descargarImg = URL_API;

  clientes = [];
  categorias = [];
  subcategorias = [];

  constructor(
    public _productService: ProductsService,
    public _clientService: ClientService,
    public router: Router,
    public activateRoute: ActivatedRoute
  ) {
    activateRoute.params.subscribe( params => {
      this.idProduct = params['id'];

      if ( this.idProduct !== 'new') {
        this.obtenerProducto(this.idProduct);
      }

    });
   }

  ngOnInit() {
    this.loadClients();
    // this.loadCatCli();
  }

  createProduct(f: NgForm ) {
    console.log(f);

    if (f.invalid ) {
      return;
    }

    if (this.product.prod_category !== null && this.product.prod_subcategory.length <= 0 && this.p_admite_subcat === true) {
      this.alert = true;
      return;
    }

    if (!this.fileProdSubir) {
      this.alert2 = true;
      return;
    }

    // console.log('ANTES DE GUARDAR: cate   ' + this.product.prod_category);
    // console.log('ANTES DE GUARDAR: subc   ' + this.product.prod_subcategory);
    // console.log('ANTES DE GUARDAR: admite?   ' + this.p_admite_subcat);
    // console.log('ANTES DE GUARDAR: NOMBRE   ' + this.product.prod_name);
    // console.log('ANTES DE GUARDAR: DESCRIPCION   ' + this.product.prod_description);

    if (this.product.prod_category !== null && this.product.prod_subcategory.length <= 0 &&  this.p_admite_subcat === false) {
      this.product.prod_subcategory = null;
      console.log('==NUEVA SUBCAT==' + this.product.prod_subcategory);
    }

    // this.product.prod_file = this.fileProdSubirName;

    this.alert = false;
    this.alert2 = false;
    this.p_no_tiene_sub_asignadas = false;
    this.p_admite_subcat = false;

    this._productService.createProduct(this.product)
                        .subscribe( (producto: any) => {
                          this._productService.changeImgProduct( this.imgSubir, producto._id.toString() )
                          this._productService.uploadFileProduct( this.fileProdSubir, producto._id.toString() )
                          this.router.navigate(['/products/product', producto._id]);
                        });
  }


  updateProduct(f: NgForm) {
    if (f.invalid ) {
      return;
    }

    this.alert = false;

    this._productService.updateProduct(this.product)
                    .subscribe( (resp: any) => {
                        this._productService.changeImgProduct( this.imgSubir, this.product._id.toString() )
                        this._productService.uploadFileProduct( this.fileProdSubir, this.product._id.toString() )
                    });
    this.fileProdSubir2 = false;
  }

  obtenerProducto( id: string) {
    this._productService.getProduct(id)
                        .subscribe(producto => {
                          console.log(producto);
                          this.product = producto;
                          this.descargarImg += '/server/files/products/' + this.product.prod_file;
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

callUploadFileProd() {
  document.getElementById('inputGroupFile02').click();
}

selectFileProduct( archivo: File ) {
  console.log(event);
  console.log(archivo);

  if ( !archivo) {
      this.fileProdSubir = null;
      this.alert2 = true;
      return;
  }

  if ( archivo.type.indexOf('x-zip-compressed') < 0 ) {
      swal({
          type: 'error',
          title: 'Error type',
          html: 'Solo están permitidos archivos de extención .zip.'
      });
      this.fileProdSubir = null;
      return;
  }

  this.fileProdSubir = archivo;
  const reader = new FileReader();

  const urlImgTemp = reader.readAsDataURL(archivo);

  reader.onloadend = () => {
      this.fileProdSubir2 = reader.result;
      this.fileProdSubirName = archivo.name;
  }

  this.alert2 = false;

}

loadClients() {
  this._clientService.loadClients()
    .subscribe((resp: any) => {
      console.log(resp);
      this.clientes = resp.clients;
    });
}


loadCatCli() {
  if (!this.product.prod_client) {
    return
  }

  this.categorias = [];
  this.subcategorias = [];
  this.nArray = [];
  this.p_cliente = '';
  this.product.prod_category = '';
  this.product.prod_subcategory = '';
  this.p_no_tiene_sub_asignadas = false;
  this.p_admite_subcat = true;
  this.alert = false;
  this.alert2 = false;
  this._clientService.catcliLoad(this.product.prod_client.toString())
                      .subscribe((resp: any) => {
                        console.log(resp.catcli);
                        this.categorias = resp.catcli;
                        // console.log('Las categorias del cliente son: ' + this.categorias[0].catcli_category.cat_name);
                      });
}


loadCatCliSub() {
  if (!this.product.prod_category) {
    return
  }

  const cat = this.categorias.find(cate => cate['catcli_category']._id === this.product.prod_category);
  console.log(cat['catcli_category'].cat_name +  ' --- ' + cat['catcli_category'].cat_support_subcategories)

  this.p_admite_subcat = cat['catcli_category'].cat_support_subcategories;

  if (cat['catcli_category'].cat_support_subcategories) {
    this._clientService.catcliSubLoad(this.product.prod_client.toString(), this.product.prod_category.toString())
                        .subscribe((resp: any) => {
                          console.log(resp.catclisub);
                          this.subcategorias = resp.catclisub;

                        if (this.subcategorias.length <= 0) {
                          this.inactiveFields3();
                        } else {
                          this.p_no_tiene_sub_asignadas = false;
                        }
                          // console.log('Las categorias del cliente son: ' + this.categorias[0].catcli_category.cat_name);
                        });
  } else {
    this.inactiveFields4();
  }
}

inactiveFields() {
  this.p_cliente = '';
  this.categorias = [];
  this.clientes = [];
  this.nArray = [];
  this.p_categoria = '';
  this.product.prod_client = '';
  this.product.prod_category = '';
  this.product.prod_subcategory = '';
  this.product.prod_name = '';
  this.product.prod_description = '';
  this.product.prod_file = '';
  this.p_no_tiene_sub_asignadas = false;
  this.p_admite_subcat = true;
  this.alert = false;
  this.alert2 = false;
  this.loadClients();
}

inactiveFields2() {
  this.categorias = [];
  this.nArray = [];
  this.p_categoria = '';
  this.product.prod_category = '';
  this.product.prod_subcategory = '';
  this.product.prod_name = '';
  this.product.prod_description = '';
  this.product.prod_file = '';
  this.p_no_tiene_sub_asignadas = false;
  this.p_admite_subcat = true;
  this.loadCatCli();
}

inactiveFields3() {
  this.product.prod_category = '';
  this.product.prod_subcategory = '';
  this.p_admite_subcat = true;
  this.p_no_tiene_sub_asignadas = true;
  this.alert = false;
}

inactiveFields4() {
  this.subcategorias = [];
  this.product.prod_subcategory = '';
  this.p_no_tiene_sub_asignadas = false;
  this.alert = false;
}




}
