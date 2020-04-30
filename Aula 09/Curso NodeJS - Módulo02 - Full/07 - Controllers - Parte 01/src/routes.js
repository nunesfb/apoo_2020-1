// aqui não preciso desta forma importar todo express, mas somente o Router
import { Router } from 'express';

// aqui estou importando o middleware de autenticacao da minha aplicacao
import authMiddleware from './app/middlewares/auth';

// middleware para verificar se o user é admin
import AdminMiddleware from './app/middlewares/admin';

// importar o controller de Sessao
import SessionController from './app/controllers/SessionController';

// importar o controller de Company
import CompanyController from './app/controllers/CompanyController';

// usando o metodo Router no routes
const routes = new Router();
 
// rota de autenticacao
routes.post('/session', SessionController.session);

// criar company
routes.post('/company', CompanyController.insert);

// aqui vou definir ele como sendo um middleware global
// ele só vai valer para as rotas que vierem depois dele
// desta forma, o post anterior não tem este middleware
routes.use(authMiddleware);

// buscar todas company
routes.get('/company', AdminMiddleware, CompanyController.index);
// buscar uma company
routes.get('/company/:id_company', AdminMiddleware, CompanyController.details);
// atualizar status de uma company
routes.put(
  '/company/updateStatusCompany/:id_company',
  AdminMiddleware,
  CompanyController.updateCompanyStatus
);
// atualizar status de uma company
routes.put('/company', CompanyController.updateCompany);

export default routes;
