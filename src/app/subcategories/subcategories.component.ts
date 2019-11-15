import { Component, OnInit } from '@angular/core';
import { Subcategory } from '../models/subcategory.model';
import { SubcategoryService, CategoryService } from 'app/services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { TITLES } from './subcategory.config';
import { Category } from 'app/models/category.model';

@Component({
  selector: 'app-subcategories',
  templateUrl: './subcategories.component.html',
  styleUrls: ['./subcategories.component.scss']
})
export class SubcategoriesComponent implements OnInit {

  subcategorias: Subcategory[] = [];
  categoriaPadre: Category = new Category('', '', '', '', '');
  desde = 0;
  totalRegistros = 0;
  cargando = true;
  busqueda = true;
  words: any[];
  noResults = false;

  constructor(
    public _subcategoriaService: SubcategoryService,
    public _categoriaService: CategoryService
  ) { }

  ngOnInit() {
    this.loadSubcategories();
    this.words = TITLES['0'];
  }

  loadSubcategories() {
    this.noResults = false;
    this.cargando = true;
    this._subcategoriaService.loadSubcategories(this.desde)
      .subscribe((resp: any) => {
        console.log(resp);
        this.totalRegistros = resp.total;
        this.busqueda = true;
        this.subcategorias = resp.subcategories;
        this.cargando = false;
        // this.busqueda = false;
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
    this.loadSubcategories();

  }

  searchSubcategory(termino: string) {

    this.cargando = true;

    if (termino.length <= 0) {
      // this.cargando = false;
      this.busqueda = true;
      this.loadSubcategories();
      return;
    }

    this._subcategoriaService.searchSubcategory(termino)
      .subscribe((subcategorias: Subcategory[]) => {
        this.cargando = true;
        console.log(subcategorias);
        this.subcategorias = subcategorias;
        this.cargando = true;

        if (this.subcategorias.length <= 0) {
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


  deleteSubcategory(subcategoria: Subcategory) {
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
          const idSubcategory = subcategoria._id;
          this._subcategoriaService.deleteSubcategory(idSubcategory.toString())
            .subscribe(resp => {
              console.log(resp);
              this.loadSubcategories();
            });
        }
      })
  }


  activateSubcategory(subcategoria: Subcategory) {

    swal({
      title: 'Are you sure?',
      text: 'This action will Activate the user of the system and all its functions!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, do it!'
    }).then((result) => {
      if (result.value) {
        this._subcategoriaService.activateSubcategory(subcategoria)
          .subscribe(resp => {
            console.log(resp);
            this.loadSubcategories();
          });
      }
    })

  }

  obtenerCategoriaPadre( id: string) {
  this._categoriaService.getCategory(id)
                        .subscribe(categoria => {
                          console.log(categoria);
                          this.categoriaPadre = categoria;
                          return this.categoriaPadre.cat_name;
                        });
  }


}
