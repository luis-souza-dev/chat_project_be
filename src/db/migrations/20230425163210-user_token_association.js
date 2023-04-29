'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
      await queryInterface.addColumn(
        'Users', // name of Source model
        'RefreshTokenId', // name of the key we're adding 
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'RefreshTokens', // name of Target model
            key: 'id', // key in Target model that we're referencing
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      );
      await queryInterface.addColumn(
        'RefreshTokens', // name of Source model
        'UserId', // name of the key we're adding 
        {
          type: Sequelize.UUID,
          references: {
            model: 'Users', // name of Target model
            key: 'id', // key in Target model that we're referencing
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

      await queryInterface.removeColumn('Users', 'TokenId');
      await queryInterface.removeColumn('RefreshTokens', 'UserId');
  }
};
