<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login a user
- `POST /api/auth/register` - Register nuevo usuario
- `POST /api/auth/refresh` - Llamar al refresh token
- `POST /api/auth/google/forgot-password` - recuperar clave perdida
- `POST /api/auth/google/reset-password` - recuperar clave perdida
- `GET /api/auth/google/login` - Login con Google
- `GET /api/auth/google/redirect` - Redireccion de google

### Profesor

- `POST /api/profesores/:professorId` - requiere estar autenticado para crear profesor
- `GET /api/profesores/:professorId` - Obtiene solo un profesor por ID
- `PATCH /api/profesores/:professorId` - Actualiza informacion del profesor
- `DELETE /api/profesores/:professorId` - Elimina un profesor 

### Escuela

- `POST /api/school/` - requiere estar autenticado para crear escuela
- `GET /api/school/:schoolId` - Obtiene una escuela

### Notes

- `POST /api/notes/:professorId/create-note` - requiere estar autenticado para crear el apunte, sube archivos a AWS S3
- `DELETE /api/notes/:noteId` - requiere estar autenticado para eliminar apunte, elimina de la base de datos y del Bucket S3


### Post

- `POST /api/post/:professorId` - requiere estar autenticado para crear post
- `DELETE /api/post/:professorId` - requiere estar autenticado para eliminar post

### Search

- `POST /api/search?buscar=Profesores&q=<nombre-profesor>` - buscar profesores
- `POST /api/search?buscar=Escuelas&q=<nombre-escuela>` - buscar escuelas
- `GET /api/search?profesores/:schoolId?page=<num-pagina>&limit=<limite>` - Obtenter todos los profesores de una escuela
- `GET /api/search/profesor/:professorId` - Buscar a profesor


