from flask import Flask, jsonify, request, render_template, url_for, json
from flask_cors import CORS
import petl as etl
from petl import tocsv, look
import pymysql,os,time,psycopg2
import re

app = Flask(__name__)

#dDBI ={}

dDBI ={
}
dDBI["mod"]=pymysql
"""dDBI ={
    "host":"locdsalhost",
    "port":3306,
    "user":"root",
    "passwd":"cjanz12345",
    "db":"myData",
    "mod":pymysql
}"""
def showjson(name):
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    json_url = os.path.join(SITE_ROOT, "static/data", str(name)+".json")
    data = json.load(open(json_url))
    return data

#Funcion para recibir datos de conexion desde angular
#hacer consutla y ver si esta llenado el diccionario dDBI
#cDBI debe poder tomar datos de postgre, mysql y oracle
"""def get_conex(h,p,u,pas,db):
    cDBI= dDBI["mod"].connect(host=dDBI["host"], port=dDBI["port"],
                      user=dDBI["user"], passwd=dDBI["passwd"],
                      database=dDBI["db"])
    return cDBI
"""

def get_conex(mod,h,p,u,pas,db):
    if mod == 'mysql':
        cDBI= pymysql.connect(host=h, port=p,
                      user=u, passwd=pas,
                      database=db)
    elif mod == 'postgresql':
        #puerto por default es el 5432 para postgresql
        cDBI= psycopg2.connect(host=h, port=p,
                      user=u, password=pas,
                      dbname=db)
    return cDBI

@app.route('/api/asignar', methods=['POST'])
def post_asignar(): 
    data = request.get_json()
    table = etl.fromdicts(data)
    etl.tojson(table,'./static/data/tabalaElegidaCalculadora.json')
    return jsonify(True)

def validarCampo(table, campo):
    camposTable = table[0]
    valido = False
    i = 0
    while(valido == False and i<len(camposTable)):
        if camposTable[i] == campo:
            if str(table[str(campo)][0]).isdigit():
                valido = True
                
        i+=1
    return valido

@app.route('/api/calcular/<calculos>', methods=['GET'])
def get_calculos(calculos):
    try:
        table1 = etl.fromjson('./static/data/tabalaElegidaCalculadora.json')

        campos_y_valores = re.split('\=|\+|\-|\/|\*',calculos)
        campoElegido = campos_y_valores[0].lstrip().rstrip()
        campos_a_operar = campos_y_valores[1:]  
        #get math symbol
        operaciones = []
        for i in calculos:
            if(i=='+' or i=='-' or i=='/' or i=='*'):
                operaciones.append(i)	
        #quito espacios
        for i in range(len(campos_a_operar)): 
            campos_a_operar[i]=campos_a_operar[i].lstrip().rstrip()
        
        #Validacion de datos ------------------------------------------------
        todosValidados = True
        i = 0
        while(todosValidados and i<len(campos_a_operar)):
            if campos_a_operar[i].isdigit()==False:
                todosValidados = validarCampo(table1,campos_a_operar[i])
            i += 1
        print(todosValidados)
        #---------------------------------------------------------------------
        if todosValidados:
            #agrego row
            for i in range(len(campos_a_operar)):
                if campos_a_operar[i].isdigit()==False:
                    campos_a_operar[i] = 'row.'+campos_a_operar[i]
            #formulo el eval
            operacion_final = ""
            for i in range(len(operaciones)):
                operacion_final +=  campos_a_operar[i]+operaciones[i]
            operacion_final +=campos_a_operar[len(campos_a_operar)-1]

            table2 = etl.convert(table1, campoElegido, lambda v,row: eval(operacion_final),pass_row=True)
            #etl.tojson(table2,"./static/data/calculos.json")
            etl.tojson(table2,'./static/data/tabalaElegidaCalculadora.json')
            rv = showjson("tabalaElegidaCalculadora")
            return jsonify(rv)
        else:
            return jsonify(False)  
    except:
        return jsonify(False)

@app.route('/api/conexion', methods=['POST'])
def get_conexion():
    
    dDBI["mod"]=request.get_json()["conex"]
    dDBI["host"]=request.get_json()["host"]
    dDBI["port"]=request.get_json()["port"]
    dDBI["user"]=request.get_json()["user"]
    dDBI["passwd"]=request.get_json()["passwd"]
    dDBI["db"]=request.get_json()["db"]
    
    try:
        conex = get_conex(dDBI["mod"],dDBI["host"],dDBI["port"],dDBI["user"], dDBI["passwd"],dDBI["db"])
        return jsonify({'isConexion':True})#true
    except pymysql.err.OperationalError:
        return jsonify({'isConexion':False})#False
    except pymysql.err.InternalError:
        return jsonify({'isConexion':False})#False

@app.route('/api/sql_query', methods=['POST'])
def get_query():
    tipo_db = request.get_json()["tipo1"]
    query = request.get_json()["query1"]
    try :
        conex = get_conex(dDBI["mod"],dDBI["host"],dDBI["port"],dDBI["user"], dDBI["passwd"],dDBI["db"])
        etl_resultado = etl.fromdb(conex,query)
        etl.tojson(etl_resultado,'./static/data/sql_query.json')#ACA AGREGAR UN IDENTIFICADOR PARA BASE DE DATOS!!!! OJO
        aTablas = showjson('sql_query')
        return jsonify(aTablas)
    except pymysql.err.OperationalError as e:
        s = str(e)
        return jsonify({'query':False,'err':s})#False
    except pymysql.err.InternalError as e:
        s = str(e)
        return jsonify({'query':False,'err':s})#False
    except pymysql.err.ProgrammingError as e:
        s = str(e)
        return jsonify({'query':False,'err':s})


"""@app.route('/api/cambiarValor', methods=['POST'])
def get_cambiar_valor():
    inicial =request.get_json()["inicial"]
    cambiar =request.get_json()["cambiar"]
    conex = get_conex(dDBI["mod"],dDBI["host"],dDBI["port"],dDBI["user"], dDBI["passwd"],dDBI["db"])
"""


@app.route('/api/tablas', methods=['GET'])
def get_all_tables():
    conex = get_conex(dDBI["mod"],dDBI["host"],dDBI["port"],dDBI["user"], dDBI["passwd"],dDBI["db"])
    listTable="SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA ="+"'"+str(dDBI["db"])+"'"
    tablas = etl.fromdb(conex,listTable)
    etl.tojson(tablas,'./static/data/tablas.json')#ACA AGREGAR UN IDENTIFICADOR PARA BASE DE DATOS!!!! OJO
    conex.close()
    aTablas = showjson('tablas')
    return jsonify(aTablas)

@app.route('/api/atributos', methods=['GET'])
def get_all_atributos():
    conex = get_conex(dDBI["mod"],dDBI["host"],dDBI["port"],dDBI["user"], dDBI["passwd"],dDBI["db"])
    listAtrib="SELECT COLUMN_NAME,TABLE_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA ="+"'"+str(dDBI["db"])+"'"
    allAtributos = etl.fromdb(conex,listAtrib)
    etl.tojson(allAtributos,'./static/data/allAtributos.json')#ACA AGREGAR UN IDENTIFICADOR PARA BASE DE DATOS!!!! OJO
    conex.close()
    myAtributos = showjson('allAtributos')
    return jsonify(myAtributos)



@app.route('/api/datosTable/<tableName>', methods=['GET'])
def get_data_table(tableName):
    conex = get_conex(dDBI["mod"],dDBI["host"],dDBI["port"],dDBI["user"], dDBI["passwd"],dDBI["db"])
    tabla = etl.fromdb(conex,"SELECT * FROM "+tableName)
    etl.tojson(tabla,"./static/data/"+tableName+'.json')
    conex.close()
    rv= showjson(str(tableName))
    return jsonify(rv)

@app.route('/api/cambiarValor/<cambio>', methods=['GET'])
def get_cambiar_valor(cambio):
    conex = get_conex(dDBI["mod"],dDBI["host"],dDBI["port"],dDBI["user"], dDBI["passwd"],dDBI["db"])
    myCambio = cambio.split("_")#0una vez cambiado 1
    tabla = etl.fromdb(conex,"SELECT * FROM "+myCambio[3])
    tablaCambiada = etl.convert(tabla, str(myCambio[0]), 'replace', str(myCambio[1]), str(myCambio[2]))
    etl.tojson(tablaCambiada,"./static/data/cambiarValor.json")
    conex.close()
    rv= showjson("cambiarValor")
    return jsonify(rv)

@app.route('/api/atributosTable/<tableName>', methods=['GET'])
def get_atributosTable(tableName):
    conex = get_conex(dDBI["mod"],dDBI["host"],dDBI["port"],dDBI["user"], dDBI["passwd"],dDBI["db"])
    query="SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME ="+"'"+str(tableName)+"'"
    atributos = etl.fromdb(conex,query)
    etl.tojson(atributos,"./static/data/"+tableName+'_atrib.json')
    conex.close()
    rv = showjson(str(tableName)+"_atrib")
    return jsonify(rv)

@app.route('/api/load/<nameFile>', methods=['GET'])
def get_load_result(nameFile):
    
        table1 = etl.fromjson('./static/data/tabalaElegidaCalculadora.json')
        tocsv(table1, './exelFiles/'+str(nameFile)+'.csv')
        etl.tohtml(table1, './exelFiles/'+str(nameFile)+'.html',caption=str(nameFile))
        return jsonify(True)
    
        #return jsonify(False)


if __name__ == '__main__':
    app.run(debug=True)
