import { Component, OnInit } from '@angular/core';
import { Subcategory } from '../../models/subcategory.model';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { SubcategoryService } from 'app/services/service.index';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss']
})
export class SubcategoryComponent implements OnInit {

  cargando = false;
  subcategoria: Subcategory = new Subcategory('', '', '', '');
  imgSubir: File
  imgTemp: any
  imgTemp3: any
  imgTemp4: any
  img = '';
  idSubcategory = '';
  cambioFoto = false;

  constructor(
    public _subcategoryService: SubcategoryService,
    public router: Router,
    public activateRoute: ActivatedRoute
  ) {
    activateRoute.params.subscribe( params => {
      this.idSubcategory = params['id'];

      if ( this.idSubcategory !== 'new') {
        this.obtenerCategoria(this.idSubcategory);
      }

    });
   }

  ngOnInit() {
  }

  createSubcategory(f: NgForm ) {
    // console.log(user);

    if (f.invalid ) {
      return;
    }

    // this.subcategoria.cat_state = this.subcategoria.cat_state.toString();

    // console.log(f);
    // console.log(this.subcategoria.cat_state);

    this._subcategoryService.createSubcategory(this.subcategoria)
                        .subscribe( (subcategoria: any) => {
                          this._subcategoryService.changeImgSubcategory( this.imgSubir, subcategoria._id.toString() )
                          this.router.navigate(['/subcategories/subcategory', subcategoria._id]);
                        });
  }

  updateSubcategory(f: NgForm) {
    if (f.invalid ) {
      return;
    }

    this._subcategoryService.updateSubcategory(this.subcategoria)
                    .subscribe( (resp: any) => {
                        this._subcategoryService.changeImgSubcategory( this.imgSubir, this.subcategoria._id.toString() )
                    });
  }

  obtenerCategoria( id: string) {
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



}
