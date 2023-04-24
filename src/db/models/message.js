'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Message.belongsTo(models.User, {
        foreignKey: 'senderId'
      });

      Message.belongsTo(models.User, {
        foreignKey: 'receiverId'
      });
    }
  }
  Message.init({
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
    },
    text: DataTypes.STRING,
    date: DataTypes.DATE,
    hasBeenEdited: DataTypes.BOOLEAN,
    isFromGroup: DataTypes.BOOLEAN,
    isRead: DataTypes.BOOLEAN,
    senderId: {
      type: DataTypes.UUIDV4,
      primaryKey: false,
      defaultValue: DataTypes.UUIDV4,
      allowNull: true,
      autoIncrement: false,
    },
    receiverId: {
      type: DataTypes.UUIDV4,
      primaryKey: false,
      defaultValue: DataTypes.UUIDV4,
      allowNull: true,
      autoIncrement: false,
    },
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};