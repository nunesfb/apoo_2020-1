import Sequelize from 'sequelize';
// importo o model da minha aplicacao
import User from '../app/models/User';
import Vehicle from '../app/models/Vehicle'; 
import Driver from '../app/models/Driver'; 
import Ride from '../app/models/Ride'; 
import StatusRide from '../app/models/Status_Ride'; 
// importo as configuracoes de conexao com o banco
import databaseConfig from '../config/database';

// aqui vai ser um array contendo todos os models da minha aplicacao
const models = [User, Vehicle, Driver, Ride, StatusRide];
 
class Database {
  constructor() {
    // aqui no construtor, chamo o metodo init para ser executado quando rodar a aplicacao
    this.init();
  }

  init() {
    // aqui estou pegando os dados de conexao do config/database e passando junto ao sequelize
    // isto vai ficar armazenado na variavel connection
    this.connection = new Sequelize(databaseConfig);
    // agora aqui eu pego e percorro o array com todos os modelos da minha aplicacao
    // e chamo o metodo contido em cada model (init)
    // passo o parametro solicitado pelo init (sequelize) , que é os dados de conexao
    models
    .map(model => model.init(this.connection))
    // aqui vou fazer um segundo map
    // percorro os models e chamo para cada um o associate
    // vou chamar o associate somente se ele existir no model
    // a segunda parte vai executar somente se ele existir
    // na segunda parte passo os models como parametro
    .map(
      model =>
          model.associate && model.associate(this.connection.models)
  );
  }
}

export default new Database();
