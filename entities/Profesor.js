// La clase Profesor define la "forma" de un profesor: qué atributos
// tiene y qué reglas propias le corresponden (validación, cálculos).
// A diferencia del modelo (ProfesorModel), esta clase NO sabe nada
// de SQL ni de la base de datos — solo conoce sus propios datos.
class Profesor {
  // El constructor recibe los datos crudos y los guarda como
  // atributos de la instancia (this.nombre, this.apellido, etc).
  // "id" puede venir null cuando todavía no fue guardado en la base
  // (por ejemplo, al crear un profesor nuevo, antes del INSERT).
  constructor(id, nombre, apellido, edad, materia) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
    this.materia = materia;
  }

  // Getter: se puede usar como propiedad (profesor.nombreCompleto),
  // sin paréntesis, aunque por dentro sea una función.
  // Combina nombre y apellido en un solo string.
  get nombreCompleto() {
    return `${this.nombre} ${this.apellido}`;
  }

  // Método que encapsula la regla de negocio "cuándo un profesor
  // es jubilable". Antes esta lógica estaría dispersa en controladores;
  // acá vive junto con los datos que la definen (this.edad).
  esJubilable() {
    return this.edad !== undefined && this.edad !== null && this.edad >= 65;
  }

  // Método de validación: chequea que los campos obligatorios
  // estén presentes. En vez de devolver true/false, lanza un error
  // (throw) para cortar la ejecución apenas algo está mal.
  // Quien llame a este método debe rodearlo con try/catch.
  validar() {
    if (!this.nombre || !this.apellido) {
      throw new Error("nombre y apellido son obligatorios");
    }
  }

  // toJSON: método especial que JavaScript llama automáticamente
  // cuando hacés JSON.stringify(profesor) (por ejemplo, dentro de
  // res.json(profesor)). Acá controlamos exactamente qué forma tiene
  // el objeto que se manda al cliente.
  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      apellido: this.apellido,
      edad: this.edad,
      materia: this.materia,
    };
  }
}

// Exportamos la clase como export default, para poder importarla
// con el nombre que queramos en otros archivos.
export default Profesor;
