// Importamos express para poder crear un "Router": un mini-servidor
// de rutas que despues montamos dentro de server.js.
import express from "express";

// Importamos el controlador de profesores, que tiene las 4 funciones
// (consultar, ingresar, actualizar, borrar) que van a manejar la logica
// de cada endpoint. Ojo con la extension ".js": es obligatoria en ESM.
import profesoresController from "../controllers/profesoresController.js";

// Creamos una instancia de Router. A partir de aca, "router" funciona
// como un mini "app" de express, pero solo para las rutas de profesores.
const router = express.Router();

// GET /profesores/listar
// Cuando llega una peticion GET a esta ruta, express ejecuta
// la funcion "consultar" del controlador (lista todos o uno por ?id=).
router.get("/listar", profesoresController.consultar);

// POST /profesores/alta
// Cuando llega una peticion POST con datos en el body,
// express ejecuta "ingresar" para crear un profesor nuevo.
router.post("/alta", profesoresController.ingresar);

// PUT /profesores/modificar
// Cuando llega una peticion PUT con el id y los campos a cambiar
// en el body, express ejecuta "actualizar".
router.put("/modificar", profesoresController.actualizar);

// DELETE /profesores/eliminar
// Cuando llega una peticion DELETE con el id en el body,
// express ejecuta "borrar" para eliminar ese profesor.
router.delete("/eliminar", profesoresController.borrar);

// Exportamos el router como export default para poder importarlo
// en server.js y montarlo bajo un prefijo, por ejemplo:
// app.use("/profesores", profesoresRoutes)
export default router;
