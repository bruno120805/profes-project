<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


## API Endpoints

### Authentication
- `POST /api/auth/login` - Login a user
- `POST /api/auth/register` - Register nuevo usuario
- `POST /api/auth/refresh` - Llamar al refresh token
- `POST /api/google/forgot-password` - recuperar clave perdida
- `POST /api/google/reset-password` - recuperar clave perdida
- `GET /api/google/login` - Login con Google
- `GET /api/google/redirect` - Redireccion de google


### Posts
- `POST /api/` - requiere estar autenticado para crear post


### Search
- `POST /api/search?buscar=Profesores&q=<nombre-profesor>` - buscar profesores
- `POST /api/search?buscar=Escuelas&q=<nombre-escuela>` -  buscar escuelas
- `GET /api/search?profesores/:schoolId?page=<num-pagina>&limit=<limite>` -  Obtenter todos los profesores de una escuela
- `GET /api/search/profesor/:professorId` -  Buscar a profesor



## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
# nestjs-auth-good
