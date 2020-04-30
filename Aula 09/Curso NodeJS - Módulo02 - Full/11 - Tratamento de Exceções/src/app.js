// essa aqui é uma sintaxe antiga do commonJS
import express from 'express';
import path from 'path';

import Youch from 'youch';

// tem que colocar depois das rotas
import 'express-async-errors';

import routes from './routes';
// vamos importar o index.js da pasta database
import './database';

class App {
  // o metodo constructor é chamado automaticamente quando instanciamos a classe
  constructor() {
    // aqui o server vai receber o express e usamos o server daqui em diante
    this.server = express();

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  // vou cadastrar todos middlewares da aplicacao aqui com o use
  middlewares() {
    // a partir deste momento a nossa aplicacao pode receber requisicoes em formato json
    this.server.use(express.json());

    // especifico a pasta files e digo que dentro dela pode ser usado pelo navegador direto
    // uso o recurso path do node
    // ai passo o caminho até a pasta upload
    this.server.use(
      '/announcements',
      express.static(path.resolve(__dirname, '..', 'uploads'))
    );
  }

  // aqui vai estar a chamada de todas rotas da aplicacao
  routes() {
    // estou dizendo para ser usada as rotas que estao oriundas do arquivo routes.js
    this.server.use(routes);
  }

  exceptionHandler() {
    // estamos criando um middleware de tratamento de excecao (recebe primeiro o erro)
    // vamos instalar o youch (faz uma tratativa das mensagens de erro)
    // yarn add youch
    // para pegar erros que ocorrem em funcoes async no express
    // yarn add express-async-errors
    this.server.use(async (err, req, res, next) => {
      const errors = await new Youch(err, req).toJSON();

      return res.status(500).json(errors);
    });
  }
}

// só o server faz sentido exportar, as demais ficam privadas
export default new App().server;
