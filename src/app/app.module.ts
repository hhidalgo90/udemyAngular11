import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ClientesComponent } from './clientes/clientes.component';
import { PaginatorComponent } from './paginator/paginator.component'; 
import { ClienteService } from './service/cliente.service';
import { RouterModule, Routes} from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'; //Permite conecciones http
import { FormComponent } from './clientes/form.component';
import { FormsModule } from '@angular/forms';
import { registerLocaleData} from '@angular/common'; //Para formatear la fecha
import  localeES  from '@angular/common/locales/es';//indidamos que es para espanol, se puede para multiples idiomas y paises(angular i18n) 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { DetalleComponent } from './clientes/detalle/detalle.component';
import { LoginComponent } from './usuarios/login.component'
import { AuthGuard } from './usuarios/guards/auth.guard';
import { RoleGuard } from './usuarios/guards/role.guard';
import { TokenInterceptor } from './usuarios/interceptors/token';
import { AuthInterceptor } from './usuarios/interceptors/auth';
import { DefaultComponent } from './404/default/default.component';
//import { MatFormFieldModule } from '@angular/material/form-field/form-field-module';


registerLocaleData(localeES), 'es';//esto es para internacionalizacion, es decir para convertir fechas o numeros de monedas de ingles a espanol
//RUTAS DE LA APLICACION
const routes : Routes = [
  {path: '', redirectTo: '/clientes' , pathMatch: 'full'},
  {path: 'directivas', component : DirectivaComponent},
  {path: 'clientes', component : ClientesComponent},
  {path: 'clientes/page/:page', component : ClientesComponent}, //ruta para el paginador
  {path: 'clientes/form', component : FormComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'clientes/form/:id', component : FormComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'login', component : LoginComponent},
  {path: '**', component: DefaultComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent,
    LoginComponent,
    DefaultComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatMomentDateModule
  ],
  providers: [ClienteService, 
  {provide: LOCALE_ID, useValue: 'es' },//LOCALE_ID para indicar al aplicacion el idioma o localizacion de esta misma
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }], //Se registra interceptor http
  bootstrap: [AppComponent]
})
export class AppModule { }
