import { Component, OnInit } from '@angular/core';
import { ConexionBackService } from '../conexion-back.service';
import { HttpClient } from '@angular/common/http';
import {NgForm} from '@angular/forms';
import { v } from '@angular/core/src/render3';


declare var go:any;
declare var $:any;

@Component({
  selector: 'app-base-datos',
  templateUrl: './base-datos.component.html',
  styleUrls: ['./base-datos.component.css']
})

export class BaseDatosComponent implements OnInit {

  mensajeConexion:string = "Sin Conexion";
  resultConexion2:boolean;
  conexionDatabase:any;
  idModal:string;
  
  

  constructor(private conexionBackService:ConexionBackService, private http:HttpClient) {

   }
   
   openModal():void{
    $('#databaseModal').modal('show');
   }


  getConexionResult2 (datosConexion):void{
    this.conexionBackService.getConexionResult(datosConexion).subscribe(result=> this.ordenarConexion2(result));
  }
  ordenarConexion2(result){
    if(result.isConexion==true){
      this.mensajeConexion="Conectado correctamente";
    }
    else {
      this.mensajeConexion="Error en la conexion";
    }
    this.resultConexion2=result.isConexion;

  }
    tryConexion2(f2: NgForm){
    this.getConexionResult2(f2.value);
    this.conexionDatabase = f2.value;
  }
  ngOnInit() {
    console.log("base datos funcionando");
  }

}
