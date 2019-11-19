import { Component, OnInit } from '@angular/core';
import { ClientService, CategoryService, SubcategoryService, ProductsService } from 'app/services/service.index';


@Component({
    selector: 'app-dashboard1',
    templateUrl: './dashboard1.component.html',
    styleUrls: ['./dashboard1.component.scss']
})

export class Dashboard1Component implements OnInit {

    totalClientes = 0;
    totalCategorias = 0;
    totalSubcategorias = 0;
    totalProductos = 0;

    constructor(
        public _clientService: ClientService,
        public _categoryService: CategoryService,
        public _subcategoryService: SubcategoryService,
        public _productService: ProductsService
    ) {}

    ngOnInit() {
        this.loadTotales();
        console.log('Total de Clientes: ' + this.totalClientes);
        console.log('Total de Categorias: ' + this.totalCategorias);
        console.log('Total de Subcategorias: ' + this.totalSubcategorias);
        console.log('Total de productos: ' + this.totalProductos);
    }

    loadTotales() {

        this._clientService.loadClients()
            .subscribe((resp: any) => {
            console.log(resp);
            this.totalClientes = resp.total;
        });

        this._categoryService.loadCategories()
          .subscribe((resp: any) => {
            console.log(resp);
            this.totalCategorias = resp.total;
        });

        this._subcategoryService.loadSubcategories()
          .subscribe((resp: any) => {
            console.log(resp);
            this.totalCategorias = resp.total;
        });

        this._productService.loadProducts()
          .subscribe((resp: any) => {
            console.log(resp);
            this.totalCategorias = resp.total;
        });

    }



}
