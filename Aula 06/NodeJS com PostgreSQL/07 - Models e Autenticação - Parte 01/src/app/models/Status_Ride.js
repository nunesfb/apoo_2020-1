import Sequelize, { Model } from 'sequelize';

class StatusRide extends Model {
  static init(sequelize) {
    // aqui estou chamando o metodo init da classe model
    super.init(
      {
        // estes campos sao apenas os campos que o usuario vai poder preencher
        // eles nao sao necessariamente um reflexo dos campos da tabela no bd
        id_status_ride: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        status: Sequelize.BOOLEAN,
        user_classification: Sequelize.INTEGER,
      },
      {
        sequelize,
        freezeTableName: 'status_ride',
        tableName: 'status_ride',
      }
    );

    // sempre vou retornar o model que acabou de ser inicializado
    return this;
  }

  // aqui estou fazendo o relacionamento entre os models
  // nao posso ter duas foreign key com nomes iguais e é bom add um apelido a ela
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'id_user', as: 'user' });
    this.belongsTo(models.Ride, {
      foreignKey: 'id_ride',
      as: 'ride',
    });
  }
}

export default StatusRide;
