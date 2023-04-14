'use strict';
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'countries',
      'code',
      {type: DataTypes.STRING, unique: true, allowNull: false}
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('countries', 'code');
  }
};
