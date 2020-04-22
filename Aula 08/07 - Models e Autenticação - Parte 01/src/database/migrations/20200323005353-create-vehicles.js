module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('vehicles', {
      id_vehicle: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      }, 
      brand: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      model: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      license_plate: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true,
      },
      color: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('vehicles');
  },
};
