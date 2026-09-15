## Pasos para levantar el servidor

1. Instalar dependencias:
   npm install

2. Crear la base de datos s_escuela.sql
 

3. Chequear si el .env coincide con los datos de la BD.

4. Levantar el servidor:

   npm run dev

5. Probar los endpoints con postman.

| Método | Endpoint                     | Body (JSON)                                              |
|--------|-------------------------------|-----------------------------------------------------------|
| GET    | `/profesores/listar`          | —                                                          |
| GET    | `/profesores/listar?id=1`     | —                                                          |
| POST   | `/profesores/alta`            | `{ "nombre": "Ana", "apellido": "Diaz", "edad": 35, "materia": "Matematica" }` |
| PUT    | `/profesores/modificar`       | `{ "id": 1, "materia": "Fisica" }`                        |
| DELETE | `/profesores/eliminar`        | `{ "id": 1 }`                                              |
