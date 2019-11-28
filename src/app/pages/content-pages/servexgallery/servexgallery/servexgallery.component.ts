import { Component, OnInit } from '@angular/core';
import { ClientService, CategoryService, SubcategoryService, ProductsService, DownloadfileService } from 'app/services/service.index';
import { Product } from '../../../../models/products.model';
import { Client } from '../../../../models/clients.model';
import { Category } from '../../../../models/category.model';
import { Subcategory } from '../../../../models/subcategory.model';
import swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { URL_API } from 'app/config/config';
import {saveAs} from 'file-saver';
import { FileUploader } from 'ng2-file-upload';


@Component({
  selector: 'app-servexgallery',
  templateUrl: './servexgallery.component.html',
  styleUrls: ['./servexgallery.component.scss'],
  providers: [DownloadfileService]
})
export class ServexgalleryComponent implements OnInit {

  clientes: Client[] = [];
  categorias = [];
  subcategorias: Subcategory[] = [];
  productos: Product[] = [];
  nArray = [];
  uploader: FileUploader = new FileUploader({url: URL_API});

  idCliente = null;
  idCategoria = null;
  idSubcategoria = null;
  clienteLogo: string;
  clienteNombre: string;

  tieneSubcategorias = false;
  noResults = false;
  cargando = false;
  mensajeSinSubcategoria = false;
  mensajeNoHayProductosConEsteCriterio = false;
  mensajeClienteSinCategoriasAsignadas = false;

  constructor(
    public _clientService: ClientService,
    public _categoryService: CategoryService,
    public _subcategoryService: SubcategoryService,
    public _productService: ProductsService,
    public _downloadService: DownloadfileService,
    public httpClient: HttpClient
  ) { }

  ngOnInit() {
    this.loadClients();
    this.loadProducts();
  }

  // Primero cargamos los clientes
  loadClients() {
    this.cargando = true;
    this.mensajeSinSubcategoria = false;
    this.mensajeNoHayProductosConEsteCriterio = false;
    this._clientService.loadClients()
      .subscribe((resp: any) => {
        console.log(resp);
        this.clientes = resp.clients;
        if (this.clientes.length > 0) {
          this.cargando = false;
          this.noResults = false;
        } else {
          this.noResults = true;
        }
      });
  }

  // Segundo cargamos las Categorias del cliente seleccionado
  loadCatCli() {
    this.cargando = true;
    this.mensajeSinSubcategoria = false;
    this.mensajeNoHayProductosConEsteCriterio = false;
    this.subcategorias = [];
    this.idSubcategoria = null;
    this.tieneSubcategorias = false;

    if (this.idCliente === null) {
      console.log('El id del cliente está vacio: ' + this.idCliente);
      return;
    }

    const logo = this.clientes.find(log => log._id === this.idCliente);
    // console.log('Eli cliente para el logo = ' + logo._id);
    this.clienteLogo = logo.client_logo;
    this.clienteNombre = logo.client_bussiness_name;

    console.log(this.idCliente)

    this.categorias = [];
    this.nArray = [];
    this._clientService.catcliLoad(this.idCliente)
                      .subscribe((resp: any) => {
                        console.log(resp.catcli);
                        this.categorias = resp.catcli;
                        if (this.clientes.length > 0) {
                          this.cargando = false;
                          this.noResults = false;
                          this.mensajeClienteSinCategoriasAsignadas = false;
                        } else {
                          this.mensajeClienteSinCategoriasAsignadas = true;
                        }
                      });
  }

  // Tercero, cargamos las subcategorias que pertenezcan al cliente y a la categoria
  loadCatCliSub() {
    this.cargando = true;
    this.mensajeSinSubcategoria = false;
    this.mensajeNoHayProductosConEsteCriterio = false;
    this.mensajeClienteSinCategoriasAsignadas = false;
    this.subcategorias = [];
    this.idSubcategoria = null;
    this.tieneSubcategorias = false;

    if (this.idCategoria === null) {
      console.log('El id del cliente está vacio: ' + this.idCliente);
      return;
    }

    const cat = this.categorias.find(cate => cate['catcli_category']._id === this.idCategoria);
    console.log(cat['catcli_category'].cat_name +  ' --- ' + cat['catcli_category'].cat_support_subcategories)

    this.tieneSubcategorias = cat['catcli_category'].cat_support_subcategories;

    if (cat['catcli_category'].cat_support_subcategories) {
      this._clientService.catcliSubLoad(this.idCliente, this.idCategoria)
                          .subscribe((resp: any) => {
                            console.log(resp.catclisub);
                            this.subcategorias = resp.catclisub;
                            this.tieneSubcategorias = true;

                          if (this.subcategorias.length <= 0) {
                            this.mensajeClienteSinCategoriasAsignadas = false;
                            this.cargando = false;
                            this.mensajeSinSubcategoria = true;
                            this.tieneSubcategorias = false;
                          }
                          });
    } else {
      this.loadProductsWithouthSubcategory(this.idCliente, this.idCategoria);
    }
  }

  // Cuarto cargamos los productos dependiendo de si tienen o no subcategoria
  loadProductsWithouthSubcategory(cliente: string, categoria: string) {
    this.noResults = false;
    this.cargando = true;
    this.mensajeSinSubcategoria = false;
    this.mensajeNoHayProductosConEsteCriterio = false;
    this.mensajeClienteSinCategoriasAsignadas = false;

    this._productService.loadProductsWithoutSubcategory(cliente, categoria)
      .subscribe((resp: any) => {
        console.log(resp);
        this.productos = resp.products;
        if (this.productos.length > 0) {
          this.cargando = false;
          this.noResults = false;
          this.tieneSubcategorias = false;
        } else {
          this.cargando = false;
          this.mensajeNoHayProductosConEsteCriterio = true;
        }
      });
  }

  loadProductsWithSubcategory() {
    this.noResults = false;
    this.cargando = true;
    this.mensajeSinSubcategoria = false;
    this.mensajeNoHayProductosConEsteCriterio = false;
    this.mensajeClienteSinCategoriasAsignadas = false;

    this._productService.loadProductsWithSubcategory(this.idCliente, this.idCategoria, this.idSubcategoria)
      .subscribe((resp: any) => {
        console.log(resp);
        this.productos = resp.products;
        if (this.productos.length > 0) {
          this.cargando = false;
          this.noResults = false;
        } else {
          this.cargando = false;
          this.mensajeNoHayProductosConEsteCriterio = true;
        }
      });
  }

  loadProducts() {
    this.noResults = false;
    this.cargando = true;
    this._productService.loadProductsGallery()
      .subscribe((resp: any) => {
        console.log(resp);
        this.cargando = true;

        setTimeout(() => {
          this.productos = resp.products;
          this.cargando = false;
        }, 1500);
      });
  }


download(nombreArchivo: string) {

  if (nombreArchivo.length <= 0) {
    swal({
      type: 'error',
      title: 'Producto sin archivo',
      text: 'Al parecer, este producto no tiene cargado ningún archivo, intente más tarde.'
    });
    return;
  }
  this._downloadService.download(nombreArchivo, 'products')
  .subscribe(
      data => saveAs(data, nombreArchivo),
      // data => console.log(data, nombreArchivo),
      error => console.error(error)
  );
}

}
