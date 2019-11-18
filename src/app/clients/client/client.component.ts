import { Component, OnInit } from '@angular/core';
import { Client } from '../../models/clients.model';
import { ClientService } from 'app/services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { Category } from 'app/models/category.model';

@Component({
  selector: 'app-clients',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  cargando = false;
  cliente: Client = new Client('', '', '', '', '', '');
  categorias: Category[] = [];
  categorias2 = [];
  catcli = '';
  imgSubir: File
  imgTemp: any
  imgTemp3: any
  imgTemp4: any
  img = '';
  idClient = '';
  cambioFoto = false;

  cities2 = [
    {id: 1, name: 'Vilnius'},
    {id: 2, name: 'Kaunas'},
    {id: 3, name: 'Pavilnys', disabled: true},
    {id: 4, name: 'Pabradė'},
    {id: 5, name: 'Klaipėda'}
];
selectedCityIds: string[];
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
    this.loadCategories();
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
                        this._clienteService.changeLogoClient( this.imgSubir, this.cliente._id.toString() );
                        if ( this.catcli !== '') {
                          // console.log('SI ENTRO AL CATCLI Y SE ENVIARA ESTO: ' + this.cliente._id.toString() + '  ' + this.catcli );
                          this._clienteService.catcliSave( this.cliente._id.toString(), this.catcli)
                            .subscribe((resp2: any) => {
                              console.log('===========> LA RESPUESTA DE CATCLI ES: ' + resp);
                            });
                        }
                        this.loadCategories();
                    });
  }

  obtenerCliente( id: string) {
    this._clienteService.getClient(id)
                        .subscribe(cliente => {
                          // console.log(cliente);
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

loadCategories() {
  this._clienteService.loadCategories()
    .subscribe((resp: any) => {
      console.log(resp);
      this.categorias = resp.categories;
      this.catcli = '';
      this.loadCatCli();
    });
}

loadCatCli() {

  if (!this.cliente._id) {
    return
  }

  this._clienteService.catcliClienteLoad(this.cliente._id.toString())
                      .subscribe((resp: any) => {
                        console.log(resp.catcli);
                        this.categorias2 = resp.catcli;
                        // console.log('Las categorias del cliente son: ' + this.categorias2);
                      });
}

deleteCatcli(id: string) {
  console.log(id);
  swal({
    title: 'Está seguro?',
    text: 'Esta acción eliminará de manera PERMANENTE todas las SUBCATEGORÍAS y PRODUCTOS creados bajo relación Cliente - Categoria!',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, do it!'
  }).then((result) => {
    if (result.value) {
      this._clienteService.deleteCatcli(id)
                          .subscribe( (resp: any) => {
                            console.log(resp);
                            this.categorias2 = []
                            this.loadCategories();
                          });
    }
  })
}


}
