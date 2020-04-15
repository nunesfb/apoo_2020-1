// aqui não preciso desta forma importar todo express, mas somente o Router
import { Router } from 'express';
 
// aqui estou importando o middleware de autenticacao da minha aplicacao
import authMiddleware from './app/middlewares/auth';

// importar o controller de Sessao
import SessionController from './app/controllers/SessionController';

// usando o metodo Router no routes
const routes = new Router();

// rota de autenticacao
routes.post('/session', SessionController.session);

// aqui vou definir ele como sendo um middleware global
// ele só vai valer para as rotas que vierem depois dele
// desta forma, o post anterior não tem este middleware
routes.use(authMiddleware); 

// crio uma rota de teste
routes.get('/test', (req, res) => {
  return res.json({ message: 'OK!' });
});

export default routes;

// para testar
// node src/server.js
