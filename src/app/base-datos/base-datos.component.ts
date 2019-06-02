import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { ConexionBackService } from '../conexion-back.service';
import { HttpClient } from '@angular/common/http';
import {NgForm} from '@angular/forms';
import { v } from '@angular/core/src/render3';
import {ConexionesBaseDatosService} from '../conexiones-base-datos.service';
//ConeccionesBaseDatosService


declare var go:any;
declare var $:any;
//var indice:number
@Component({
  selector: 'app-base-datos',
  templateUrl: './base-datos.component.html',
  styleUrls: ['./base-datos.component.css']
})

export class BaseDatosComponent implements OnInit {
  indice:number=0;
  mensajeConexion:string = "Sin Conexion";
  resultConexion2:boolean;
  conexionDatabase:any;
  //indice:number;
  //Objeto Output para emitir a la consola
  @Output() myOutputValue3 = new EventEmitter();
  
  constructor(private conexionBackService:ConexionBackService, private http:HttpClient,private conexionesDB:ConexionesBaseDatosService) {

   }
  emitToAreaTrabajo(mensaje:string){
    this.myOutputValue3.emit(mensaje);
    //console.log(objeto.nombre);
  }
   
  openDataBaseComponent():void{
    $('#databaseModal2').modal('show');
  }
  setIndice(ind:number){
    this.indice = ind;
  }
  conexionObj = function(conexionDatabase:any, indice:number){
    this.conexionDatabase = conexionDatabase;
    this.indice = indice;
  }
  getConexionResult2 (datosConexion):void{//2.- Devuelve resultado del observable
    this.conexionBackService.getConexionResult(datosConexion).subscribe(result=> this.ordenarConexion2(result));
  }
  
  ordenarConexion2(result):void{//3.- Procesa la conexion
    if(result.isConexion==true){
      this.mensajeConexion="Conectado correctamente";
      
      this.emitToAreaTrabajo("Base de datos "+(this.indice+1)+" conectado a "+this.conexionDatabase.db);
      this.conexionesDB.setConexion(new this.conexionObj(this.conexionDatabase,this.indice++));
    }
    else {
      this.mensajeConexion="Error en la conexion";
      this.emitToAreaTrabajo("Error en la conexion");
    }
    this.resultConexion2=result.isConexion;

  }
    tryConexion2(f2: NgForm){//1.- Trae informacion del formulario del modal
    
    this.getConexionResult2(f2.value);
    this.conexionDatabase = f2.value;

  }
  ngOnInit() {
    console.log("base datos funcionando");
  }

}
