<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


# watch mode
$ yarn run start:dev



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
- `GET /products/:id` - Get product by ID
- `POST /products` - Create a new product
- `PUT /products/:id` - Update product by ID
- `DELETE /products/:id` - Delete product by ID

### Search
- `POST /api/search?buscar=Profesores&q=<nombre-profesor>` - requiere estar autenticado para crear post, buscar profesores
- `POST /api/search?buscar=Escuelas&q=<nombre-escuela>` - requiere estar autenticado para crear post, buscar escuelas
- `POST /products` - Create a new product
- `PUT /products/:id` - Update product by ID
- `DELETE /products/:id` - Delete product by ID



## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
# nestjs-auth-good
