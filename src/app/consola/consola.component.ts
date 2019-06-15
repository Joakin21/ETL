import { Component, OnInit,Input,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-consola',
  templateUrl: './consola.component.html',
  styleUrls: ['./consola.component.css']
})
export class ConsolaComponent implements OnInit {

  mens:string;
  mensajes:string[] =new Array();

  constructor() { }

  ngOnInit() {
  }
  @Input() 
  set mensajeRecibido(mensajeRecibido:string){
    if(mensajeRecibido){
      this.mensajes.push(mensajeRecibido);
    } 
  }
}