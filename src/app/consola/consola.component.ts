import { Component, OnInit,Input,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-consola',
  templateUrl: './consola.component.html',
  styleUrls: ['./consola.component.css']
})
export class ConsolaComponent implements OnInit {

  mens:string;

  constructor() { }

  ngOnInit() {
  }
  @Input() mensajeRecibido:string;

  /*set mensajeRecibido(mensajeToConsole:string){
    console.log("mensaje: "+mensajeToConsole);
  }*/

}
