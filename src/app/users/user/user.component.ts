import { Component, OnInit } from '@angular/core';
import { User } from '../../models/users.model';
import { UserService } from 'app/services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  cargando = false;
  usuario: User = new User('', '', '', '', '', 'ROLE_CONSULT');
  imgSubir: File
  imgTemp: any
  imgTemp3: any
  imgTemp4: any
  img = '';
  idUser = '';
  cambioFoto = false;

  constructor(
    public _usuarioService: UserService,
    public router: Router,
    public activateRoute: ActivatedRoute
  ) {
    activateRoute.params.subscribe( params => {
      this.idUser = params['id'];

      if ( this.idUser !== 'new') {
        this.obtenerUsuario(this.idUser);
      }

    });
   }

  ngOnInit() {
  }

  createUser(f: NgForm ) {
    // console.log(user);

    if (f.invalid ) {
      return;
    }

    this._usuarioService.createUser(this.usuario)
                        .subscribe( (usuario: any) => {
                          this._usuarioService.changeImgOtherUser( this.imgSubir, usuario._id.toString() )
                          this.router.navigate(['/users/user', usuario._id]);
                        });
  }

  updateUser(f: NgForm) {
    if (f.invalid ) {
      return;
    }

    this._usuarioService.updateOtherUser(this.usuario)
                    .subscribe( (resp: any) => {
                        this._usuarioService.changeImgOtherUser( this.imgSubir, this.usuario._id.toString() )
                    });
  }

  obtenerUsuario( id: string) {
    this._usuarioService.getOnUser(id)
                        .subscribe(usuario => {
                          console.log(usuario);
                          this.usuario = usuario;
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
