// aqui não preciso desta forma importar todo express, mas somente o Router
import { Router } from 'express';

// importar o controller de Sessao
import SessionController from './app/controllers/SessionController';

// usando o metodo Router no routes
const routes = new Router();

// crio uma rota de teste
routes.get('/test', (req, res) => {
  return res.json({ message: 'OK!' });
});

// rota de autenticacao
routes.post('/session', SessionController.session);

export default routes;

// para testar
// node src/server.js
