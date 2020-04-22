import Sequelize, { Model } from 'sequelize';

class Ride extends Model {
  static init(sequelize) {
    // aqui estou chamando o metodo init da classe model
    super.init(
      {
        // estes campos sao apenas os campos que o usuario vai poder preencher
        // eles nao sao necessariamente um reflexo dos campos da tabela no bd
        id_ride: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        date_time: Sequelize.DATE,
        status: Sequelize.BOOLEAN,
        individual_amount: Sequelize.NUMERIC(10, 2),
        number_seats: Sequelize.INTEGER,
      },
      {
        sequelize,
        freezeTableName: 'ride',
        tableName: 'ride',
      }
    );

    // sempre vou retornar o model que acabou de ser inicializado
    return this;
  }

  // aqui estou fazendo o relacionamento entre os models
  // nao posso ter duas foreign key com nomes iguais e é bom add um apelido a ela
  static associate(models) {
    this.belongsTo(models.Driver, {
      foreignKey: 'id_driver',
      as: 'driver',
    });
  }
}

export default Ride;
