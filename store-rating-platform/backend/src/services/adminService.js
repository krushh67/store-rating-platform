const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User, Store, Rating } = require('../models');
const sequelize = require('../config/database');

const getDashboard = async () => {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    User.count({ where: { role: { [Op.ne]: 'ADMIN' } } }),
    Store.count(),
    Rating.count(),
  ]);
  return { totalUsers, totalStores, totalRatings };
};

const createUser = async ({ name, email, password, address, role }) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw { status: 409, message: 'Email already registered' };
  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashed, address, role: role || 'USER' });
  const { password: _, ...userData } = user.toJSON();
  return userData;
};

const getUsers = async ({ name, email, address, role, sortBy = 'name', order = 'asc' }) => {
  const where = {};
  if (name) where.name = { [Op.iLike]: `%${name}%` };
  if (email) where.email = { [Op.iLike]: `%${email}%` };
  if (address) where.address = { [Op.iLike]: `%${address}%` };
  if (role) where.role = role;

  const allowedSort = ['name', 'email', 'address', 'role', 'createdAt'];
  const sortField = allowedSort.includes(sortBy) ? sortBy : 'name';
  const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  return User.findAll({
    where,
    attributes: { exclude: ['password'] },
    order: [[sortField, sortOrder]],
  });
};

const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
    include: [{ model: Store, as: 'stores', include: [{ model: Rating, as: 'ratings' }] }],
  });
  if (!user) throw { status: 404, message: 'User not found' };

  const userData = user.toJSON();
  if (user.role === 'STORE_OWNER' && user.stores.length > 0) {
    const allRatings = user.stores.flatMap(s => s.ratings.map(r => r.rating));
    userData.averageRating = allRatings.length
      ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(2)
      : null;
  }
  return userData;
};

const createStore = async ({ name, email, address, ownerId }) => {
  if (ownerId) {
    const owner = await User.findByPk(ownerId);
    if (!owner || owner.role !== 'STORE_OWNER') {
      throw { status: 400, message: 'Owner must be a user with STORE_OWNER role' };
    }
  }
  return Store.create({ name, email, address, ownerId: ownerId || null });
};

const getStores = async ({ name, email, address, sortBy = 'name', order = 'asc' }) => {
  const where = {};
  if (name) where.name = { [Op.iLike]: `%${name}%` };
  if (email) where.email = { [Op.iLike]: `%${email}%` };
  if (address) where.address = { [Op.iLike]: `%${address}%` };

  const allowedSort = ['name', 'email', 'address', 'createdAt'];
  const sortField = allowedSort.includes(sortBy) ? sortBy : 'name';
  const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  const stores = await Store.findAll({
    where,
    include: [{ model: Rating, as: 'ratings', attributes: ['rating'] }],
    order: [[sortField, sortOrder]],
  });

  return stores.map(s => {
    const store = s.toJSON();
    const ratings = store.ratings || [];
    store.averageRating = ratings.length
      ? (ratings.reduce((a, b) => a + b.rating, 0) / ratings.length).toFixed(2)
      : null;
    delete store.ratings;
    return store;
  });
};

module.exports = { getDashboard, createUser, getUsers, getUserById, createStore, getStores };
