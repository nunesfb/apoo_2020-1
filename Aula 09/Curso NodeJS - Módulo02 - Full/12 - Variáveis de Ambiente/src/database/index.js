import Mongoose from 'mongoose';

class Database {
  constructor() {
    // aqui no construtor, chamo o metodo init para ser executado quando rodar a aplicacao
    this.init();
  }

  init() {
    // estou realizando a conexao com o Mongoose
    this.mongoConnection = Mongoose.connect(
      // aqui é a url de conexao e depois o nome da base dados
      // a base de dados é iniciada automaticamente
      // depois temos algumas configs do mongodb para novas versões
      process.env.MONGO_URL,
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      }
    );
  }
}

export default new Database();
