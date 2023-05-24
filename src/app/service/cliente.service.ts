import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common'; //Para formatear la fecha
import { Cliente } from '../clientes/cliente';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map , catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Region } from '../clientes/region';
import { URL_BACKEND } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
 // private urlBackend : string = 'http://localhost:8080/apiCliente/clientes';

 //Url backend heroku
 private urlBackend : string = URL_BACKEND + '/apiCliente/clientes';

  /*SE ELIMINA ESTA IMPLEMENTACION YA QUE SE AGREGA EL TOKEN INTERCEPTOR, QUE GENERA EL HEADERS AUTOMATICAMENTE
  private headers = new HttpHeaders({
    'Content-Type' : 'application/json',
    'Authorization' : 'Bearer ' + this.authService.token
  });*/

  constructor(private httpClient : HttpClient, private router : Router) { }

  getClientes(nroPagina : number): Observable<any> {
    //return of(CLIENTES);
    return this.httpClient.get<Cliente[]>(this.urlBackend + '/page/' + nroPagina).pipe(
      tap((response : any) => { // tap sirve para realizar alguna accion sobre los datos sin modificarlos, importa el orden en el cual se ejecuta
        (response.content as Cliente[]).forEach(cliente => {
          console.log("Estoy en el tap");          
          console.log(cliente.nombre);
        })
      }),
      map((response : any) => {
        (response.content as Cliente[]).map(clienteAModificar => {

          clienteAModificar.nombre = clienteAModificar.nombre.toUpperCase();// Le cambiamos el nombre de todos los clientes a mayuscula
          //clienteAModificar.createAt = formatDate(clienteAModificar.createAt as string, 'EEEE dd, MMMM yyyy', 'es');
          return clienteAModificar;
        });
        return response;
      })
    );
  }

  create(cliente : Cliente) : Observable<Cliente> {
    return this.httpClient.post(this.urlBackend, cliente).pipe(
      map((respuesta : any) => respuesta.cliente as Cliente),//FORMA 2 DE OBTENER AL CLIENTE, CON MAP CONVERTIMOS MANUALMENTE AL OBJETO CLIENTE
      catchError((e : HttpErrorResponse) => {
        if(e.status == 400){
          return throwError(() => new HttpErrorResponse(e));
        } //retorna un observable del error, para que sea consistente con el metodo

        return throwError(() => new HttpErrorResponse(e));
      })
    );
  }

  getCliente(id:any): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.urlBackend}/${id}`).pipe(
      catchError(e => {
        if(e.status != 401 && e.error.mensaje){
          this.router.navigate(['/clientes']);
          console.error(e.error.mensaje);

        }
        return throwError(() => new Error(e)); //retorna un observable del error, para que sea consistente con el metodo
      })
    );
  }

  update(cliente : Cliente): Observable<any>{
    return this.httpClient.put<any>(`${this.urlBackend}/${cliente.id}`, cliente).pipe(
      catchError((e : HttpErrorResponse) => {
        console.error(e.error.errores);
        return throwError(() => new HttpErrorResponse(e));
      })
    );
  }

  delete(id: any): Observable<any>{
    return this.httpClient.delete(`${this.urlBackend}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        return throwError(() => new Error(e)); //retorna un observable del error, para que sea consistente con el metodo
      })
    );
  }

  subirFoto(foto : File, id :any) : Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("imagenUsuario", foto); //mismo nombre que le pusimos en el backend al requestParam
    formData.append("id", id);

    const req = new HttpRequest('POST', `${this.urlBackend}/upload`, formData, {
      reportProgress: true
    });

    console.log('subirFoto');
    console.log(req);
    
    return this.httpClient.request(req);
  }

  obtenerFoto(nombreFoto:any): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.urlBackend}/uploads/img/${nombreFoto}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire('Error al obtener cliente', e.error.mensaje, 'error');
        return throwError(() => new Error(e)); //retorna un observable del error, para que sea consistente con el metodo
      })
    );
  }

  getRegiones(): Observable<Region[]> {
    return this.httpClient.get<Region[]>(`${this.urlBackend}/regiones`);
  }

}
