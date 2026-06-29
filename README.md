# Users CRUD — teaching app

A minimal full-stack app: **HTML + CSS + JS** frontend, **Express + SQLite** backend.

## Run it

```bash
npm install
npm start
```

Then open http://localhost:3000

## What's inside

| File                | Concept            |
| ------------------- | ------------------ |
| `public/index.html` | structure (HTML)   |
| `public/style.css`  | styling (CSS)      |
| `public/app.js`     | browser JS + fetch |
| `server.js`         | Express + SQLite   |

## API

| Method | Route               | Does                  |
| ------ | ------------------- | --------------------- |
| GET    | `/api/users`        | get all users         |
| GET    | `/api/users/:course`| get users by course   |
| POST   | `/api/users`        | create a user         |
| PUT    | `/api/users/:id`    | edit a user's course  |
| DELETE | `/api/users/:id`    | delete a user         |
