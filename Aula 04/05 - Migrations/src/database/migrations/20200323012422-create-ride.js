module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ride', {
      id_ride: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      }, 
      date_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: true,
      },
      individual_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      number_seats: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      id_driver: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'drivers', key: 'id_driver' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
    return queryInterface.dropTable('ride');
  },
};
