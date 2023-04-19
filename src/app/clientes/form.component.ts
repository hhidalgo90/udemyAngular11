import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from '../service/cliente.service';
import { Router, ActivatedRoute } from '@angular/router'
import Swal from 'sweetalert2';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  public cliente: Cliente = new Cliente();
  titulo = 'Crear nuevo cliente';
  errores : string[];
  regiones: Region[];

  constructor(private clienteService : ClienteService, private router : Router, private activatedRoute : ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
    this.cargarRegiones();
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

  public cargarRegiones(): void{
    this.clienteService.getRegiones().subscribe(respuesta => this.regiones = respuesta);
  }

  public create() :void {
    console.log("Clicked create");
    console.log(this.cliente);
    this.clienteService.create(this.cliente).subscribe({
      next : resp => {
        console.log(resp);
        this.router.navigate(['/clientes']);
        Swal.fire('Cliente creado', `${resp.nombre} ha sido creado con éxito!`, 'success');//El `` sirve para hacer interpolacion de strings y mandar un parametro en el mensaje
      },
      error: e => {
        this.errores = e.error.errores;
        //Swal.fire('Error al crear cliente', e.error.message, 'error');
      }
    });
  }

  public update(): void {
    this.clienteService.update(this.cliente).subscribe({next : respuesta => {
      this.cliente = respuesta;
      this.router.navigate(['/clientes']);
      Swal.fire('Cliente actualizado', `${respuesta.mensaje} ${respuesta.cliente.nombre} !`, 'success');
    },
    error : (e) => { //capturo error en caso de ser 400 desde el backend
      //this.errores = e.error.errores as string[];
      console.log(e.error);
      this.errores = e.error.errores;
      //Swal.fire('Error al editar cliente', e.error.mensaje, 'error');
    }
  });
  }

  compararRegion(regionDelListado: Region, regionDelCliente: Region) : boolean {
    if(regionDelListado === undefined && regionDelCliente === undefined){
      return true;
    }
    return regionDelListado === null || regionDelCliente === null || regionDelListado === undefined || regionDelCliente === undefined? false: regionDelListado.id===regionDelCliente.id;
  }
}
