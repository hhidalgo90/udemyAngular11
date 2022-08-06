import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common'; //Para formatear la fecha
import { CLIENTES } from '../clientes/clientes.json';
import { Cliente } from '../clientes/cliente';
import { of , Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map , catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlBackend : string = 'http://localhost:8080/apiCliente/clientes';

  private headers = new HttpHeaders({
    'Content-Type' : 'application/json'
  });

  constructor(private httpClient : HttpClient, private router : Router) { }

  getClientes(): Observable<Cliente[]> {
    //return of(CLIENTES);
    return this.httpClient.get<Cliente[]>(this.urlBackend).pipe(
      tap(response => { // tap sirve para realizar alguna accion sobre los datos sin modificarlos, importa el orden en el cual se ejecuta
        let clientes = response as Cliente[];
        clientes.forEach(cliente => {
          console.log("Estoy en el tap");          
          console.log(cliente.nombre);
          
        })
      }),
      map(response => {
        let clientes = response as Cliente[];
        return clientes.map(clienteAModificar => {

          clienteAModificar.nombre = clienteAModificar.nombre.toUpperCase();// Le cambiamos el nombre de todos los clientes a mayuscula
          //clienteAModificar.createAt = formatDate(clienteAModificar.createAt as string, 'EEEE dd, MMMM yyyy', 'es');
          return clienteAModificar;
        })
      })
    );
  }

  create(cliente : Cliente) : Observable<Cliente> {
    return this.httpClient.post(this.urlBackend, cliente, {headers : this.headers}).pipe(
      map((respuesta : any) => respuesta.cliente as Cliente),//FORMA 2 DE OBTENER AL CLIENTE, CON MAP CONVERTIMOS MANUALMENTE AL OBJETO CLIENTE
      catchError(e => {

        if(e.status == 400){
          return throwError(e);
        }

        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire('Error al crear cliente', e.error.mensaje, 'error');
        return throwError(e); //retorna un observable del error, para que sea consistente con el metodo
      })
    );
  }

  getCliente(id:any): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.urlBackend}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire('Error al obtener cliente', e.error.mensaje, 'error');
        return throwError(e); //retorna un observable del error, para que sea consistente con el metodo
      })
    );
  }

  update(cliente : Cliente): Observable<any>{
    return this.httpClient.put<any>(`${this.urlBackend}/${cliente.id}`, cliente, {headers: this.headers}).pipe(
      catchError(e => {

        if(e.status == 400){
          return throwError(e);
        }

        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire('Error al editar cliente', e.error.mensaje, 'error');
        return throwError(e); //retorna un observable del error, para que sea consistente con el metodo
      })
    );
  }

  delete(id: any): Observable<any>{
    return this.httpClient.delete(`${this.urlBackend}/${id}`, {headers : this.headers}).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire('Error al eliminar cliente', e.error.mensaje, 'error');
        return throwError(e); //retorna un observable del error, para que sea consistente con el metodo
      })
    );
  }
}
