from flask import Flask, jsonify, request, render_template, url_for, json
from flask_cors import CORS
import petl as etl
from petl import tocsv, look
import pymysql,os,time,psycopg2


app = Flask(__name__)

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

@app.route('/api/unionCampos', methods=['POST'])
def get_union_campos():
    campos = request.get_json()["campos"]
    tablas = request.get_json()["tablas"]
    campos = campos.split(",")
    tablas = tablas.split(",")
    conex = get_conex(dDBI["mod"],dDBI["host"],dDBI["port"],dDBI["user"], dDBI["passwd"],dDBI["db"])
    aResult = []
    for i in range(len(campos)):
        #consult = "SELECT "+campos[i]+" FROM "+tablas[i]
        etl_tabla = etl.fromdb(conex,"SELECT "+campos[i]+" FROM "+tablas[i])
        aResult.append(etl_tabla)
    union_tabla = aResult[0]
    for i in range(len(aResult)-1):
        union_tabla = etl.crossjoin(union_tabla, aResult[i+1])
    #Probando como cargaria la union a la base de datos

    etl.tojson(union_tabla,'./static/data/union_tabla.json')
    conex.close()
    myUnion = showjson('union_tabla')
    return jsonify(myUnion)

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
    tableToLoad = etl.fromjson('./static/data/'+str(nameFile)+'.json')
    tocsv(tableToLoad, './exelFiles/'+str(nameFile)+'.csv')
    return jsonify({'resultLoad':True})
    #return jsonify(aTablas)

if __name__ == '__main__':
    app.run(debug=True)
