import { Component, OnInit } from '@angular/core';
import { Client } from '../../models/clients.model';
import { ClientService } from 'app/services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'app-clients',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  cargando = false;
  cliente: Client = new Client('', '', '', '', '', '');
  imgSubir: File
  imgTemp: any
  imgTemp3: any
  imgTemp4: any
  img = '';
  idClient = '';
  cambioFoto = false;

  constructor(
    public _clienteService: ClientService,
    public router: Router,
    public activateRoute: ActivatedRoute
  ) {
    activateRoute.params.subscribe( params => {
      this.idClient = params['id'];

      if ( this.idClient !== 'new') {
        this.obtenerCliente(this.idClient);
      }

    });
   }

  ngOnInit() {
  }

  createClient(f: NgForm ) {
    // console.log(user);

    if (f.invalid ) {
      return;
    }

    this._clienteService.createClient(this.cliente)
                        .subscribe( (cliente: any) => {
                          this._clienteService.changeLogoClient( this.imgSubir, cliente._id.toString() )
                          this.router.navigate(['/clients/client', cliente._id]);
                        });
  }

  updateClient(f: NgForm) {
    if (f.invalid ) {
      return;
    }

    this._clienteService.updateClient(this.cliente)
                    .subscribe( (resp: any) => {
                        this._clienteService.changeLogoClient( this.imgSubir, this.cliente._id.toString() )
                    });
  }

  obtenerCliente( id: string) {
    this._clienteService.getClient(id)
                        .subscribe(cliente => {
                          console.log(cliente);
                          this.cliente = cliente;
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
