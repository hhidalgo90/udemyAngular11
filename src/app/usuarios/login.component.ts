import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import Swal from 'sweetalert2';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo : string = "Inicie Sesion"
  usuario: Usuario;

  constructor(private authService : AuthService, private router: Router) {
    this.usuario = new Usuario();
   }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      Swal.fire('Login', `Hola ${this.authService.usuario.username}, ya estas autenticado!`, 'info');
      this.router.navigate(['/clientes']);
    }
  }

  login(): void{
    console.log(this.usuario);
    if(this.usuario.username == null || this.usuario.password == null){
      Swal.fire('Error login', 'Ingrese nombre y password', 'error');
      return;
    }
    this.authService.login(this.usuario).subscribe({ next : resp => {
      console.log(resp);
      this.authService.guardarUsuario(resp.access_token);
      this.authService.guardarToken(resp.access_token);
      
      this.router.navigate(['/clientes']);
      Swal.fire('Login', `Hola ${this.authService.usuario.username}, has iniciado sesion con exito!`, 'success');
    }, error(err) {
      if(err.status == 400){
        Swal.fire('Error login', 'Usuario y/o password incorrectos', 'error');
        return;
      }
    }});
    
  }
}
