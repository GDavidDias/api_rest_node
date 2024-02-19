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
        let consulta = Articulo.find({});
        if (req.params.ultimos) {
            const ult = parseInt(req.params.ultimos);
            consulta = consulta.limit(ult);
        }
        consulta = await consulta.sort({ fecha: -1 }).exec();
        console.log(consulta);
        //?Busca todos los articulos en la BD
        //?los ordena por fecha y limita los resultados si viene el parametro ultimos
        // if(req.params.ultimos){
        //     consulta = await Articulo.find().sort({fecha:-1}).limit(req.params.ultimos).exec();
        // }else{
        //     consulta = await Articulo.find().sort({fecha:-1}).exec();
        // }


        
        //?Devuelve lista de articulos en formato JSON
        return res.status(200).send({
            status: "success",
            parametro: req.params.ultimos,
            cantidad: consulta.length,
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