'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('countries', 'icon_path', 'icon');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('countries', 'icon_path', 'icon');
  }
};
