import { Component, OnInit } from '@angular/core';
import { Client } from '../models/clients.model';
import { ClientService } from 'app/services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { TITLES } from './client.config';



@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  clientes: Client[] = [];
  desde = 0;
  totalRegistros = 0;
  cargando = true;
  busqueda = true;
  words: any[];
  noResults = false;

  constructor(
    public _clienteService: ClientService
  ) {}

  ngOnInit() {
    this.loadClients();
    this.words = TITLES['0'];
  }

  loadClients() {
    this.noResults = false;
    this.cargando = true;
    this._clienteService.loadClients(this.desde)
      .subscribe((resp: any) => {
        console.log(resp);
        this.totalRegistros = resp.total;
        this.busqueda = true;
        this.clientes = resp.clients;
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
    this.loadClients();

  }

  searchClient(termino: string) {

    this.cargando = true;

    if (termino.length <= 0) {
      // this.cargando = false;
      this.busqueda = true;
      this.loadClients();
      return;
    }

    this._clienteService.searchClient(termino)
      .subscribe((clientes: Client[]) => {
        this.cargando = true;
        console.log(clientes);
        this.clientes = clientes;
        this.cargando = true;

        if (this.clientes.length <= 0) {
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


  deleteClient(cliente: Client) {
      swal({
        title: 'Are you sure?',
        text: 'This action will DELETED the client of the system and all its functions!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, do it!'
      }).then((result) => {
        if (result.value) {
          const idClient = cliente._id;
          this._clienteService.deleteClient(idClient.toString())
            .subscribe(resp => {
              console.log(resp);
              this.loadClients();
            });
        }
      })
  }


  activateClient(cliente: Client) {

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
        this._clienteService.activateClient(cliente)
          .subscribe(resp => {
            console.log(resp);
            this.loadClients();
          });
      }
    })

  }


}
