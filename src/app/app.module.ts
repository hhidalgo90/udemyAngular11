import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ClienteService } from './service/cliente.service';
import { RouterModule, Routes} from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; //Permite conecciones http
import { FormComponent } from './clientes/form.component';
import { FormsModule } from '@angular/forms';
import { registerLocaleData} from '@angular/common'; //Para formatear la fecha
import  localeES  from '@angular/common/locales/es'; //indidamos que es para espanol, se puede para multiples idiomas y paises(angular i18n) 


registerLocaleData(localeES), 'es';//esto es para internacionalizacion, es decir para convertir fechas o numeros de monedas de ingles a espanol
//RUTAS DE LA APLICACION
const routes : Routes = [
  {path: '', redirectTo: '/clientes' , pathMatch: 'full'},
  {path: 'directivas', component : DirectivaComponent},
  {path: 'clientes', component : ClientesComponent},
  {path: 'clientes/form', component : FormComponent},
  {path: 'clientes/form/:id', component : FormComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [ClienteService, {provide: LOCALE_ID, useValue: 'es' }], //LOCALE_ID para indicar al aplicacion el idioma o localizacion de esta misma
  bootstrap: [AppComponent]
})
export class AppModule { }
