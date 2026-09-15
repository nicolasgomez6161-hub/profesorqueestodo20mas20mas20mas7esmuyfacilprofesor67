// Importamos el modelo: sigue siendo el único que habla con MySQL.
import ProfesorModel from "../models/ProfesorModel.js";

// Importamos la entidad Profesor: la usamos acá para armar objetos
// antes de guardarlos, y para aprovechar sus métodos
// (validar, esJubilable) sin repetir esa lógica en el controlador.
import Profesor from "../entities/Profesor.js";

// GET /profesores/listar
// Devuelve todos los profesores. Si se pasa ?id=X por query,
// devuelve solamente ese profesor.
const consultar = async (req, res) => {
  try {
    const { id } = req.query;

    if (id) {
      // El modelo ya nos devuelve una instancia de Profesor (o null).
      const profesor = await ProfesorModel.obtenerPorId(id);

      if (!profesor) {
        return res.status(404).json({
          mensaje: `No se encontro un profesor con id ${id}`,
        });
      }

      // res.json llama automáticamente a profesor.toJSON() por dentro,
      // así que "data" sale con la forma que definimos en la entidad.
      // Además aprovechamos el método esJubilable() de la entidad,
      // como ejemplo de comportamiento propio del objeto.
      return res.json({
        mensaje: "consulta profesor",
        data: profesor,
        jubilable: profesor.esJubilable(),
      });
    }

    // obtenerTodos devuelve un array de instancias de Profesor.
    const profesores = await ProfesorModel.obtenerTodos();

    res.json({
      mensaje: "consulta profesores",
      data: profesores,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al consultar profesores",
      error: error.message,
    });
  }
};

// POST /profesores/alta
// Recibe nombre, apellido, edad y materia por body y crea un profesor nuevo.
const ingresar = async (req, res) => {
  try {
    const { nombre, apellido, edad, materia } = req.body;

    // Armamos una instancia de Profesor con los datos crudos del body.
    // El id va en null porque todavía no existe en la base de datos.
    const nuevoProfesor = new Profesor(null, nombre, apellido, edad, materia);

    // En vez de validar "a mano" con ifs sueltos en el controlador,
    // le delegamos la validación a la propia entidad. Si algo está
    // mal, profesor.validar() lanza un Error (throw).
    try {
      nuevoProfesor.validar();
    } catch (errorValidacion) {
      // Atajamos específicamente el error de validación acá,
      // para responder 400 (pedido mal formado) en vez de 500.
      return res.status(400).json({
        mensaje: errorValidacion.message,
      });
    }

    // Si la validación pasó, le pedimos al modelo que lo guarde.
    // El modelo devuelve una nueva instancia de Profesor con el id real.
    const profesorGuardado = await ProfesorModel.crear(nuevoProfesor);

    res.status(201).json({
      mensaje: "ingreso profesor",
      data: profesorGuardado,
    });
  } catch (error) {
    // Este catch atrapa errores "reales" (de conexión, de la query),
    // distintos del error de validación de arriba.
    res.status(500).json({
      mensaje: "Error al ingresar profesor",
      error: error.message,
    });
  }
};

// PUT /profesores/modificar
// Recibe id (obligatorio) y los campos que se quieran actualizar por body.
const actualizar = async (req, res) => {
  try {
    const { id, nombre, apellido, edad, materia } = req.body;

    if (!id) {
      return res.status(400).json({
        mensaje: "el id es obligatorio para modificar un profesor",
      });
    }

    // Traemos el profesor actual como instancia de Profesor.
    const profesorActual = await ProfesorModel.obtenerPorId(id);

    if (!profesorActual) {
      return res.status(404).json({
        mensaje: `No se encontro un profesor con id ${id}`,
      });
    }

    // Armamos una NUEVA instancia de Profesor combinando lo que vino
    // en el body con lo que ya había en la base (actualización parcial).
    const profesorActualizado = new Profesor(
      profesorActual.id,
      nombre !== undefined ? nombre : profesorActual.nombre,
      apellido !== undefined ? apellido : profesorActual.apellido,
      edad !== undefined ? edad : profesorActual.edad,
      materia !== undefined ? materia : profesorActual.materia
    );

    // Volvemos a usar la validación de la entidad, para no permitir
    // que una actualización deje nombre/apellido vacíos.
    try {
      profesorActualizado.validar();
    } catch (errorValidacion) {
      return res.status(400).json({
        mensaje: errorValidacion.message,
      });
    }

    // Le pedimos al modelo que persista los cambios en la base.
    const resultado = await ProfesorModel.actualizar(id, profesorActualizado);

    res.json({
      mensaje: "modificacion profesores",
      data: resultado,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al modificar profesor",
      error: error.message,
    });
  }
};

// DELETE /profesores/eliminar
// Recibe id por body y elimina ese profesor.
const borrar = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        mensaje: "el id es obligatorio para eliminar un profesor",
      });
    }

    const seElimino = await ProfesorModel.eliminar(id);

    if (!seElimino) {
      return res.status(404).json({
        mensaje: `No se encontro un profesor con id ${id}`,
      });
    }

    res.json({
      mensaje: "eliminacion profesores",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar profesor",
      error: error.message,
    });
  }
};

// Exportamos las 4 funciones del controlador, agrupadas en un objeto.
export default { consultar, ingresar, actualizar, borrar };
