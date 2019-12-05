'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('classificacao', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      time: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      ano: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      vitorias: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      empates: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      derrotas: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      gp: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      gc: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      pontos: {
        allowNull: false,
        type: DataTypes.INTEGER 
      },
      sg: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      ca: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      cv: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      jogos: {
        allowNull: false,
        type: DataTypes.INTEGER
      }
    }).then(() => {
      return queryInterface.addConstraint('classificacao', ['ano', 'time'], {
        type: 'unique',
        name: 'ano_time_unique'
      });
    });

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
