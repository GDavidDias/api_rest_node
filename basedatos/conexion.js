const mongoose = require("mongoose");

const conexion = async()=>{
    try{
        mongoose.connect("mongodb://localhost:27017/mi_blog");

        //Parametros a pasar dentro de objeto - ANTES ERA OBLIGATORIO
        //useNewUrlParser:true
        //useUnifiedTopology:true
        //useCreateIndex:true

        console.log("conectado correctamente a la BD mi_blog");

    }catch(error){
        console.log(error);
        throw new Error("No se ha podido conectar a la BD");
    }
}

module.exports = {
    conexion
}