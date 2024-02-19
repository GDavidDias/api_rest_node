const express = require("express");
const router = express.Router();
const ArticuloController = require("../controladores/articulo");

//Rutas de pruebas
router.get("/ruta-de-prueba", ArticuloController.prueba);
router.get("/cursos", ArticuloController.curso);

//Ruta util
router.post("/crear", ArticuloController.crear);
router.get("/articulos/:ultimos?", ArticuloController.listar);
router.get("/articulo/:id", ArticuloController.uno);



module.exports = router;


