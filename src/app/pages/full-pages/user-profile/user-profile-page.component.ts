import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/services/service.index';
import { User } from '../../../models/users.model';
import swal from 'sweetalert2';

@Component({
    selector: 'app-user-profile-page',
    templateUrl: './user-profile-page.component.html',
    styleUrls: ['./user-profile-page.component.scss']
})

export class UserProfilePageComponent implements OnInit {

    // Variable Declaration
    currentPage = 'About'
    usuario: User
    imgSubir: File
    imgTemp: any
    imgTemp3: any
    imgTemp4: any
    img = '';
    idUser = '';

    constructor(
        public _userService: UserService
    ) {}

    ngOnInit() {
        this.usuario = this._userService.usuario;
    }

    showPage(page: string) {
        this.currentPage = page;
    }

    guardarPerfil(user: User) {
        console.log(user);

        this.usuario.usr_name = user.usr_name;
        this.usuario.usr_last_name = user.usr_last_name;

        this._userService.updateUser(this.usuario)
                        .subscribe( (resp: any) => {
                            this._userService.changeImgUser( this.imgSubir, this.usuario._id.toString() )
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

        this.imgSubir = archivo;

        const reader = new FileReader();

        const urlImgTemp = reader.readAsDataURL(archivo);

        reader.onloadend = () => {
            this.imgTemp = reader.result;
        }
        // this.imgTemp2 = this.imgTemp;
    }
}
