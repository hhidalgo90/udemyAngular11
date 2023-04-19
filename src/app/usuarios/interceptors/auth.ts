import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()

/**
 * Valida si en la respuesta de una peticion viene un error.
 */
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService, private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {


        return next.handle(req).pipe(
            catchError(e => {
                if (e.status == 401) { //no autenticado o no autorizado
                    if (this.authService.isAuthenticated) { //si token expira cierro sesion
                        this.authService.cerrarSesion();
                    }
                    this.router.navigate(['/login']);
                }
                if (e.status == 403) { //acceso prohibido
                    Swal.fire('Acceso denegado', `Hola ${this.authService.usuario.nombre}, no tienes acceso a este recurso!!`, 'warning');
                    this.router.navigate(['/clientes']);
                }
                return throwError(() => e)
            })
        );
    }
}
