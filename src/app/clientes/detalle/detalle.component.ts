import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { ClienteService } from 'src/app/service/cliente.service';
import { Cliente } from '../cliente';
import Swal from 'sweetalert2';
import { ModalService } from './modal.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente : Cliente; // Input es para poder recibir como parametro el objeto cliente inyectado desde clientes.component.html
  titulo : String = "Detalle del Cliente";
  imagenSeleccionada : File;
  progreso: number = 0;

  //Con ActivatedRoute recibo el parametro enviado por el RouterLink en la vista
  constructor(private clienteService : ClienteService, public modalService : ModalService) { }

  ngOnInit(): void {

  }

  seleccionarFoto(event) {
    this.imagenSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.imagenSeleccionada);
    if(this.imagenSeleccionada.type.indexOf('image') < 0){ // valido que sea imagen
      Swal.fire('Error', 'El archivo debe ser del tipo imagen!', 'error');
      this.imagenSeleccionada = null;
    }
  }

  subirFoto(){
    if(!this.imagenSeleccionada){
      Swal.fire('Error', 'Debe seleccionar una foto!', 'error');
    }
    else {
      this.clienteService.subirFoto(this.imagenSeleccionada, this.cliente.id).subscribe(event => {
        if(event.type === HttpEventType.UploadProgress){ // === valida tipo y valor, validacion absoluta
          this.progreso = Math.round(100 * event.loaded / event.total);
        }
        else if(event.type === HttpEventType.Response) { // cuando ya se cargo la imagen
          let respuesta: any = event.body;
          this.cliente = respuesta.cliente as Cliente;
          console.log("Subir foto");
          console.log(this.cliente);
          this.modalService.notificarSubirFoto.emit(this.cliente);
          Swal.fire('Imagen cargada con exito', respuesta.mensaje, 'success');
        }
      
    });
    }
    
  }

  cerrarModal(){
    console.log("Cerrar modal");
    this.modalService.cerrarModal();
    this.imagenSeleccionada = null;
    this.progreso = 0;
  }

}
