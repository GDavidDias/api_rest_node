const {validarArticulo} = require("../helpers/validar");
const fs = require("fs");
const path = require("path");
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
        try{
            validarArticulo(parametros);
        }catch(error){
            return res.status(400).json({
                status: "error",
                mensaje: "Faltan datos por enviar"
            })
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
        let consulta = Articulo.find({});

        //?Si viene el parametro ultimos, se limita el resultado
        if (req.params.ultimos) {
            const ult = parseInt(req.params.ultimos);
            consulta = consulta.limit(ult);
        }
        //?los ordena por fecha
        consulta = await consulta.sort({ fecha: -1 }).exec();
        console.log(consulta);

        
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

const uno = async(req,res)=>{
    //Recoger un id por la url
    let {id} = req.params;
    //console.log(id)

    try{
        //Buscar el articulo
        let articulo = await Articulo.findById(id)

        //Si no existe deveolver error
        if(!articulo){
            return res.status(404).json({
                status: "error",
                mensaje: "no se han encontrado el articulo"
            });
        }
        
        //Devolver resultado
        return res.status(200).json({
            status:"success",
            articulo
        })

    }catch(error){
        return res.status(404).json({
            status: "error",
            mensaje: error.message
        })
    }

};


const borrar = async(req,res)=>{

    let {id} = req.params;

    try{
        let articulo = await Articulo.findOneAndDelete({_id: id});

        if(!articulo){
            return res.status(404).json({
                status: "error",
                mensaje: "Error al borrar, articulo no existe"
            });
        }


        return res.status(209).json({
            status: "success",
            articulo: articulo,
            mensaje: "metodo de borrar"
        })

    }catch(error){
        return res.status(404).json({
            status: "error",
            mensaje: error.message
        })
    }
};


const editar = async(req, res)=>{

    //recoger id articulo a editar
    let {id} = req.params;

    //recoger nuevos datos del body
    let parametros = req.body;


    try{

        //?Validar datos
        try{
            validarArticulo(parametros);
        }catch(error){
            return res.status(400).json({
                status: "error",
                mensaje: "Faltan datos por enviar"
            })
        }

        //buscar y actualizar articulo
        let articulo_actualizado = await Articulo.findOneAndUpdate({_id: id}, parametros, {new: true});

        if(!articulo_actualizado){
            return res.status(404).json({
                status: "error",
                mensaje: "No se actualizo el articulo"
            })
        }

        //devolver respuesta
        return res.status(200).json({
            status: "success",
            articulo: articulo_actualizado,
            mensaje: "Articulo actualizado correctamente"
        })


    }catch(error){
        return res.status(400).json({
            status: "error",
            mensaje: error.message
        })
    }
};


const subir = async(req,res)=>{

    //Configurar multer

    //Recoger el fichero de imagen subido
    if(!req.file && !req.files){
        return res.status(404).json({
            status: "error",
            mensaje: "Peticion Invalida"
        })
    };

    //Nombre del archivo
    let archivo = req.file.originalname;

    //Extension del archivo
    let archivo_split = archivo.split("\.");
    let archivo_extension = archivo_split[1];

    //Comprobar extension correcta
    if (archivo_extension != "jpeg" && archivo_extension != "png" && 
        archivo_extension != "jpg" && archivo_extension != "gif"){
            //Si no cumple con la extension de una imagen no lo guardo y borro archivo y doy respuesta
            fs.unlink(req.file.path, (error)=>{
                return res.status(400).json({
                    status: "error",
                    mensaje: "El archivo no es una imagen"
                })
            })

    }else{
        //Si todo va bien, actualizar el articulo
        let articuloId = req.params.id;

        //Buscar y actualizar articulo
        let articulo_actualizado = await Articulo.findOneAndUpdate({_id : articuloId}, {imagen: req.file.filename}, {new:true});

        if(!articulo_actualizado){
            return res.status(404).json({
                status: "error",
                mensaje: "No se actualizo el articulo"
            })
        };

        //devolver respuesta
        return res.status(200).json({
            status: "success",
            articulo: articulo_actualizado,
            mensaje: "Articulo actualizado correctamente",
            fichero: req.file
        });

    }
};


const imagen = (req,res)=>{

    let fichero = req.params.fichero;
    let ruta_fisica = "./imagenes/articulos/"+fichero;

    fs.stat(ruta_fisica,(error, existe)=>{
        if (existe) {
            return res.sendFile(path.resolve(ruta_fisica))
        }else{
            return res.status(404).json({
                status: "error",
                mensaje: "La imagen no existe",
                existe,
                fichero,
                ruta_fisica
            })
        }
    })
};


const buscador = async (req, res)=>{
    //SAcar string de busqueda
    let busqueda = req.params.busqueda;

    try{
        //Find a Coleccion con un OR
        let articulo_enc = await Articulo.find({"$or": [
            {"titulo": {"$regex": busqueda, "$options": "i"}},
            {"contenido": {"$regex": busqueda, "$options": "i"}},
        //Orden
        ]}).sort({fecha:-1}).exec();

        console.log(articulo_enc);

        if(!articulo_enc || articulo_enc.length <= 0){
            return res.tatus(404).json({
                status: "error",
                mensaje: "articulo no encontrado"
            })
        }

        return res.status(200).json({
            status: "success",
            articulo_enc
        })

    }catch(error){
        return res.status(400).json({
            status:"error",
            mensaje: error.message
        });
    };


    //Ejecutar consulta

    //Devolver resultado

};


module.exports = {
    prueba,
    curso,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    imagen,
    buscador
}