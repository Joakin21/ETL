import { Component, Input,Output,EventEmitter,ViewChild,AfterViewInit,OnInit} from '@angular/core';
import { ConexionBackService } from '../conexion-back.service';
import { HttpClient } from '@angular/common/http';
import { Objeto } from '../objeto';
import {NgForm} from '@angular/forms';
import {BaseDatosComponent} from '../base-datos/base-datos.component';
import { from } from 'rxjs';

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
  bases_de_datos:any[];
  @ViewChild('myDiagramDiv') div;

  //Objeto Output para emitir a la consola
  @Output() myOutputValue2 = new EventEmitter();

  //COMPONENTE 1: EXTRACCION DE TABLA ESPECIFICA DE UNA BASE DE DATOS - Variables

  //END Variables componente 1

  //COMPONENTE 2: conectar solo base de datos - Variables
  mensajeConexion:string = "Sin Conexion";
  resultConexion2:boolean;
  conexionDatabase:any;
  tablas2:any[];
  allAtributos2:any[];
  array_atributos2:any[];
  aIdAtributos2:number[];

  
  
  //END variables componente 2

  //COMPONENTE 3: Unir datos - Variables
  unionCampos3:any={campos:"",tablas:""};
  camposUnidos3:any[];
  atributos3:string[];
  isUnion3:boolean=false;
  //END cariables componente 2

  //COMPONENTE 4: Cargar Datos - Variables
  resultLoad3:boolean;

  conex:any;
  http_client:any;
  constructor(private conexionBackService:ConexionBackService, private http:HttpClient) {
    this.conex =  conexionBackService;
    this.http_client = http;
   }

  ngOnInit() {

  }
  //Emitir mensajes a la consola
  emitToConsole(mensaje:string){
    this.myOutputValue2.emit(mensaje);
    //console.log(objeto.nombre);
  }
  //COMPONENTE 1: EXTRACCION DE TABLA ESPECIFICA DE UNA BASE DE DATOS - funciones y servicios
  //Tabla seleccionada desde el modal

  //servicios



  getLoadResult (nameFile):void{
    this.conexionBackService.getLoadResult(nameFile).subscribe(resp =>(
      this.resultLoad3 = resp.resultLoad
      //console.log(resp.resultLoad)
    ));
  }


  getUnionCampos (unionCampos):void{//le digo uneme estos campos
    this.conexionBackService.getUnionCampos(unionCampos).subscribe(myTabla=> (this.camposUnidos3=myTabla));
  }


  //END COMPONENTE 1 -----------------------------------------------------------

  //COMPONENTE 2: conectar solo base de datos
  getConexionResult2 (datosConexion):void{
    this.conexionBackService.getConexionResult(datosConexion).subscribe(result=> this.ordenarConexion2(result));
  }
  //Verifica si la conexion es correcta
  ordenarConexion2(result){
    if(result.isConexion==true){
      this.getTablas2();//Segun la cantidad de tablas obtiene sus atributos
      this.getAllAtributos2();
      //this.getAtributosTable2()

      this.mensajeConexion="Conectado correctamente";
      this.emitToConsole("Conectado correctamente")

    }
    else {
      this.mensajeConexion="Error en la conexion";
      this.emitToConsole("Error en la conexion")
    }
    this.resultConexion2=result.isConexion;
    console.log("conexion a la base de datos: "+this.resultConexion2);


  }
  //le pregunta al servidor si la conexion es correcta
  tryConexion2(f2: NgForm){
    this.getConexionResult2(f2.value);
    this.conexionDatabase = f2.value;
  }
  getTablas2 ():void{
    this.conexionBackService.getTablas().subscribe(tablas =>(this.tablas2 = tablas));
  }
  getAllAtributos2():void{
    this.conexionBackService.getAllAtributos().subscribe(atributo => this.after_getAllAtributos2(atributo));
  }
  after_getAllAtributos2(atributo):void{
    this.allAtributos2=atributo;
    var a = [];
    for (var i=0;i<atributo.length;i++){
      a.push(i);
    }
    this.aIdAtributos2 = a;
    console.log(this.aIdAtributos2);
    //this.aIdAtributos2
  }


  //END COMPONENTE 2 -----------------------------------------------------------

  //COMPONENTE 3: unir campos de los datos que tenga en su entrada
  camposSelected(f3: NgForm){
    //limpio los valores
    this.atributos3 = [];
    this.unionCampos3.campos ="";
    this.unionCampos3.tablas="";
    this.isUnion3=false;
    this.resultLoad3=false;
    var atribs = [];
    for (var i=0;i<this.aIdAtributos2.length;i++){
      if(f3.value["atri"+i]==true){
        console.log(this.allAtributos2[i]);
        this.unionCampos3.campos = this.unionCampos3.campos+this.allAtributos2[i].COLUMN_NAME+',';
        this.unionCampos3.tablas = this.unionCampos3.tablas+this.allAtributos2[i].TABLE_NAME+',';
        //array de nombre de atributos que selecciono el usuario para mostrar en la tabla
        atribs.push(this.allAtributos2[i].COLUMN_NAME);
        this.isUnion3 = true;
      }
      //console.log(f3.value["atri"+i]);
    }
    this.atributos3 = atribs;

    console.log(this.atributos3);

    if(  this.unionCampos3.campos!="" && this.unionCampos3.tablas!=""){//Si selecciono algunos campos
      this.unionCampos3.campos = this.unionCampos3.campos.slice(0,-1);//quito la ultima coma
      this.unionCampos3.tablas = this.unionCampos3.tablas.slice(0,-1);//quito la ultima coma
      this.getUnionCampos(this.unionCampos3);



    }
  }
  loadToDatabase3():void{
    //Si lo que esta unido a mi es el de union then le digo q carge el del archivo union
    this.getLoadResult("union_tabla");
    //Si lo que esta unido a mi es uno de otra cosa le digo que carge el del archivo de 'otra cosa'

  }

  //END COMPONENTE 3



  //Control de ventanas (modales) y union de componentes
  openModal(e):void{
    var part = e.subject.part;
  
    if(part.data.componente == "Base de Datos") {
      
      $('#databaseModal').modal('show');
    
    }

    if(part.data.componente == "Unir Datos") {

      if(this.resultConexion2){//Si la conexion a la base de datos es correcta
        var dataBase_unionDatos=false;
        for(var nodo=0;nodo<this.myDiagram.model.linkDataArray.length;nodo++){
          //Si esta unida base de datos con union datos
          if(this.myDiagram.model.linkDataArray[nodo]["from"] ==1 && this.myDiagram.model.linkDataArray[nodo]["to"]==4)
          dataBase_unionDatos=true;
        }
        if(dataBase_unionDatos){
          this.emitToConsole("Base de Datos y Unir Datos conectados correctamente");
          $('#unionModal').modal('show');
        }

        //console.log("Unir Datos no esta unido a ningun componente");

      }else this.emitToConsole("Error en los datos que se conectan al componente: Unir Datos ")
      //console.log("Error en los datos que se conectan al componente: Unir Datos ");
      //SI esta unida a database component2:
      //Sino Mostrar mensaje de que no esta unida o los datos del componente database estan erroneos
    }

    if(part.data.componente == "Cargar Datos"){//Si quiere abrir el componente 'Cargar Datos'

      if(this.unionCampos3.campos!="" && this.unionCampos3.tablas!="")//y unida 'Cargar Datos' unido a 'Unir Datos'
      {
        var unionDatos_cargarDatos=false;
        for(var nodo=0;nodo<this.myDiagram.model.linkDataArray.length;nodo++){
          //Si esta unida base de datos con union datos
          if(this.myDiagram.model.linkDataArray[nodo]["from"] ==4 && this.myDiagram.model.linkDataArray[nodo]["to"]==6)
          unionDatos_cargarDatos=true;
        }
        if(unionDatos_cargarDatos){
          this.emitToConsole("Cargar Datos y Unir Datos conectados correctamente");
          $('#cargarDatosModal').modal('show');
        }
        else   this.emitToConsole("Cargar Datos no esta unido a ningun componente");
        //console.log("Cargar Datos no esta unido a ningun componente");

      }
      else{
        //Mostrar este mensaje en la consola incorporada
        this.emitToConsole("Cargar Datos no esta unido a ningun componente");
      }

    }

  }
  CambiaNombre(e):void{
    var part=e.subject.part;
    var text=e.subject.text;
    var nodo=this.myDiagram.model.findNodeDataForKey(part.data.key);
    this.myDiagram.model.set(nodo, "nombre", text);

  }


  ngAfterViewInit(){
    let base_datos = new BaseDatosComponent(this.conex,this.http_client);
    let base_datos2 = new BaseDatosComponent(this.conex,this.http_client);
    
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

  }
  
  @Input() //Entrada de nuevos componentes
  //Cuando llega un nuevo componente se agrega al diagrama
  set objetoRecibido(objetoSeleccionado:Objeto){
    let bases_de_datos_temp=[];
    console.log(objetoSeleccionado.id);
    if(this.myDiagram != undefined){//Si el diagrama esta cargado
      //let bases_de_datos_temp = []
      this.emitToConsole("Objeto agregado: "+objetoSeleccionado.nombre);
      this.myDiagram.model.addNodeData({ key: objetoSeleccionado.id,nombre:objetoSeleccionado.nombre,img:objetoSeleccionado.img,componente:objetoSeleccionado.componente});//add nuevo nodo al modelo
      if(objetoSeleccionado.id == 1){//agrego base de datos component
        let base_datos = new BaseDatosComponent(this.conex,this.http_client);
        //base_datos.openModal();
        console.log(':O');
        bases_de_datos_temp.push(base_datos);
        bases_de_datos_temp[0].openModal();
     
      }
      
    }
  }

}
