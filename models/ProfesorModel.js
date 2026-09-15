// Importamos el pool de conexión a MySQL. El modelo sigue siendo
// la única capa que ejecuta SQL.
import pool from "../config/conexion.js";

// Importamos la entidad Profesor: la usamos para "envolver" las filas
// que trae MySQL, en vez de devolver objetos planos sueltos.
import Profesor from "../entities/Profesor.js";

// Función interna (no se exporta) que convierte una fila de MySQL
// (objeto plano: { id, nombre, apellido, edad, materia }) en una
// instancia de la clase Profesor. La reutilizamos en varios métodos
// para no repetir el mismo "new Profesor(...)" en cada uno.
const filaAProfesor = (fila) =>
  new Profesor(fila.id, fila.nombre, fila.apellido, fila.edad, fila.materia);

// obtenerTodos: trae todos los registros y los devuelve como
// instancias de Profesor (no como filas crudas de MySQL).
const obtenerTodos = async () => {
  const [rows] = await pool.query("SELECT * FROM profesores");

  // rows.map(...) recorre cada fila y la transforma en un Profesor,
  // devolviendo un array de instancias de la clase.
  return rows.map(filaAProfesor);
};

// obtenerPorId: busca un único profesor y lo devuelve como
// instancia de Profesor, o null si no existe.
const obtenerPorId = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM profesores WHERE id_profesor = ?",
    [id]
  );

  // Si no hay filas, no hay nada que envolver: devolvemos null.
  if (rows.length === 0) return null;

  // Si hay una fila, la convertimos en instancia de Profesor.
  return filaAProfesor(rows[0]);
};

// crear: recibe una instancia de Profesor YA VALIDADA
// (el controlador llama a profesor.validar() antes de pasarla acá),
// la inserta en la base y devuelve una nueva instancia con el id real.
const crear = async (profesor) => {
  // Sacamos los atributos de la instancia para armar el INSERT.
  const { nombre, apellido, edad, materia } = profesor;

  const [result] = await pool.query(
    "INSERT INTO profesores (nombre, apellido, edad, materia) VALUES (?, ?, ?, ?)",
    [nombre, apellido, edad, materia]
  );

  // Devolvemos una nueva instancia de Profesor, ahora con el id
  // que le asignó MySQL automáticamente (result.insertId).
  return new Profesor(result.insertId, nombre, apellido, edad, materia);
};

// actualizar: recibe el id y una instancia de Profesor con los
// valores finales (ya combinados entre lo nuevo y lo existente).
const actualizar = async (id, profesor) => {
  const { nombre, apellido, edad, materia } = profesor;

  await pool.query(
    "UPDATE profesores SET nombre = ?, apellido = ?, edad = ?, materia = ? WHERE id_profesor = ?",
    [nombre, apellido, edad, materia, id]
  );

  // Devolvemos una instancia de Profesor representando el estado
  // final del registro, para que el controlador la mande al cliente.
  return new Profesor(Number(id), nombre, apellido, edad, materia);
};

// eliminar: borra un profesor según su id. No necesita trabajar
// con la entidad, porque no devuelve datos del profesor, solo
// si se pudo borrar o no.
const eliminar = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM profesores WHERE id_profesor = ?",
    [id]
  );

  return result.affectedRows > 0;
};

// Exportamos las 5 funciones del modelo agrupadas en un objeto.
export default { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };
