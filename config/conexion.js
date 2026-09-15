// Importamos mysql2 en su version "promise", que nos permite usar
// async/await en vez de callbacks para trabajar con la base de datos.
import mysql from "mysql2/promise";

// Cargamos las variables definidas en el archivo .env dentro de
// process.env (por ejemplo process.env.DB_HOST, process.env.DB_USER, etc).
// Con solo importar "dotenv/config" ya se ejecuta la carga automaticamente.
import "dotenv/config";

// Creamos un "pool" de conexiones en vez de una unica conexion.
// Un pool mantiene varias conexiones abiertas y las reutiliza entre
// distintas peticiones, en vez de abrir y cerrar una conexion nueva
// cada vez (mas eficiente para una API que recibe muchas requests).
const pool = mysql.createPool({
  // Si no existe la variable de entorno, usamos "localhost" por defecto.
  host: process.env.DB_HOST || "localhost",

  // Usuario de MySQL (por defecto "root" en instalaciones locales).
  user: process.env.DB_USER || "root",

  // Contraseña del usuario de MySQL.
  password: process.env.DB_PASSWORD || "",

  // Nombre de la base de datos a la que nos conectamos.
  database: process.env.DB_NAME || "s_escuela",

  // Puerto donde escucha MySQL (3306 es el puerto estandar).
  port: process.env.DB_PORT || 3306,

  // Si se agotan las conexiones disponibles del pool, las nuevas
  // peticiones esperan en una cola en vez de fallar inmediatamente.
  waitForConnections: true,

  // Cantidad maxima de conexiones simultaneas que mantiene el pool.
  connectionLimit: 10,

  // 0 = cola de espera ilimitada cuando no hay conexiones libres.
  queueLimit: 0,
});

// Hacemos una prueba de conexion apenas se importa este archivo,
// para saber de entrada si los datos del .env son correctos.
try {
  // Pedimos prestada una conexion del pool.
  const connection = await pool.getConnection();

  // Si llegamos hasta aca, la conexion fue exitosa.
  console.log("Conectado a MySQL!");

  // Devolvemos la conexion al pool para que quede disponible
  // para las queries reales de la aplicacion.
  connection.release();
} catch (error) {
  // Si algo falla (mal usuario, contraseña incorrecta, MySQL apagado, etc.)
  // lo mostramos en consola, pero no frenamos el servidor.
  console.error("Error al conectar a MySQL:", error.message);
}

// Exportamos el pool como export default, para que cualquier
// controlador pueda importarlo y usarlo para hacer sus propias queries.
export default pool;
