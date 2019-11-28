import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/category.model';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { CategoryService, DownloadfileService } from 'app/services/service.index';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  cargando = false;
  categoria: Category = new Category('', '', '', '', 'true');
  imgSubir: File
  imgTemp: any

  fileSubir: File;
  fileSubir2: any;
  fileSubirName: string;
  fileDescargarName = '';

  img = '';
  idCategory = '';
  cambioFoto = false;

  constructor(
    public _categoryService: CategoryService,
    public _downloadService: DownloadfileService,
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


    this._categoryService.createCategory(this.categoria)
                        .subscribe( (categoria: any) => {
                          if (this.fileSubir2) {
                            this._categoryService.uploadFile( this.fileSubir, categoria._id.toString() )
                                              .then( (resp2: any) => {
                                                this.obtenerCategoria(categoria._id.toString())
                                              })
                                              .catch( resp2 => {
                                                console.log(resp2);
                                              });
                          }

                          if (this.imgTemp) {
                            this._categoryService.changeImgCategory( this.imgSubir, categoria._id.toString() )
                                                  .then( (resp2: any) => {
                                                    this.obtenerCategoria(categoria._id.toString())
                                                  })
                                                  .catch( resp2 => {
                                                    console.log(resp2);
                                                  });
                          }

                          swal({
                            title: 'Loading...',
                            html: '<div class="spinner-grow text-primary" role="status"><span class="sr-only">Loading...</span></div>',
                            timer: 3000,
                            showConfirmButton: false
                          })

                          this.router.navigate(['/categories/category', categoria._id]);
                        });
  }

  updateCategory(f: NgForm) {
    if (f.invalid ) {
      return;
    }


    swal({
      title: 'Loading...',
      html: '<div class="spinner-grow text-primary" role="status"><span class="sr-only">Loading...</span></div>',
      timer: 3000,
      showConfirmButton: false
    })

    if (this.fileSubir2) {
      this._categoryService.uploadFile( this.fileSubir, this.categoria._id.toString() )
                        .then( (resp2: any) => {
                          this.obtenerCategoria(this.categoria._id.toString())
                        })
                        .catch( resp2 => {
                          console.log(resp2);
                        });
    }

    if (this.imgTemp) {
      this._categoryService.changeImgCategory( this.imgSubir, this.categoria._id.toString() )
                            .then( (resp2: any) => {
                              if (!resp2) {
                                this.router.navigate(['/categories']);
                              } else {
                                this.obtenerCategoria(this.categoria._id.toString())
                              }
                            })
                            .catch( resp2 => {
                              console.log(resp2);
                            });
    }

    this._categoryService.updateCategory(this.categoria)
                      .subscribe( (resp: any) => {
                          this.categoria = resp.categoria;
                          this.router.navigate(['/categories/category', this.categoria._id]);
                        });
  }

  obtenerCategoria( id: string) {
    this._categoryService.getCategory(id)
                        .subscribe(categoria => {
                          console.log(categoria);
                          this.categoria = categoria;
                          this.fileSubir2 = null;
                          this.fileDescargarName = '';
                          this.fileDescargarName = categoria.cat_file;
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
          html: 'Solo están permitidos archivos de extención .zip.'
      });
      this.fileSubir = null;
      return;
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
      text: 'Not ID category'
    });
  }

  swal({
    title: 'Are you sure?',
    text: 'This action will DELETED the files ZIP of the category!',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, do it!'
  }).then((result) => {
    if (result.value) {
      this._categoryService.deleteFile(id)
                      .subscribe( (resp: any) => {
                        console.log('La categoria: ' + resp.categoria);
                        console.log(resp.categoria);
                        this.obtenerCategoria(id);
                      });
    }
  })


}

downloadFile(file: string) {
  console.log(file);
  this._downloadService.download(file, 'categories')
  .subscribe(
      data => saveAs(data, file),
      // data => console.log(data, nombreArchivo),
      error => console.error(error)
  );
}



}
