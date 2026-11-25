# Loja: categorias, produtos e pedidos

Trabalho de Backend (API REST com Spring Boot) e Front-end (Angular), tema **Loja**.

```text
loja/
├── loja-api/        Backend: Spring Boot, JPA, PostgreSQL, JWT
└── loja-frontend/   Front-end: Angular 19
```

## Como rodar o backend (`loja-api`)

1. Instale JDK 17+ e Maven. Crie no PostgreSQL um banco chamado `loja`.
2. A configuração padrão (`application.properties`) usa `localhost:5434`, usuário `postgres` e senha `postgres`.
   Para mudar, defina `DB_URL`, `DB_USER` e `DB_PASS` no ambiente.
3. Na pasta `loja-api`:

```text
mvn spring-boot:run
```

A API sobe em `http://localhost:8080`. Swagger: `http://localhost:8080/swagger-ui.html`.

As tabelas são criadas pelo JPA. Na primeira execução, a classe `DadosIniciais` cria:

| Usuário | Senha | Perfil |
|---|---|---|
| `admin` | `admin123` | ADMIN (faz tudo) |
| `cliente` | `cliente123` | COMUM (consulta e cria pedidos) |

Também cria 2 categorias e 3 produtos de exemplo. Quem se cadastra por `POST /usuarios` sempre vira COMUM.
Reiniciar a API invalida os tokens (a chave do JWT é gerada ao iniciar): faça login de novo.

## Como rodar o front-end (`loja-frontend`)

Com o backend rodando, na pasta `loja-frontend`:

```text
npm install
npm start
```

Abra `http://localhost:4200` e entre com `admin` / `admin123`.
O endereço da API fica em `src/app/services/api.config.ts`. O CORS já está liberado para `http://localhost:4200` no `SecurityConfig`.

## Endpoints

| Método | Rota | Quem acessa |
|---|---|---|
| POST | `/auth/login` | público |
| POST | `/usuarios` | público (cria usuário COMUM) |
| GET | `/categorias`, `/categorias/{id}` | logado |
| GET | `/categorias/{id}/produtos` | logado (**consulta com filtro no path**) |
| POST, PUT, DELETE | `/categorias`, `/categorias/{id}` | ADMIN |
| GET | `/produtos?nome=&cor=&precoMax=` | logado (**consulta com vários parâmetros**) |
| GET | `/produtos/{id}` | logado |
| POST, PUT, DELETE | `/produtos`, `/produtos/{id}` | ADMIN |
| GET | `/pedidos`, `/pedidos/{id}` | logado |
| POST | `/pedidos` | logado (ADMIN ou COMUM) |
| DELETE | `/pedidos/{id}` | ADMIN |

Erros voltam como `{ "mensagem": "..." }` com 400, 401, 403, 404 ou 409.

## Onde está cada requisito

| Requisito | Onde |
|---|---|
| Spring Data JPA | pacote `repository` |
| Camadas Repository, Service, Controller | pacotes `repository`, `service`, `controller` (regras de negócio nos services) |
| DTOs com `record` | pacote `dto` (as entidades de `model` nunca vão no corpo das requisições) |
| CRUD completo | `Categoria` e `Produto` (`Pedido` tem criar, listar, buscar e excluir) |
| Relacionamento 1:N | `Categoria` 1:N `Produto` e `Pedido` 1:N `ItemPedido` |
| Duas consultas com filtro | `GET /categorias/{id}/produtos` e `GET /produtos?nome=&cor=&precoMax=` |
| Login (JWT) | `AuthController`, `AuthService`, `SecurityConfig` |
| Perfis admin/comum (extra) | claim `perfil` no token + `hasRole("ADMIN")` no `SecurityConfig` |

Regras de negócio nos services: categoria com produtos não pode ser excluída; produto que já está em pedido não pode ser excluído;
pedido não vende mais que o estoque, baixa o estoque e calcula o total; excluir pedido devolve o estoque.

## Front-end: organização

```text
src/app/
├── services/       chamadas HTTP (auth, categoria, produto, pedido), mensagens e erros
├── interceptors/   coloca o token em toda requisição e trata o 401
├── guards/         authGuard (exige login) e adminGuard (exige perfil ADMIN)
├── menu/           menu de navegação
└── paginas/        login, home, categorias, produtos, busca de produtos, pedidos
```

Nenhum componente chama o `HttpClient`: todos usam os services.

