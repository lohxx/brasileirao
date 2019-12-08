'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rodada = sequelize.define('Rodada', {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    visitante: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    casa: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    data: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    rodada: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  }, { tableName: 'rodada', timestamps: false });
  Rodada.associate = function(models) {
    // associations can be defined here
  };
  return Rodada;
};