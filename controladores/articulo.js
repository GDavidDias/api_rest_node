const validator = require("validator");


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

const crear = (req,res)=>{

    //Recoger los parametros por POST a guardar
    const parametros = req.body;
    

    //Valdar datos
    try{
        let validar_titulo = !validator.isEmpty(parametros.titulo) &&
                            validator.isLength(parametros.titulo, {min:5, max:undefined});

        let validar_contenido = !validator.isEmpty(parametros.contenido);

        if(!validar_titulo || !validar_contenido){
            throw new Error ("No se ha validado la informacion");
        }

    }catch(error){
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        })
    }

    //Crear el objeto a guardar

    //Asignar valores a objeto basado en el modelo (manual o automatico)

    //Guardar el articulo en la BD

    //Devolver resutlado
    return res.status(200).json({
        mensaje: "accion de guardar",
        parametros
    })
}

module.exports = {
    prueba,
    curso,
    crear
}