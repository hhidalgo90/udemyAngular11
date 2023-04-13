import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { Usuario } from '../usuarios/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario: Usuario; //empieza con _ para implementar su metodo get
  private _token: string;

  public get usuario() : Usuario {
    if(this._usuario != null) {
      return this._usuario;
    }
    else if(this._usuario == null && sessionStorage.getItem('usuario') != null) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get token() : string {
    if(this._token != null) {
      return this._token;
    }
    else if(this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  constructor(private httpClient : HttpClient) { }

  login(usuario : Usuario): Observable<any>{
    const urlEndpoint = 'http://localhost:8080/oauth/token';
    const credenciales = btoa('angularapp' + ':' + '123456'); //btoa funcion para encriptar en base 64
    
    const httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/x-www-form-urlencoded',
      'Authorization' : 'Basic ' + credenciales
    });

    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);

    return this.httpClient.post(urlEndpoint, params, {headers: httpHeaders});
  }

  guardarToken(access_token: string) {
    let payload = this.obtenerDatosToken(access_token)
    this._usuario = new Usuario();
    this._usuario.nombre = payload.nombre;
    this._usuario.apellido = payload.apellido;
    this._usuario.email = payload.email;
    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }
  guardarUsuario(access_token: string) {
    this._token = access_token;
    sessionStorage.setItem('token', this._token);
  }

  /**
   * Retorna el payload del token, datos del usuario y roles
   * @param access_token 
   * @returns 
   */
  obtenerDatosToken(access_token: string) : any{
    if(access_token != null) {
      return JSON.parse(atob(access_token.split(".")[1]));
    }
    return null;
  }

  /**
   * Verifica si usuario esta autenticado
   * @returns 
   */
  isAuthenticated(): boolean {
    let payload = this.obtenerDatosToken(this.token);//busco en token del metodo getter, sin el _
    if(payload != null && payload.user_name && payload.user_name.length > 0){
      return true;
    }
    return false;
  }

  cerrarSesion() {
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();//limpiamos los datos de la sesion
  }
}
