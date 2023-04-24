'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      text: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATE
      },
      hasBeenEdited: {
        type: Sequelize.BOOLEAN
      },
      isFromGroup: {
        type: Sequelize.BOOLEAN
      },
      isRead: {
        type: Sequelize.BOOLEAN
      },
      senderId: {
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        type: Sequelize.UUID
      },
      receiverId: {
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        type: Sequelize.UUID
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Messages');
  }
};