import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from '../service/cliente.service';
import { Router, ActivatedRoute } from '@angular/router'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  public cliente: Cliente = new Cliente();
  titulo = 'Crear nuevo cliente';
  errores : string[];

  constructor(private clienteService : ClienteService, private router : Router, private activatedRoute :ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
  }

  public cargarCliente() : void {
    console.log("Cargar cliente");
    this.activatedRoute.params.subscribe(params=>{
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe( resp => this.cliente = resp);
      }
    });
    console.log(this.cliente);
  }

  public create() :void {
    console.log("Clicked create");
    console.log(this.cliente);
  this.clienteService.create(this.cliente).subscribe(resp => {
    console.log(resp);
    this.router.navigate(['/clientes']);
    Swal.fire('Cliente creado', `${resp.nombre} ha sido creado con éxito!`, 'success');//El `` sirve para hacer interpolacion de strings y mandar un parametro en el mensaje
  },
  err => { //capturo error en caso de ser 400 desde el backend
    this.errores = err.error.errores as string[];
  }
  );
  }

  public update(): void {
    this.clienteService.update(this.cliente).subscribe(respuesta => {
      this.cliente = respuesta;
      this.router.navigate(['/clientes']);
      Swal.fire('Cliente actualizado', `${respuesta.mensaje} ${respuesta.cliente.nombre} !`, 'success');
    },
    err => { //capturo error en caso de ser 400 desde el backend
      this.errores = err.error.errors as string[];
    }
    );
  }



}
