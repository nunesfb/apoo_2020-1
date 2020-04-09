// módulo para criptografar a senha
const bcrypt = require('bcryptjs');

module.exports = {
  up: QueryInterface => {
    // bulk insert: carrega dados de um arquivo de dados em uma tabela
    return QueryInterface.bulkInsert(
      'users',
      [
        {
          name: 'admin',
          cpf: '12345678912',
          email: 'admin@test.com',
          telephone: '55 9999-9999',
          date_birth: '01/01/2000',
          gender: 'M',
          admin: true,
          password_hash: bcrypt.hashSync('admin', 8),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
