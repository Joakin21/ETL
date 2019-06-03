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


  getTablas(): Observable<any[]>{
    return this.http.get<any[]>('api/tablas');
  }
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
    console.log(datosConexion);
    return this.http.post<any>('api/conexion',datosConexion);
  }
  getLoadResult(nameFile:any): Observable<any>{
    return this.http.get<any>('api/load/'+nameFile);
  }


}
