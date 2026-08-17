const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Store = sequelize.define('Store', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
    validate: {
      len: { args: [20, 60], msg: 'Name must be between 20 and 60 characters' },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Must be a valid email address' },
    },
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: false,
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
  },
}, {
  tableName: 'stores',
  indexes: [
    { fields: ['name'] },
    { fields: ['email'] },
    { fields: ['ownerId'] },
  ],
});

module.exports = Store;
