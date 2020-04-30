// aqui não preciso desta forma importar todo express, mas somente o Router
import { Router } from 'express';

// aqui vamos importar a biblioteca do multer
import multer from 'multer';
// aqui vamos importar as configuracoes do multer
import multerConfig from './config/multer';

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
// importar o controller do Avatar Image
import AvatarImageController from './app/controllers/AvatarImageController';

// usando o metodo Router no routes
const routes = new Router();

// o upload vai ter o multer com as configuracoes
const upload = multer(multerConfig);

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
// atualizacao do usuario
routes.put('/users', UserController.update);

// vamos criar uma rota que recebe o arquivo
// como vai ser um unico arquivo, vamos usar o single e vai ter file como nome do parametro
// depois disso vamos acionar o store criado no FileController para armazenar o arquivo
// colocamos depois da autenticacao, pois o usuario vai enviar sua foto de perfil
// somente quando tiver atualizando, no cadastro nao faz isso
// retornar req.file traz os dados do arquivo (res.json(req.file))
routes.put(
  '/avatar',
  upload.single('file'),
  AvatarImageController.update_avatar_image
);

// cadastro do motorista
routes.post('/drivers', DriverController.store);
// selecao dos motoristas
routes.get('/drivers', AdminMiddleware, DriverController.index);
// selecao do motorista
routes.get('/drivers/:id_driver', AdminMiddleware, DriverController.details);
// atualizacao do motorista
routes.put('/drivers', DriverController.update);

// cadastro do veiculo
routes.post('/vehicles', VehicleController.store);
// selecao dos veiculos
routes.get('/vehicles', AdminMiddleware, VehicleController.index);
// selecao do veiculo
routes.get('/vehicles/:id_vehicle', AdminMiddleware, VehicleController.details);
// atualizacao do veiculo
routes.put('/vehicles/:id_vehicle', VehicleController.update);
// atualizacao do veiculo
routes.delete('/vehicles/:id_vehicle', VehicleController.delete);

// cadastro da carona
routes.post('/ride', RideController.store);
// selecao das caronas de cada usuario em específico
routes.get('/all_ride', RideController.index);
// selecao das caronas de cada usuario em específico
routes.get('/ride', RideController.details);
// atualizacao da carona
routes.put('/ride/:id_ride', RideController.update);

// cadastro da carona
routes.post('/status_ride', StatusRideController.store);
// selecao das caronas
routes.get('/status_ride', StatusRideController.index);
// atualizacao da carona
routes.put('/status_ride/:id_status_ride', StatusRideController.update);

export default routes;

// para testar
// node src/server.js
