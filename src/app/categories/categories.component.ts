import { Component, OnInit } from '@angular/core';
import { Category } from '../models/category.model';
import { CategoryService } from 'app/services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { TITLES } from './category.config';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  categorias: Category[] = [];
  desde = 0;
  totalRegistros = 0;
  cargando = true;
  busqueda = true;
  words: any[];
  noResults = false;

  constructor(
    public _categoriaService: CategoryService
  ) { }

  ngOnInit() {
    this.loadCategories();
    this.words = TITLES['0'];
  }

  loadCategories() {
    this.noResults = false;
    this.cargando = true;
    this._categoriaService.loadCategories(this.desde)
      .subscribe((resp: any) => {
        console.log(resp);
        this.totalRegistros = resp.total;
        this.busqueda = true;
        this.categorias = resp.categories;
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
    this.loadCategories();

  }

  searchCategory(termino: string) {

    this.cargando = true;

    if (termino.length <= 0) {
      // this.cargando = false;
      this.busqueda = true;
      this.loadCategories();
      return;
    }

    this._categoriaService.searchCategory(termino)
      .subscribe((categorias: Category[]) => {
        this.cargando = true;
        console.log(categorias);
        this.categorias = categorias;
        this.cargando = true;

        if (this.categorias.length <= 0) {
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


  deleteCategory(categoria: Category) {
      swal({
        title: 'Are you sure?',
        text: 'This action will DELETED the category of the system and all its functions!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, do it!'
      }).then((result) => {
        if (result.value) {
          const idCategory = categoria._id;
          this._categoriaService.deleteCategory(idCategory.toString())
            .subscribe(resp => {
              console.log(resp);
              this.loadCategories();
            });
        }
      })
  }


  activateCategory(categoria: Category) {

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
        this._categoriaService.activateCategory(categoria)
          .subscribe(resp => {
            console.log(resp);
            this.loadCategories();
          });
      }
    })

  }



}
