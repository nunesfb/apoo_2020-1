// isso vai carregar todas variaveis do ambiente
// e colocar dentro de uma variavel global do node
// que se chama process.env
require('dotenv/config');

module.exports = {
  // aqui estamos usando a configuracao realizada no docker com o SGBD do postgre
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: '5432',
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    // sempre grava o insert e update da tabela
    timestamps: true,
    // tenho um padrao de escrita das tabelas, usando underscore
    underscored: true,
    // tenho um padrao de escrita dos atributos da tabela, idem ao anterior
    underscoredAll: true,
  },
};

// para criarmos uma migration
// yarn sequelize migration:create --name=create_users
// yarn sequelize db:migrate

// para desfazermos uma migration
// yarn sequelize db:migrate:undo - desfaz a ultima migration
// yarn sequelize db:migrate:undo:all - desfaz todas migrations
