import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from '../service/cliente.service';
import { Router, ActivatedRoute } from '@angular/router'
import Swal from 'sweetalert2'




@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  idCliente: any;
  paginadorPadre: any;

  constructor(private clienteService: ClienteService, private router : Router, private activatedRoute :ActivatedRoute) { }

  ngOnInit(): void {
  
  this.activatedRoute.paramMap.subscribe(params => { //observador para cada vez que cambie el parametro page entre las paginas
  let nroPagina = +params.get('page');
  if(!nroPagina){
    nroPagina = 0;
  }
  this.clienteService.getClientes(nroPagina).subscribe(result => {
    this.clientes = result.content as Cliente[];
    this.paginadorPadre = result;
  });
  });
  }

  public deleteCliente(clienteAEliminar : Cliente): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: `Estas seguro que deseas eliminar a ${clienteAEliminar.nombre}?`,
      text: "Esta acción no se puede revertir!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, borralo!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(clienteAEliminar.id);
        if(clienteAEliminar.id){
          this.clienteService.delete(clienteAEliminar.id).subscribe(resp => {
            this.clientes = this.clientes.filter(cli => cli != clienteAEliminar);
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              `El usuario ${clienteAEliminar.nombre} ha sido eliminado.`,
              'success'
            )
          });
        }
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          `${clienteAEliminar.nombre} esta feliz de que no lo hayas eliminado :)`,
          'error'
        )
      }
    })
  }

}
