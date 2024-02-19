const  {conexion} = require("./basedatos/conexion");
const express = require("express");
const cors = require("cors");
const puerto = 3900;


//Inicializar app
console.log("Hola que tal");


//Conectar a BD
conexion();

//Crear Servidor Node -> para crear peticiones http, crear rutas, etc.
const app = express();

//Configurar CORS
app.use(cors());

//Convertir body a objeto JS
app.use(express.json());  //recibir datos con content-type app/json

app.use(express.urlencoded({extended:true})); //recibe por form-urlencoded

//RUTAS
const rutas_articulo = require("./rutas/articulo");

//Cargo las rutas
app.use("/api",rutas_articulo);


//RUTAS PRUEBAS HARDOCEADAS
app.get("/probando", (req,res)=>{
    console.log("Se ha ejecutado el endpoint probando")

    // return res.status(200).send(`
    //     <div>
    //         <h1>Probando ruta nodejs</h1>
    //         <p>Creando api rest con node</p>
    //         <ul>
    //             <li>Master en REact</li>
    //             <li>Master en PHP</li>
    //         </ul>
    //     </div>
    // `)

    return res.status(200).send("<h1>Empezando a crear una api rest con node </h1>")
});

app.get("/test", (req,res)=>{

    return res.status(200).json("Se ha ejecutado el endpoint probando");
});


//Crear servidor y escuchar peticiones http
app.listen(puerto,()=>{
    console.log("Servidor corriendo en el puerto ", puerto);
})