const validator = require("validator");
const Articulo = require("../modelos/Articulos");


const prueba = (req,res)=>{
    return res.status(200).json({
        mensaje: "soy una accion de prueba en mi controlador de articulos"
    })
};

const curso = (req,res)=>{
    return res.status(200).json([
        {
            curso: "Master en React",
            autor: "gdd",
            url: "gdd.net/cursos/react"
        },
        {
            curso: "Master en PHP",
            autor: "gdd",
            url: "gdd.net/cursos/php"
        }
    ])
};

const crear = async (req,res)=>{

    //?Recoger los parametros por POST a guardar
    const parametros = req.body;

    try{
        //?Validar datos
        let validar_titulo = !validator.isEmpty(parametros.titulo) &&
                            validator.isLength(parametros.titulo, {min:5, max:undefined});

        let validar_contenido = !validator.isEmpty(parametros.contenido);

        if(!validar_titulo || !validar_contenido){
            throw new Error ("No se ha validado la informacion");
        }

        //?Crear instancia del objeto a guardar
        const articulo = new Articulo(parametros);
    
        //Asignar valores a objeto basado en el modelo (manual o automatico)
        //articulo.titulo = parametros.titulo
    
    
        //?Guardar el articulo en la BD
        
        await articulo.save().then((articuloGuardado)=>{
    
            //?Devolver resutlado
            return res.status(200).json({
                status: "success",
                articulo: articuloGuardado,
                mensaje: "Articulo guardado con exito"
            })
        });

    }catch(error){
        return res.status(400).json({
            status: "error",
            mensaje: error.message
        })
    }

};

const listar = async(req,res)=>{
    try{
        //?Busca todos los articulos en la BD
        let consulta = await Articulo.find().exec();
        
        //?Devuelve lista de articulos en formato JSON
        return res.status(200).send({
            status: "success",
            consulta,
            mensaje: "Articulos listados con exito"
        })

    }catch(error){
        return res.status(404).json({
            status: "error",
            mensaje: error.message
        })
    }

};

module.exports = {
    prueba,
    curso,
    crear,
    listar
}