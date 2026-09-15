// Importamos express, el framework que maneja el servidor HTTP y las rutas.
import express from "express";

// Importamos cors, que permite que un frontend en otro dominio/puerto
// (por ejemplo un React en localhost:5173) pueda hacer peticiones a esta API.
import cors from "cors";

// Cargamos las variables de entorno del archivo .env (PORT, etc).
import "dotenv/config";

// Importamos el router de profesores que armamos en routes/profesoresRoutes.js.
import profesoresRoutes from "./routes/profesoresRoutes.js";
import estudiantesRoutes from "./routes/estudiantesRoutes.js";
// Creamos la aplicacion de express. "app" es el objeto principal
// que representa nuestro servidor.
const app = express();

// Habilitamos CORS para todas las rutas y todos los origenes
// (para un proyecto en produccion conviene restringirlo a dominios especificos).
app.use(cors());

// Middleware que le dice a express que interprete el body de las
// peticiones como JSON y lo deje disponible en req.body.
// Sin esto, req.body llegaria undefined en los POST/PUT.
app.use(express.json());

// Montamos el router de profesores bajo el prefijo "/profesores".
// Esto significa que router.get("/listar", ...) en realidad
// responde en la ruta completa GET /profesores/listar.
app.use("/profesores", profesoresRoutes);
app.use("/estudiantes", estudiantesRoutes);
// Ruta raiz simple, solo para verificar que el servidor esta levantado
// entrando a http://localhost:3000/ desde el navegador.
app.get("/", (req, res) => {
  res.json({ mensaje: "API de Profesores funcionando" });
});
app.get("/", (req, res) => {
  res.json({ mensaje: "API de Estudiantes funcionando" });
});
// Definimos el puerto: usamos el de la variable de entorno PORT,
// o 3000 por defecto si no esta definida.
const PORT = process.env.PORT || 3000;

// Levantamos el servidor y lo dejamos escuchando peticiones en ese puerto.
// El callback se ejecuta una sola vez, cuando el servidor ya arranco.
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
