import { Injectable } from '@angular/core';
var conexiones = []
var unionComponentes = []
@Injectable({
  providedIn: 'root'
})
export class ConexionesBaseDatosService {
  constructor() { }
  
  setConexion(conexion:any):void{
    conexiones.push(conexion);
  }
  addUnion(union:any):void{
    unionComponentes.push(union);
  }
  getUnionComponentes():any{
    return unionComponentes;
  }
  getConexion(indice:number):any{
    var conexion
    for(var i in unionComponentes){//0-DB | 1-TB
      //console.log(unionComponentes[i].comp1)
      if(unionComponentes[i].comp2==indice){
        
        conexion = this.myConexion(unionComponentes[i].comp1)
      }
    }
    return conexion;
  }
  myConexion(indiceDBComponent:number):number{
    var conexion
    for(var i in conexiones){
      if(conexiones[i].indice == indiceDBComponent){
        conexion = conexiones[i].conexionDatabase
      }
    }
    return conexion
  }
  todasConexiones():any{
    return conexiones
  }
  
}
