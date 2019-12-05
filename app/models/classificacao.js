module.exports = (sequelize, DataTypes) => {
    const Classificacao = sequelize.define('Classificacao', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
          },
          pontos: {
              allowNull: false,
              type: DataTypes.INTEGER 
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
    }, {tableName: 'classificacao', timestamps: false});

    return Classificacao;
};