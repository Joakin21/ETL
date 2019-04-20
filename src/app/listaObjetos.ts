import {Objeto} from './objeto';

export const OBJETOS: Objeto[] = [
  //Extraccion:
  { id: 1, nombre: 'Base de Datos',color:'orange',img:"assets/img/6.jpeg",componente:"Base de Datos" },
  { id: 2, nombre: 'Extraccion Tabla',color:'red',img:"assets/img/1.jpg",componente:"Extraccion SQL" },
  //Transformacion:
  { id: 3, nombre: 'Cambiar Valor',color:'green',img:"assets/img/2.jpg",componente:"Cambiar Valor" },//por ejemplo, si la fuente almacena una “H” para Hombre y “M” para Mujer pero el destino tiene que guardar “1″ para Hombre y “2″ para Mujer
  { id: 4, nombre: 'Unir Datos',color:'gray',img:"assets/img/3.jpg",componente:"Unir Datos"  },//Cambiar valor individual de un dato

  //Carga:
  { id: 6, nombre: 'Cargar Datos',color:'white',img:"assets/img/5.png",componente:"Cargar Datos" }
];
