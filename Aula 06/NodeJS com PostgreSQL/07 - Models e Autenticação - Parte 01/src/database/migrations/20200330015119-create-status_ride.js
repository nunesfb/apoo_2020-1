module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('status_ride', {
      id_status_ride: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      user_classification: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      id_ride: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'ride', key: 'id_ride' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id_user' },
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
    return queryInterface.dropTable('status_ride');
  },
};
