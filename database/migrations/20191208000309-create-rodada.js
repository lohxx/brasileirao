'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('rodada', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      visitante: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      casa: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      data: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      rodada: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    }).then(() => {
        return queryInterface.addConstraint(
          'rodada',
          ['data', 'casa', 'visitante'],
          { type: 'unique', name: 'rodada' }
        )
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('rodadas');
  }
};