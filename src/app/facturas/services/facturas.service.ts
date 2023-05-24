import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Factura } from '../models/factura';
import { Observable} from 'rxjs';
import { Producto } from '../models/producto';
import { URL_BACKEND } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  private urlEndpoint: string = URL_BACKEND + '/apiCliente/facturas';

  constructor(private http: HttpClient) { }

  getFactura(id : number) : Observable<Factura> {
    return this.http.get<Factura>(`${this.urlEndpoint}/${id}`);
  }

  eliminarFactura(id: number): Observable<void>{
    return this.http.delete<void>(`${this.urlEndpoint}/${id}`);
  }

  filtrarProducto(termino : string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.urlEndpoint}/filtrar-productos/${termino}`);
  }

  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.urlEndpoint}/obtener-productos`);
  }

  guardarFactura(factura: Factura): Observable<Factura> {
    return this.http.post<Factura>(this.urlEndpoint, factura);
  }
}
