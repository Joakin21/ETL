import { Component, Input,Output,EventEmitter,ViewChild,AfterViewInit,OnInit} from '@angular/core';
import { ConexionBackService } from '../conexion-back.service';
import { HttpClient } from '@angular/common/http';
import { Objeto } from '../objeto';
import {NgForm} from '@angular/forms';
import {BaseDatosComponent} from '../base-datos/base-datos.component';
import {ExtraccionTablaComponent} from '../extraccion-tabla/extraccion-tabla.component';
import { from } from 'rxjs';
import {ConexionesBaseDatosService} from '../conexiones-base-datos.service';


declare var go:any;
declare var $:any;

@Component({
  selector: 'app-area-trabajo',
  templateUrl: './area-trabajo.component.html',
  styleUrls: ['./area-trabajo.component.css']
})
export class AreaTrabajoComponent implements AfterViewInit,OnInit {
  myDiagram:any;
  //nueva version

  @ViewChild('myDiagramDiv') div;

  //Objeto Output para emitir a la consola
  @Output() myOutputValue2 = new EventEmitter();

 


  constructor(private conexionBackService:ConexionBackService, private http:HttpClient,private conexionesDB:ConexionesBaseDatosService) {
  
   }

  ngOnInit() {
    
  }
  //Emitir mensajes a la consola
  emitToConsole(mensaje:string){
    this.myOutputValue2.emit(mensaje);
    //console.log(objeto.nombre);
  }

  CambiaNombre(e):void{
    var part=e.subject.part;
    var text=e.subject.text;
    var nodo=this.myDiagram.model.findNodeDataForKey(part.data.key);
    this.myDiagram.model.set(nodo, "nombre", text);

  }
  openModal(e):void{
    var part = e.subject.part;
    var componente = part.data.componente;
    var indice = part.data.indice;
    if (componente=="Base de Datos"){
      console.log(indice)
      this.bases_de_datos_temp[indice].openDataBaseComponent();
    }
    if (componente=="Extraccion Tabla"){
      this.extraccion_de_tablas[indice].openDataExtraccionTablaComponent();
      //this.extraccion_de_tablas[indice].showIndice();
      //console.log(this.conexionesDB.getConexion());
    }
    
  }
  mensajeDesdeBaseDatos(ev){
    this.emitToConsole(ev);
  }
  unionObj = function(comp1:number, comp2:number){
    this.comp1 = comp1;
    this.comp2 = comp2;
  }
  unionesComponentes(e):void{
    var conectados = this.myDiagram.model.linkDataArray
    var ultimo = conectados.length-1
    var componentes_en_area = e.ca.Ae.Be
    var conexion_actual = conectados[ultimo]
    var A = conexion_actual.from
    var B = conexion_actual.to
    var comp1, comp2
    for(let comp in componentes_en_area){
      if(componentes_en_area[comp].key == A){
        comp1 = componentes_en_area[comp]
      }
      if(componentes_en_area[comp].key == B){
        comp2 = componentes_en_area[comp]
      } 
    }
    if((comp1.componente == "Base de Datos" && comp2.componente == "Extraccion Tabla") || (comp1.componente == "Extraccion Tabla" && comp2.componente == "Base de Datos")){
      //alert("conectado "+comp1.nombre+" con "+comp2.nombre)
      this.conexionesDB.addUnion(new this.unionObj(comp1.indice,comp2.indice));
      this.emitToConsole(comp1.nombre+" unida a "+comp2.nombre);
      console.log(this.conexionesDB.getUnionComponentes());
    }
  }


  ngAfterViewInit(){
    
      /*this.baseDatos = new BaseDatosComponent(this.conex,this.http_client);
      //this.baseDatos.openDataBaseComponent();
      this.bases_de_datos_temp.push(this.baseDatos);
      this.bases_de_datos_temp[0].openDataBaseComponent();*/
      //this.bases_de_datos_temp[0].openDataBaseComponent();
    
    // create a make type from go namespace and assign it to MAKE
        const diagramDiv = this.div.nativeElement;
        var $ = go.GraphObject.make;
        
        
        this.myDiagram =
        $(go.Diagram, diagramDiv,
          {
            "undoManager.isEnabled": true // enable Ctrl-Z to undo and Ctrl-Y to redo
          });
          this.myDiagram.nodeTemplate =
            $(go.Node, "Auto",
              $(go.Shape, "RoundedRectangle", { fill: "white" }),
              $(go.Panel, "Table",
                $(go.RowColumnDefinition,
                  { column: 0, alignment: go.Spot.Left}),

                $(go.RowColumnDefinition,
                  { column: 2, alignment: go.Spot.Right }),
                  $(go.Picture,
                    { column: 0, row: 4, columnSpan: 1, alignment: go.Spot.Center,
                       maxSize: new go.Size(60, 60),margin: new go.Margin(10,0,0,15) },
                    new go.Binding("source", "img")),
                $(go.TextBlock,  // the node title
                  { column: 0, row: 0, columnSpan: 1, alignment: go.Spot.Center,
                    font: "bold 10pt sans-serif", margin: new go.Margin(3,0,0,15),editable:true },
                  new go.Binding("text", "nombre")),
                $(go.Panel, "Horizontal",
                  { column: 0, row: 5 },
                  $(go.Shape,  // the "A" port
                    { width: 8, height: 8, portId: "A", toSpot: go.Spot.Left,
                      toLinkable: true, toMaxLinks: 1 }),  // allow user-drawn links from here
                  $(go.TextBlock, "A")  // "A" port label
                ),
                $(go.Panel, "Horizontal",
                  { column: 0, row: 10 },
                  $(go.Shape,  // the "B" port
                    { width: 8, height: 8, portId: "B", toSpot: go.Spot.Left,
                      toLinkable: true, toMaxLinks: 1 }),  // allow user-drawn links from here
                  $(go.TextBlock, "B")  // "B" port label
                ),
                $(go.Panel, "Horizontal",
                  { column: 2, row: 5, rowSpan: 2 },
                  $(go.TextBlock, "Out"),  // "Out" port label
                  $(go.Shape,  // the "Out" port
                    { width: 8, height: 8, portId: "Out", fromSpot: go.Spot.Right,
                      fromLinkable: true })  // allow user-drawn links to here
                )
              )
            );


        var myModel = $(go.Model);
        // in the model data, each node is represented by a JavaScript object:
        this.myDiagram.linkTemplate =
          $(go.Link,
            { routing: go.Link.Orthogonal, corner: 3 },
            $(go.Shape),
            $(go.Shape, { toArrow: "Standard" })
          );

        myModel.nodeDataArray = [

        ];


        this.myDiagram.model =
          $(go.GraphLinksModel,
            { linkFromPortIdProperty: "fromPort",  // required information:
              linkToPortIdProperty: "toPort",      // identifies data property names
              nodeDataArray: myModel.nodeDataArray,
              linkDataArray: [
                // no predeclared links
              ] });
        
        this.myDiagram.addDiagramListener("ObjectDoubleClicked",e => this.openModal(e));
        this.myDiagram.addDiagramListener("TextEdited",e => this.CambiaNombre(e));
        this.myDiagram.addDiagramListener("LinkDrawn",e => this.unionesComponentes(e));

  }

  bases_de_datos_temp:BaseDatosComponent[]=[];
  baseDatos:BaseDatosComponent;
  extraccion_de_tablas:ExtraccionTablaComponent[]=[];
  extTabla:ExtraccionTablaComponent;
  key:number=1;

  @Input() //Entrada de nuevos componentes
  //Cuando llega un nuevo componente se agrega al diagrama
  set objetoRecibido(objetoSeleccionado:Objeto){
    
    if(this.myDiagram != undefined){//Si el diagrama esta cargado
      //let bases_de_datos_temp = []
      this.emitToConsole("Objeto agregado: "+objetoSeleccionado.nombre+" "+(objetoSeleccionado.indice+1));
      //agrego base de datos component
      this.myDiagram.model.addNodeData({ key:this.key++,nombre:objetoSeleccionado.nombre+" "+(objetoSeleccionado.indice + 1),img:objetoSeleccionado.img,componente:objetoSeleccionado.componente,indice:objetoSeleccionado.indice});//add nuevo nodo al modelo
      if(objetoSeleccionado.componente=="Base de Datos"){//Si selecciono un componente DB     
        this.baseDatos = new BaseDatosComponent(this.conexionBackService, this.http, this.conexionesDB);
        this.baseDatos.setIndice(objetoSeleccionado.indice);
        this.bases_de_datos_temp.push(this.baseDatos);
      }  
      if(objetoSeleccionado.componente=="Extraccion Tabla"){     
        this.extTabla = new ExtraccionTablaComponent(this.conexionBackService,this.http, this.conexionesDB);
        this.extTabla.setIndice(objetoSeleccionado.indice);
        this.extraccion_de_tablas.push(this.extTabla);
      } 
        //console.log(this.bases_de_datos_temp);
        //this.baseDatos.openDataBaseComponent();
      
      
    }


  }

}
