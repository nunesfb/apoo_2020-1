import Sequelize, { Model } from 'sequelize';

class Driver extends Model {
  static init(sequelize) {
    // aqui estou chamando o metodo init da classe model
    super.init(
      {
        // estes campos sao apenas os campos que o usuario vai poder preencher
        // eles nao sao necessariamente um reflexo dos campos da tabela no bd
        id_driver: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        cnh: Sequelize.BIGINT,
        active: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    // sempre vou retornar o model que acabou de ser inicializado
    return this;
  }

  // aqui estou fazendo o relacionamento entre os models
  // nao posso ter duas foreign key com nomes iguais e é bom add um apelido a ela
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'id_user', as: 'user' });
    this.belongsTo(models.Vehicle, {
      foreignKey: 'id_vehicle',
      as: 'vehicle',
    });
  }
}

export default Driver;
