import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/category.model';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { CategoryService } from 'app/services/service.index';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  cargando = false;
  categoria: Category = new Category('', '', '', '');
  imgSubir: File
  imgTemp: any
  imgTemp3: any
  imgTemp4: any
  img = '';
  idCategory = '';
  cambioFoto = false;

  constructor(
    public _categoryService: CategoryService,
    public router: Router,
    public activateRoute: ActivatedRoute
  ) {
    activateRoute.params.subscribe( params => {
      this.idCategory = params['id'];

      if ( this.idCategory !== 'new') {
        this.obtenerCategoria(this.idCategory);
      }

    });
   }

  ngOnInit() {
  }

  createCategory(f: NgForm ) {
    // console.log(user);

    if (f.invalid ) {
      return;
    }

    // this.categoria.cat_state = this.categoria.cat_state.toString();

    // console.log(f);
    // console.log(this.categoria.cat_state);

    this._categoryService.createCategory(this.categoria)
                        .subscribe( (categoria: any) => {
                          this._categoryService.changeImgCategory( this.imgSubir, categoria._id.toString() )
                          this.router.navigate(['/categories/category', categoria._id]);
                        });
  }

  updateCategory(f: NgForm) {
    if (f.invalid ) {
      return;
    }

    this._categoryService.updateCategory(this.categoria)
                    .subscribe( (resp: any) => {
                        this._categoryService.changeImgCategory( this.imgSubir, this.categoria._id.toString() )
                    });
  }

  obtenerCategoria( id: string) {
    this._categoryService.getCategory(id)
                        .subscribe(categoria => {
                          console.log(categoria);
                          this.categoria = categoria;
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



}
