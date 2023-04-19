import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
 
  constructor(private authService : AuthService, private router : Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.authService.isAuthenticated()){
        if(this.isTokenExpirado()){//si token expiro cerramos sesion y mandamos al login
          this.authService.cerrarSesion();
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      }
    this.router.navigate(['/login']);
    return false;
  }

  /**
   * Determina si el token esta expirado.
   * @returns true si token expiro
   */
  isTokenExpirado() : boolean {
    let token = this.authService.token;
    let payload = this.authService.obtenerDatosToken(token);
    let now = new Date().getTime() /1000; //fecha convertida en segundos

    if(payload.exp < now){ //si fecha expiracion token es menor que fecha actual es porque token expiro
      return true;
    }
    return false;
  }
  
}
