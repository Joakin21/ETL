import { Component } from '@angular/core';
import {Objeto } from './objeto';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-app';
  show:boolean=true;
  objetoSeleccionado:Objeto={id:0,nombre:"",color:"",img:"", componente:""};//posteriormente lo leera el componente hijo (area-trabajo)
  mensajeToConsole:string;

  enviarObjeto(ev){//cambia el valor por defecto de objetoSeleccionado por el que recibe
    this.objetoSeleccionado=ev;
    //console.log(ev.nombre);
  }
  enviarObjeto2(ev){
    this.mensajeToConsole=ev;
  }

}
