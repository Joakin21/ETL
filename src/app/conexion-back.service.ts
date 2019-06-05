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

  //Para extraccion tabla
  getTablas(): Observable<any[]>{
    return this.http.get<any[]>('api/tablas');
  }
  getDatos(tableName:any): Observable<any[]>{
    return this.http.get<any[]>('api/datosTable/'+tableName);
  }
  getAtributosTable(tableName:any): Observable<any[]>{
    return this.http.get<any[]>('api/atributosTable/'+tableName);
  }
  //----------
  getAllAtributos(): Observable<any[]>{
    return this.http.get<any[]>('api/atributos');
  }
  getAtributos_datatype(): Observable<any[]>{
    return this.http.get<any[]>('api/atributos_datatype');
  }
  getsql_query(datos:any): Observable<any[]>{
    return this.http.post<any>('api/sql_query',datos);
  }
  getConexionResult(datosConexion:any): Observable<any>{
    return this.http.post<any>('api/conexion',datosConexion);
  }
  getLoadResult(nameFile:any): Observable<any>{
    return this.http.get<any>('api/load/'+nameFile);
  }
  

}
