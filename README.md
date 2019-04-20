# MyApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.2.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

#Requisitos

Angular 6 y python 3 instalados
Conexión a internet para el uso de Bootstrap y GoJS
Sistema operativo linux (no ha sido probado en windows)

# Instalación 

1.- clonar o descargar el proyecto de la rama "ultimaVersión"
2.- usar npm install para descargar los modulos que el proyecto necesita
3.- usar npm start y python3 app.py para ejecutar el proyecto
4.- abrir un navegador e ir a http://localhost:4200/ 

#uso

Usar los componentes: 
Base de datos -> Unir Datos -> Cargar Datos (unir los componentes de esa manera)
con esto tenemos un flujo que carga datos de una base de datos (puede ser de tipo mysql y postgresql), une los campos de diferentes tablas que contenga esta base de datos y los carga a un archivo csv que se encontrara en la carpeta exelFiles.
Tambien tenemos el otro componente de carga que se llama 'Extraccion Tabla' el cual solo extrae datos de la tabla que el usuario elija de una base de datos que el quiera. Intentamos aplicar una transformación a este componente, pero aún no lo hemos terminado, su componente de trasformación era 'Cambiar Valor'. Este flujo quedo incompleto, solo se puede visualizar los datos en este componente de transformación que provienen del componente 'Extraccion Tabla'. Por ahora funciona solamente el primer flujo de arriba. 


