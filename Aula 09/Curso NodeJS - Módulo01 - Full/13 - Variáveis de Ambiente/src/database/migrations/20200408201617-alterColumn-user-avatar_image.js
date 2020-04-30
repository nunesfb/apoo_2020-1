module.exports = {
  // como a migration ja ocorreu e se fizer files antes, nao vai achar a tabela users
  // vamos criar uma nova migration
  up: (queryInterface, Sequelize) => {
    // aqui estou passando que vai ser criado o atributo avatar_id na tabela users
    return queryInterface.addColumn('users', 'avatar_image', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: queryInterface => {
    // aqui remove o atributo que foi criado na tabela
    return queryInterface.removeColumn('users', 'avatar_image');
  },
};
