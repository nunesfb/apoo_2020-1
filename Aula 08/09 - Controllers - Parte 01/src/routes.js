// aqui não preciso desta forma importar todo express, mas somente o Router
import { Router } from 'express';

// aqui estou importando o middleware de autenticacao da minha aplicacao
import authMiddleware from './app/middlewares/auth';

// middleware para verificar se o user é admin
import AdminMiddleware from './app/middlewares/admin';

// importar o controller de Sessao
import SessionController from './app/controllers/SessionController';
// importar o controller do Usuario
import UserController from './app/controllers/UserController';
// importar o controller do Motorista
import DriverController from './app/controllers/DriverController';
// importar o controller do Veiculo
import VehicleController from './app/controllers/VehicleController';
// importar o controller da Carona
import RideController from './app/controllers/RideController';
// importar o controller do Status da Carona
import StatusRideController from './app/controllers/StatusRideController';

// usando o metodo Router no routes
const routes = new Router();

// cadastro do usuario
routes.post('/users', UserController.store);

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

// selecao dos usuarios
routes.get('/users', AdminMiddleware, UserController.index);
// selecao do usuario
routes.get('/users/:id_user', AdminMiddleware, UserController.details);

// cadastro do motorista
routes.post('/drivers', DriverController.store);
// selecao dos motoristas
routes.get('/drivers', AdminMiddleware, DriverController.index);
// selecao do motorista
routes.get('/drivers/:id_driver', AdminMiddleware, DriverController.details);

// cadastro do veiculo
routes.post('/vehicles', VehicleController.store);
// selecao dos veiculos
routes.get('/vehicles', AdminMiddleware, VehicleController.index);
// selecao do veiculo
routes.get('/vehicles/:id_vehicle', AdminMiddleware, VehicleController.details);

// cadastro da carona
routes.post('/ride', RideController.store);
// selecao das caronas de cada usuario em específico
routes.get('/all_ride', RideController.index);
// selecao das caronas de cada usuario em específico
routes.get('/ride', RideController.details);

// cadastro da carona
routes.post('/status_ride', StatusRideController.store);
// selecao das caronas
routes.get('/status_ride', StatusRideController.index);

export default routes;
 
// para testar
// node src/server.js
