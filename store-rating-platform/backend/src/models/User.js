const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
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
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: false,
    validate: {
      len: { args: [0, 400], msg: 'Address cannot exceed 400 characters' },
    },
  },
  role: {
    type: DataTypes.ENUM('ADMIN', 'USER', 'STORE_OWNER'),
    allowNull: false,
    defaultValue: 'USER',
  },
}, {
  tableName: 'users',
  indexes: [
    { fields: ['email'] },
    { fields: ['role'] },
    { fields: ['name'] },
  ],
});

module.exports = User;
