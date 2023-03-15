import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modal: boolean = false;
  private _notificarSubirFoto = new EventEmitter<any>(); //EventEmitter es para enviar un evento, se agrega _ para identificarlo del metodo get

  constructor() { }

  public get notificarSubirFoto() : EventEmitter<any> {
    return this._notificarSubirFoto;
  }

  abrirModal(){
    this.modal = true;
  }

  cerrarModal(){
    this.modal = false;
  }
}
