import Sequelize, { Model } from 'sequelize';

class Vehicle extends Model {
  static init(sequelize) {
    // aqui estou chamando o metodo init da classe model
    super.init(
      {
        // estes campos sao apenas os campos que o usuario vai poder preencher
        // eles nao sao necessariamente um reflexo dos campos da tabela no bd
        id_vehicle: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        brand: Sequelize.STRING,
        model: Sequelize.STRING,
        license_plate: Sequelize.STRING,
        color: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    // sempre vou retornar o model que acabou de ser inicializado
    return this;
  }
}

export default Vehicle;
