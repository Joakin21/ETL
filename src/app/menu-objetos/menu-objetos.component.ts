import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {Objeto} from '../objeto';
//import {OBJETOS} from '../listaObjetos';

import {ObjetosService} from '../objetos.service';

@Component({
  selector: 'app-menu-objetos',
  templateUrl: './menu-objetos.component.html',
  styleUrls: ['./menu-objetos.component.css']
})
export class MenuObjetosComponent implements OnInit {

  @Output() myOutputValue = new EventEmitter();
  objetos: Objeto[] =[];
  indiceBaseDatos: number =0;
  indiceUnirDatos: number =0;
  indiceCargarDatos: number =0;
  indiceExtraccionTabla: number =0;
  constructor(private _servicio:ObjetosService) {
    this.objetos = _servicio.obtenerObjetos();
  }

  ngOnInit() {
  }
  //cuando hace clic en un componente enviamos el objeto al componente padre (app.component)
  onSelect(objeto:Objeto){
    if(objeto.componente=="Base de Datos"){
      objeto.indice = this.indiceBaseDatos;
      this.indiceBaseDatos = this.indiceBaseDatos +1;
    }
    if(objeto.componente=="Unir Datos"){
      objeto.indice = this.indiceUnirDatos;
      this.indiceUnirDatos = this.indiceUnirDatos +1;
    }
    if(objeto.componente=="Cargar Datos"){
      objeto.indice = this.indiceCargarDatos;
      this.indiceCargarDatos = this.indiceCargarDatos +1;
    }
    if(objeto.componente=="Extraccion Tabla"){
      objeto.indice = this.indiceExtraccionTabla;
      this.indiceExtraccionTabla = this.indiceExtraccionTabla +1;

    }
    this.myOutputValue.emit(objeto);
    
    //console.log(objeto.nombre);
  }
  //objetos = OBJETOS;

}
