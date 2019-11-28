import { Component, OnInit } from '@angular/core';
import { Subcategory } from '../models/subcategory.model';
import { SubcategoryService, CategoryService, ProductsService } from 'app/services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { TITLES } from './products.config';
import { Category } from 'app/models/category.model';
import { Product } from '../models/products.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  productos: Product[] = [];
  desde = 0;
  totalRegistros = 0;
  cargando = true;
  busqueda = true;
  words: any[];
  noResults = false;

  constructor(
    public _productsService: ProductsService
  ) { }

  ngOnInit() {
    this.loadProducts();
    this.words = TITLES['0'];
  }

  loadProducts() {
    this.noResults = false;
    this.cargando = true;
    this._productsService.loadProducts(this.desde)
      .subscribe((resp: any) => {
        console.log(resp);
        this.totalRegistros = resp.total;
        this.busqueda = true;
        this.productos = resp.products;
        this.cargando = false;
      });
  }

  cambiarDesde(valor: number) {

    const desde = this.desde + valor;
    console.log(desde);

    if (desde >= this.totalRegistros) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.loadProducts();

  }

  searchProducts(termino: string) {

    this.cargando = true;

    if (termino.length <= 0) {
      // this.cargando = false;
      this.busqueda = true;
      this.loadProducts();
      return;
    }

    this._productsService.searchProducts(termino)
      .subscribe((productos: Product[]) => {
        this.cargando = true;
        console.log(productos);
        this.productos = productos;
        this.cargando = true;

        if (this.productos.length <= 0) {
          this.cargando = true;

          setTimeout(() => {
            this.busqueda = false;
            this.cargando = false;
            this.noResults = true;
          }, 1500);

        } else {
          this.cargando = false;
          this.busqueda = true;
        }
      })
  }


  deleteProduct(product: Product) {
      swal({
        title: 'Are you sure?',
        text: 'This action will DELETED the subcategory of the system and all its functions!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, do it!'
      }).then((result) => {
        if (result.value) {
          const idProduct = product._id;
          const masterRelation = product.prod_master;
          this._productsService.deleteProduct(idProduct.toString(), masterRelation)
            .subscribe(resp => {
              console.log(resp);
              this.loadProducts();
            });
        }
      })
  }





}
