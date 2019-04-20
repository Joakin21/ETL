import { Injectable } from '@angular/core';
import {OBJETOS} from './listaObjetos';

@Injectable({
  providedIn: 'root'
})
export class ObjetosService {

  objetos = OBJETOS;

  constructor() {}

  obtenerObjetos(){
    return this.objetos;
  }
}
