import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule }   from '@angular/forms';
import { AppComponent } from './app.component';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { FooterComponent } from './footer/footer.component';
import { MenuObjetosComponent } from './menu-objetos/menu-objetos.component';
import { AreaTrabajoComponent } from './area-trabajo/area-trabajo.component';

import { ConsolaComponent } from './consola/consola.component';

//Servicios
import {ObjetosService} from './objetos.service';
import { BaseDatosComponent } from './base-datos/base-datos.component';
import { ExtraccionTablaComponent } from './extraccion-tabla/extraccion-tabla.component'


@NgModule({
  declarations: [
    AppComponent,
    CabeceraComponent,
    FooterComponent,
    MenuObjetosComponent,
    AreaTrabajoComponent,
    ConsolaComponent,
    BaseDatosComponent,
    ExtraccionTablaComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [ObjetosService],
  bootstrap: [AppComponent]
})
export class AppModule { }
