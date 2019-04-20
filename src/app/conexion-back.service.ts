import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './datos';


@Injectable({
  providedIn: 'root'
})

export class ConexionBackService {
  //aTablas:string[]=[]
  constructor(private http: HttpClient) { }

  getDatos(tableName:any): Observable<any[]>{
    return this.http.get<any[]>('api/datosTable/'+tableName);
  }
  getAtributosTable(tableName:any): Observable<any[]>{
    return this.http.get<any[]>('api/atributosTable/'+tableName);
  }
  getTablas(): Observable<any[]>{
    return this.http.get<any[]>('api/tablas');
  }
  getAllAtributos(): Observable<any[]>{
    return this.http.get<any[]>('api/atributos');
  }

  getConexionResult(datosConexion:any): Observable<any>{
    //console.log(datosConexion);
    return this.http.post<any>('api/conexion',datosConexion);
  }
  getUnionCampos(unionCampos:any): Observable<any>{
    return this.http.post<any[]>('api/unionCampos',unionCampos);
  }

  getLoadResult(nameFile:any): Observable<any>{
    return this.http.get<any>('api/load/'+nameFile);
  }
  /*getCambiarValor(cambio:any): Observable<any>{
    //console.log(datosConexion);
    return this.http.post<any[]>('api/cambiarValor',cambio);
  }*/
  getCambiarValor(cambio:any): Observable<any[]>{
    return this.http.get<any[]>('api/cambiarValor/'+cambio);
  }

}
