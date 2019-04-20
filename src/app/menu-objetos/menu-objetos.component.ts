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

  constructor(private _servicio:ObjetosService) {
    this.objetos = _servicio.obtenerObjetos();
  }

  ngOnInit() {
  }
  //cuando hace clic en un componente enviamos el objeto al componente padre (app.component)
  onSelect(objeto:Objeto){
    this.myOutputValue.emit(objeto);
    //console.log(objeto.nombre);
  }
  //objetos = OBJETOS;

}
