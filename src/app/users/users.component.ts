import { Component, OnInit } from '@angular/core';
import { User } from 'app/models/users.model';
import { UserService } from 'app/services/service.index';
import swal from 'sweetalert2';
import { TITLES } from './users.config';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  usuarios: User[] = [];
  desde = 0;
  totalRegistros = 0;
  cargando = true;
  busqueda = true;
  words: any[];
  noResults = false;

  constructor(
    public _usersService: UserService
  ) { }

  ngOnInit() {
    this.loadUsers();
    this.words = TITLES['0'];
    // console.log('Los Titles: ' + this.words['title1'] );
  }

  loadUsers() {
    this.noResults = false;
    this.cargando = true;
    this._usersService.loadUsers(this.desde)
      .subscribe((resp: any) => {
        console.log(resp);
        this.totalRegistros = resp.total;
        this.busqueda = true;
        this.usuarios = resp.users;
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
    this.loadUsers();

  }

  searchUser(termino: string) {

    this.cargando = true;

    if (termino.length <= 0) {
      // this.cargando = false;
      this.busqueda = true;
      this.loadUsers();
      return;
    }

    this._usersService.searchUser(termino)
      .subscribe((usuarios: User[]) => {
        this.cargando = true;
        console.log(usuarios);
        this.usuarios = usuarios;
        this.cargando = true;

        if (this.usuarios.length <= 0) {
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


  deleteUser(usuario: User) {

    if (usuario._id === this._usersService.usuario._id) {
      swal({
        type: 'error',
        title: 'FORBIDDEN!',
        html: 'YOU CAN\'T DELETE YOUR OWN USER',
      });
      return;

    } else {
      swal({
        title: 'Are you sure?',
        text: 'This action will disable the user of the system and all its functions!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, do it!'
      }).then((result) => {
        if (result.value) {
          const idUser = usuario._id;
          this._usersService.deleteUser(idUser.toString())
            .subscribe(resp => {
              console.log(resp);
              this.loadUsers();
            });
        }
      })
    }
  }


  activateUser(usuario: User) {

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
        this._usersService.activateUser(usuario)
          .subscribe(resp => {
            console.log(resp);
            this.loadUsers();
          });
      }
    })

  }

}
