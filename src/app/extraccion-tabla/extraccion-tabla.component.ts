import { Component, OnInit, ɵConsole } from '@angular/core';
import { ConexionBackService } from '../conexion-back.service';
import { HttpClient } from '@angular/common/http';
import {ConexionesBaseDatosService} from '../conexiones-base-datos.service';



declare var $:any;
var myTablasNombres:any;
@Component({
  selector: 'app-extraccion-tabla',
  templateUrl: './extraccion-tabla.component.html',
  styleUrls: ['./extraccion-tabla.component.css']
})
export class ExtraccionTablaComponent implements OnInit {

  conexionDatabase:any;
  indice:number;
  x:string;
  tablas:string;

  constructor(private conexionBackService:ConexionBackService, private http:HttpClient,private conexionesDB:ConexionesBaseDatosService) { }

  openDataExtraccionTablaComponent():void{
    //alert(this.indice)
    this.conexionDatabase = this.conexionesDB.getConexion(this.indice);
    //console.log(this.conexionDatabase);
    this.getTablas(this.conexionDatabase);
    console.log(this.tablas);
    $('#tableModal').modal('show');
    
    
    
  }
  setIndice(ind:number):void{
    this.indice = ind;
  }

  getTablas (database:any):void{
    this.conexionBackService.getTablas(database).subscribe(tablas => {
      if(tablas[0].TABLE_NAME == "clientes"){
        console.log("inside");
        this.tablas ="jaja";
      }
    });
  }
  
  


  ngOnInit() {

  }

}
