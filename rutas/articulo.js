const express = require("express");
const multer = require("multer");
const router = express.Router();
const ArticuloController = require("../controladores/articulo");

const almacenamiento = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './imagenes/articulos/')
    },

    filename: (req, file, cb)=>{
        cb(null, "articulo" + Date.now() + file.originalname)
    }
});

const subidas = multer({storage: almacenamiento});

//Rutas de pruebas
router.get("/ruta-de-prueba", ArticuloController.prueba);
router.get("/cursos", ArticuloController.curso);

//Ruta util
router.post("/crear", ArticuloController.crear);
router.get("/articulos/:ultimos?", ArticuloController.listar);
router.get("/articulo/:id", ArticuloController.uno);
router.delete("/articulo/:id", ArticuloController.borrar);
router.put("/articulo/:id", ArticuloController.editar);

router.post("/subir-imagen/:id", [subidas.single("file0")], ArticuloController.subir);
router.get("/imagen/:fichero", ArticuloController.imagen);





module.exports = router;


