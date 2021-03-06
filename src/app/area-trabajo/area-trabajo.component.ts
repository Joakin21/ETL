import { Component, Input,Output,EventEmitter,ViewChild,AfterViewInit,OnInit} from '@angular/core';
import { ConexionBackService } from '../conexion-back.service';
import { HttpClient } from '@angular/common/http';
import { Objeto } from '../objeto';
import {NgForm} from '@angular/forms';
//import { runInThisContext } from 'vm';

declare var go:any;
declare var $:any;
@Component({
  selector: 'app-area-trabajo',
  templateUrl: './area-trabajo.component.html',
  styleUrls: ['./area-trabajo.component.css']
})
export class AreaTrabajoComponent implements AfterViewInit,OnInit {
  myDiagram:any;
  @ViewChild('myDiagramDiv') div;

  //Objeto Output para emitir a la consola
  @Output() myOutputValue2 = new EventEmitter();
  objectKeys = Object.keys;

  //COMPONENTE 1: EXTRACCION DE TABLA ESPECIFICA DE UNA BASE DE DATOS - Variables
  tablaElejida:string="";
  datosTablaElegida:any[] =[];
  tablas:any[];
  atributo:any[];
  //END Variables componente 1

  //COMPONENTE 2: conectar solo base de datos - Variables
  mensajeConexion:string = "Sin Conexion";
  resultConexion2:boolean;
  conexionDatabase:any;
  
  allAtributos2:any[];
  array_atributos2:any[];
  aIdAtributos2:number[];
  //END variables componente 2


  //END cariables componente 2

  //COMPONENTE 4: Cargar Datos - Variables
  resultLoad3:boolean;

  //COMPONENTE 5: CALCULADORA
  respaldoDatosCalculadoraSQL:any[]
  respaldoDatosCalculadoraTabla:any[]
  
  constructor(private conexionBackService:ConexionBackService, private http:HttpClient) { }

  ngOnInit() { }

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
  //COMPONENTE 1: Extraer tabla
  tablaElegida(tab):void{
    this.getDatos(tab.TABLE_NAME);//pasa los datos a un arreglo
    this.getAtributosTable(tab.TABLE_NAME);
    var tabla = tab.TABLE_NAME;
    this.tablaElejida=tabla;
}
getDatos (tableName):void{
  this.conexionBackService.getDatos(tableName).subscribe(tasks =>(
    this.datosTablaElegida=tasks,
    //Respaldo ---------------------------
    this.respaldoDatosCalculadoraTabla = tasks
    
    //-------------------------------------
  ));
}
getAtributosTable(tableName):void{
  this.conexionBackService.getAtributosTable(tableName).subscribe(atributo =>(
    this.atributo=atributo
  ));
}


  //END COMPONENTE 1 -----------------------------------------------------------

  //COMPONENTE 2: conectar solo base de datos
  getConexionResult2 (datosConexion):void{
    this.conexionBackService.getConexionResult(datosConexion).subscribe(result=> this.ordenarConexion2(result));
  }
  //Verifica si la conexion es correcta
  ordenarConexion2(result){
    if(result.isConexion==true){
      this.getTablas();//Segun la cantidad de tablas obtiene sus atributos
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
    console.log(f2.value);
    this.getConexionResult2(f2.value);
    this.conexionDatabase = f2.value;
  }
  getTablas ():void{
    this.conexionBackService.getTablas().subscribe(tablas =>(this.tablas = tablas));
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


  loadToDatabase3():void{
    //Si lo que esta unido a mi es el de union then le digo q carge el del archivo union
    this.getLoadResult("union_tabla");
    //Si lo que esta unido a mi es uno de otra cosa le digo que carge el del archivo de 'otra cosa'

  }

  //END COMPONENTE 3

  //COMPONENTE 7 CONSULTA SQL
  tablas_componente7:any[];
  atributos_componente7:any[] = [];
  campos_numericos:string[] = [];

  getCamposNumericos(datosTabla,atributosTabla){
    var i = 0
    for(var dato in datosTabla[0]){
      console.log(typeof datosTabla[0][dato])
      if (typeof datosTabla[0][dato] == "number"){
        this.campos_numericos.push(atributosTabla[i]);
      }
      i++
    }
    console.log(this.campos_numericos);

  }

  getsql_query(datos):void{
    this.conexionBackService.getsql_query(datos).subscribe(result => this.resultado_sql_query(result));
  }
  trysqlquery(f4: NgForm){
   console.log(f4.value); 
   this.getsql_query(f4.value)
  }
  resultado_sql_query(result){
    
    if(Object.keys(result)[0] == "err"){
      this.emitToConsole("Error en la consulta "+result.err)
      this.tablas_componente7 = null
      this.atributos_componente7 = null
    }
    else{
      this.tablas_componente7 = result;
      this.atributos_componente7 = Object.keys(result[0])
      //Respaldo ---------------------------
      this.respaldoDatosCalculadoraSQL = result
      //-------------------------------------
      console.log(this.tablas_componente7)
      console.log(this.atributos_componente7)
      this.getCamposNumericos(this.tablas_componente7, this.atributos_componente7)
    }

  }
  //END COMPONENTE 4


  //COMPONENTE 5 CALCULADORA(ESTA FUNCION SACA NOMBRE COLUMNA, TABLA Y TIPOD DE DATO)
  datos_elegidos_componente7(datosSelected:string):void{
    console.log(datosSelected);
  }
  con_extraccionTab_calculadora:boolean = false;
  con_consultaSQL_calculadora:boolean = false;
  datosCalculadora:any[];
  atributosCalculadora:any[];
  mensajeCalculadora:string;

  opcionDatosCalculadora:number
  eleccionDatos(opcion:number):void{
    this.opcionDatosCalculadora = opcion
    if(opcion == 1){
      this.datosCalculadora = this.tablas_componente7
      this.atributosCalculadora = this.atributos_componente7
      /*this.respaldoDatosCalculadora = this.tablas_componente7
      this.respaldoAtributosCalculadora = this.atributos_componente7*/
      this.conexionBackService.asignarTabla(this.tablas_componente7).subscribe(result=> console.log(result));
    }
    if(opcion == 2){
      this.datosCalculadora = this.datosTablaElegida
      this.atributosCalculadora = this.atributo
      /*this.respaldoDatosCalculadora = this.datosTablaElegida
      this.respaldoAtributosCalculadora = this.atributo*/
      this.conexionBackService.asignarTabla(this.datosTablaElegida).subscribe(result=> console.log(result));
    }
  }

  comprobacionCalculos(f3: NgForm){
    console.log(f3.value);
    this.conexionBackService.aplicarCalculos(f3.value).subscribe(result=> this.postCalcular(result))
  }
  postCalcular(result){
    if(result){
      this.datosCalculadora = result
      if(this.opcionDatosCalculadora == 1){
        this.tablas_componente7 = result
      }
      if(this.opcionDatosCalculadora == 2){
        this.datosTablaElegida = result
      }
      this.mensajeCalculadora = "Operaciones aplicadas correctamente"
      this.emitToConsole("Operaciones aplicadas correctamente")
    }
    else{
      this.mensajeCalculadora = "Error en la entrada de campos"
      this.emitToConsole("Error en la entrada de campos")
    }
  }
  deshacer(){
      if(this.opcionDatosCalculadora == 1){
        this.conexionBackService.asignarTabla(this.respaldoDatosCalculadoraSQL).subscribe(result=> console.log(result));
        this.datosCalculadora = this.respaldoDatosCalculadoraSQL
        this.tablas_componente7 = this.respaldoDatosCalculadoraSQL
      }
      if(this.opcionDatosCalculadora == 2){
        this.conexionBackService.asignarTabla(this.respaldoDatosCalculadoraTabla).subscribe(result=> console.log(result));
        this.datosCalculadora = this.respaldoDatosCalculadoraTabla
        this.datosTablaElegida = this.respaldoDatosCalculadoraTabla
      }
      this.mensajeCalculadora = "Se deshacieron los cambios"
      this.emitToConsole("Se deshacieron los cambios");

  }
  //END COMPONENTE 5
  //CCOMPONENTE 6 CARGAR DATOS
  mensajeCargaDatos:string;
  cargarArchivo(f5: NgForm){
    this.conexionBackService.getLoadResult(f5.value.nombreArchivo).subscribe(result=> this.postCargarDatos(result))
  }
  postCargarDatos(result){
    if(result){
      this.mensajeCargaDatos="Carga Exitosa"
      this.emitToConsole("Carga Exitosa");
    }else{
      this.mensajeCargaDatos="Error en la Carga de Datos"
      this.emitToConsole("Error en la Carga de Datos");
    }
  }

  //Control de ventanas (modales) y union de componentes
  openModal(e):void{
    var part = e.subject.part;
  
    if(part.data.componente == "Base de Datos") $('#databaseModal').modal('show');

    
    if(part.data.componente == "Cargar Datos"){//Si quiere abrir el componente 'Cargar Datos'

      /*if(this.unionCampos3.campos!="" && this.unionCampos3.tablas!="")//y unida 'Cargar Datos' unido a 'Unir Datos'
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
      }*/

    }
    if(part.data.componente == "Extraccion Tabla"){
      if(this.resultConexion2){//Si la conexion a la base de datos es correcta
        var dataBase_extraccionTabla=false;
        for(var nodo=0;nodo<this.myDiagram.model.linkDataArray.length;nodo++){
          //Si esta unida base de datos con union datos
          if(this.myDiagram.model.linkDataArray[nodo]["from"] ==1 && this.myDiagram.model.linkDataArray[nodo]["to"]==2)
          dataBase_extraccionTabla=true;
        }
        if(dataBase_extraccionTabla){
          this.emitToConsole("Base de Datos y Extraccion Tabla conectados correctamente");
          $('#tableModal').modal('show');
        }
      }else{
        this.emitToConsole("Error en los datos que se conectan al componente: Extraccion Tabla ")
      }

    } 
    if(part.data.componente == "Cargar Datos"){
      var calculadora_cargarDatos=false;
      if(this.resultConexion2){
        for(var nodo=0;nodo<this.myDiagram.model.linkDataArray.length;nodo++){
          if(this.myDiagram.model.linkDataArray[nodo]["from"] ==8 && this.myDiagram.model.linkDataArray[nodo]["to"]==6)
          calculadora_cargarDatos=true;
        }
        if(calculadora_cargarDatos){
          this.emitToConsole("Calculadora y Cargar Datos conectados correctamente");
          $('#cargarmodal').modal('show');
        }else{
          this.emitToConsole("Error, Cargar Datos debe estar conectado a un compoente de transformacion ")
        }
      }
      else{
        this.emitToConsole("Error, No estas conectado a una base de datos")
      }
    }
    if(part.data.componente == "Consulta SQL"){
      if(this.resultConexion2){//Si la conexion a la base de datos es correcta
        var dataBase_unionDatos=false;
        for(var nodo=0;nodo<this.myDiagram.model.linkDataArray.length;nodo++){
          //Si esta unida base de datos con union datos
          if(this.myDiagram.model.linkDataArray[nodo]["from"] ==1 && this.myDiagram.model.linkDataArray[nodo]["to"]==7)
          dataBase_unionDatos=true;
        }
        if(dataBase_unionDatos){
          this.emitToConsole("Base de Datos y Consulta SQL conectados correctamente");
          $('#sqlqueryModal').modal('show');
        }
      }else{
        this.emitToConsole("Error en los datos que se conectan al componente: Consulta SQL ")
      }

    } 

    if(part.data.componente == "Calculadora" ){ //si se quiere abrir el componente calculadora
      //para la parte donde se muestra la tabla
      /*con_extraccionTab_calculadora
      on_consultaSQL_calculadora*/
      this.con_consultaSQL_calculadora = false
      this.con_extraccionTab_calculadora = false
      if(this.resultConexion2 && this.tablas_componente7){
        
        for(var nodo=0;nodo<this.myDiagram.model.linkDataArray.length;nodo++){
          if(this.myDiagram.model.linkDataArray[nodo]["from"] ==7 && this.myDiagram.model.linkDataArray[nodo]["to"]==8)
            this.con_consultaSQL_calculadora = true 
        }
      }
      
      if(this.resultConexion2 && this.datosTablaElegida.length>0){
         
        for(var nodo=0;nodo<this.myDiagram.model.linkDataArray.length;nodo++){
          //Si esta unida base de datos con union datos
          if(this.myDiagram.model.linkDataArray[nodo]["from"] ==2 && this.myDiagram.model.linkDataArray[nodo]["to"]==8)
          this.con_extraccionTab_calculadora = true
        }
      }
      //para abrir el modal
      if(this.con_consultaSQL_calculadora || this.con_extraccionTab_calculadora){//Si la conexion a la base de datos es correcta

          this.emitToConsole("Componente(s) de extraccion y/o Consulta SQL conectado(s) correctamente");
          $('#calculadoramodal').modal('show'); 
      }else{

        this.emitToConsole("Error, Calculador necesita estar conectada a un componente de extraccion o la base de datos no tiene conexion")
      }
    } 
  }
  CambiaNombre(e):void{
    var part=e.subject.part;
    var text=e.subject.text;
    var nodo=this.myDiagram.model.findNodeDataForKey(part.data.key);
    this.myDiagram.model.set(nodo, "nombre", text);

  }

  //####################################################################
  //
  //                              GO JS
  //
  //####################################################################
  ngAfterViewInit(){
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

    console.log(objetoSeleccionado.id);
    if(this.myDiagram != undefined){//Si el diagrama esta cargado
      this.emitToConsole("Objeto agregado: "+objetoSeleccionado.nombre);
      this.myDiagram.model.addNodeData({ key: objetoSeleccionado.id,nombre:objetoSeleccionado.nombre,img:objetoSeleccionado.img,componente:objetoSeleccionado.componente});//add nuevo nodo al modelo

    }
  }

}
