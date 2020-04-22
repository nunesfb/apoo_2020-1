module.exports = {
  // aqui estamos usando a configuracao realizada no docker com o SGBD do postgre
  dialect: 'postgres',
  host: 'localhost',
  port: '5432',
  username: 'postgres',
  password: '1234',
  database: 'ride_app',
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
