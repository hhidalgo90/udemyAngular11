import { Component } from '@angular/core';
import { Usuario } from '../usuarios/usuario';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector : 'app-header',
  templateUrl : './header.component.html'
})
export class HeaderComponent {
  titulo : String = "App Angular Spring";
  usuario : Usuario;
  usuarioAutenticado : boolean;

  constructor(public authService : AuthService, private router : Router){}
  
  logout(): void {
    console.log("Cerrar sesion");
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
    Swal.fire('Sesion cerrada', `Cerraste sesion con éxito!`, 'success');
  }
}
